const { Telegraf } = require('telegraf');
const Cloudflare = require('cloudflare').default;
require('dotenv').config();
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Masukkan email dan Global API Key Anda di sini atau lewat .env
const apiEmail = process.env.CLOUDFLARE_EMAIL;
const apiKey = process.env.CLOUDFLARE_API_KEY;

// Load user accounts from file
let userAccounts = {};
try {
    userAccounts = JSON.parse(fs.readFileSync('user_accounts.json', 'utf8'));
} catch (e) {}

// Save user accounts to file
function saveAccounts() {
    fs.writeFileSync('user_accounts.json', JSON.stringify(userAccounts, null, 2));
}

// Add Cloudflare account
bot.command('addaccount', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length !== 2) {
        return ctx.reply('Format: /addaccount email@example.com api_key_here');
    }
    const [email, apiKey] = args;
    const userId = ctx.from.id;
    if (!userAccounts[userId]) userAccounts[userId] = [];
    userAccounts[userId].push({ email, apiKey });
    saveAccounts();
    ctx.reply('✅ Akun Cloudflare berhasil ditambahkan!');
});

// List all added accounts
bot.command('listaccounts', (ctx) => {
    const userId = ctx.from.id;
    if (!userAccounts[userId] || userAccounts[userId].length === 0) {
        return ctx.reply('Belum ada akun yang ditambahkan.');
    }
    let msg = 'Akun Cloudflare Anda:\n';
    userAccounts[userId].forEach((acc, i) => {
        msg += `${i + 1}. ${acc.email}\n`;
    });
    ctx.reply(msg);
});

// List all zones from all accounts
bot.command('listzones', async (ctx) => {
    const userId = ctx.from.id;
    if (!userAccounts[userId] || userAccounts[userId].length === 0) {
        return ctx.reply('Belum ada akun yang ditambahkan.');
    }
    let msg = '';
    for (const acc of userAccounts[userId]) {
        try {
            const cf = new Cloudflare({ apiEmail: acc.email, apiKey: acc.apiKey });
            let allZones = [];
            let page = 1;
            let totalPages = 1;
            do {
                const zones = await cf.zones.list({ page, per_page: 50 });
                allZones = allZones.concat(zones.result);
                totalPages = zones.result_info.total_pages;
                page++;
            } while (page <= totalPages);

            allZones.forEach(z => {
                msg += `- ${z.name} (ID: ${z.id})\n`;
            });
        } catch (e) {
            msg += `\nAkun: ${acc.email} (Gagal koneksi)\n`;
        }
    }
    ctx.reply(msg || 'Tidak ada zone yang ditemukan.');
});

// Start command dengan menu utama
bot.start((ctx) => {
    return ctx.reply(
        '🌟 Selamat datang di Cloudflare DNS Manager Bot! 🌟\n\nSilakan pilih menu:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➕ Tambah Akun', callback_data: 'add_account' }],
                    [{ text: '📋 Daftar Akun', callback_data: 'list_accounts' }],
                    [{ text: '🌐 Daftar Zone', callback_data: 'list_zones' }],
                    [{ text: 'ℹ️ Bantuan', callback_data: 'help' }]
                ]
            }
        }
    );
});

// Help command
bot.command('help', (ctx) => {
    ctx.reply(
        `ℹ️ *Bantuan Cloudflare DNS Manager Bot*\n
*Perintah utama:*
/start - Menu utama
/addaccount email api_key - Tambah akun Cloudflare
/listaccounts - Lihat akun yang sudah ditambahkan
/listzones - Lihat semua zone dari semua akun
/help - Tampilkan bantuan

Gunakan tombol menu untuk navigasi lebih mudah!`,
        { parse_mode: 'Markdown' }
    );
});

// Handler tombol menu utama
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data === 'add_account') {
        await ctx.answerCbQuery();
        await ctx.reply('Untuk menambah akun, gunakan format:\n/addaccount email@example.com api_key_here');
    } else if (data === 'list_accounts') {
        await ctx.answerCbQuery();
        ctx.scene = null;
        // Panggil ulang listaccounts
        bot.commands.get('listaccounts')(ctx);
    } else if (data === 'list_zones') {
        await ctx.answerCbQuery();
        // Panggil ulang listzones
        bot.commands.get('listzones')(ctx);
    } else if (data === 'help') {
        await ctx.answerCbQuery();
        bot.commands.get('help')(ctx);
    }
});

bot.launch(); 
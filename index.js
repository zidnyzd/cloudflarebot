const { Telegraf, Markup } = require('telegraf');
const { Cloudflare } = require('cloudflare');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Initialize bot with your token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Store Cloudflare accounts
let cloudflareAccounts = {};

// Load saved accounts if exists
try {
    const savedAccounts = fs.readFileSync('accounts.json', 'utf8');
    cloudflareAccounts = JSON.parse(savedAccounts);
} catch (error) {
    console.log('No saved accounts found');
}

// Save accounts to file
function saveAccounts() {
    fs.writeFileSync('accounts.json', JSON.stringify(cloudflareAccounts, null, 2));
}

// Start command
bot.command('start', async (ctx) => {
    const welcomeMessage = `
🌟 Welcome to Cloudflare DNS Manager Bot! 🌟

I can help you manage your Cloudflare DNS records easily.

Available commands:
/start - Show this message
/addaccount - Add a new Cloudflare account
/listaccounts - List all your accounts
/managedns - Manage DNS records
/help - Show help message

Please use /addaccount to add your first Cloudflare account.
    `;
    
    await ctx.reply(welcomeMessage);
});

// Add account command
bot.command('addaccount', async (ctx) => {
    const message = `
Please provide your Cloudflare credentials in the following format:
/api_key email@example.com

Example:
/api_key your_api_key_here your_email@example.com
    `;
    
    await ctx.reply(message);
});

// Handle API key input
bot.hears(/\/api_key (.+)/, async (ctx) => {
    const [_, apiKey, email] = ctx.match[1].split(' ');
    
    if (!apiKey || !email) {
        return ctx.reply('❌ Invalid format. Please use: /api_key your_api_key_here your_email@example.com');
    }

    try {
        const cf = new Cloudflare({
            token: apiKey
        });

        // Test the API key
        await cf.zones.browse();
        
        // Save the account
        cloudflareAccounts[email] = {
            apiKey,
            email
        };
        
        saveAccounts();
        
        await ctx.reply(`✅ Account added successfully for ${email}!`);
    } catch (error) {
        await ctx.reply('❌ Failed to add account. Please check your API key and try again.');
    }
});

// List accounts command
bot.command('listaccounts', async (ctx) => {
    if (Object.keys(cloudflareAccounts).length === 0) {
        return ctx.reply('No accounts added yet. Use /addaccount to add your first account.');
    }

    let message = '📋 Your Cloudflare Accounts:\n\n';
    for (const [email, account] of Object.entries(cloudflareAccounts)) {
        message += `📧 ${email}\n`;
    }

    await ctx.reply(message);
});

// Manage DNS command
bot.command('managedns', async (ctx) => {
    if (Object.keys(cloudflareAccounts).length === 0) {
        return ctx.reply('No accounts added yet. Use /addaccount to add your first account.');
    }

    const buttons = Object.keys(cloudflareAccounts).map(email => 
        [Markup.button.callback(email, `select_account_${email}`)]
    );

    await ctx.reply('Select an account to manage:', Markup.inlineKeyboard(buttons));
});

// Handle account selection
bot.action(/select_account_(.+)/, async (ctx) => {
    const email = ctx.match[1];
    const account = cloudflareAccounts[email];
    
    try {
        const cf = new Cloudflare({
            token: account.apiKey
        });

        const zones = await cf.zones.browse();
        
        const buttons = zones.result.map(zone => 
            [Markup.button.callback(zone.name, `select_zone_${zone.id}`)]
        );

        await ctx.editMessageText(
            `Select a zone to manage DNS records:`,
            Markup.inlineKeyboard(buttons)
        );
    } catch (error) {
        await ctx.reply('❌ Error fetching zones. Please try again.');
    }
});

// Handle zone selection
bot.action(/select_zone_(.+)/, async (ctx) => {
    const zoneId = ctx.match[1];
    const email = ctx.callbackQuery.data.split('_')[2];
    const account = cloudflareAccounts[email];

    try {
        const cf = new Cloudflare({
            token: account.apiKey
        });

        const records = await cf.dnsRecords.browse(zoneId);
        
        let message = '📝 DNS Records:\n\n';
        records.result.forEach(record => {
            message += `Type: ${record.type}\n`;
            message += `Name: ${record.name}\n`;
            message += `Content: ${record.content}\n`;
            message += `TTL: ${record.ttl}\n`;
            message += '-------------------\n';
        });

        const buttons = [
            [Markup.button.callback('Add Record', `add_record_${zoneId}`)],
            [Markup.button.callback('Back to Zones', 'back_to_zones')]
        ];

        await ctx.editMessageText(message, Markup.inlineKeyboard(buttons));
    } catch (error) {
        await ctx.reply('❌ Error fetching DNS records. Please try again.');
    }
});

// Help command
bot.command('help', async (ctx) => {
    const helpMessage = `
🔍 Cloudflare DNS Manager Bot Help

Commands:
/start - Start the bot
/addaccount - Add a new Cloudflare account
/listaccounts - List all your accounts
/managedns - Manage DNS records
/help - Show this help message

To add an account:
1. Use /addaccount
2. Follow the format: /api_key your_api_key_here your_email@example.com

To manage DNS:
1. Use /managedns
2. Select your account
3. Select the zone
4. View and manage DNS records

Need more help? Contact the bot administrator.
    `;
    
    await ctx.reply(helpMessage);
});

// Start the bot
bot.launch().then(() => {
    console.log('Bot started successfully!');
}).catch((err) => {
    console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 
const Cloudflare = require('cloudflare').default;
require('dotenv').config();

// Masukkan email dan Global API Key Anda di sini atau lewat .env
const apiEmail = process.env.CLOUDFLARE_EMAIL || 'your_email@example.com';
const apiKey = process.env.CLOUDFLARE_API_KEY || 'PASTE_YOUR_GLOBAL_API_KEY_HERE';

async function testCloudflareConnection() {
    try {
        const cf = new Cloudflare({ apiEmail, apiKey });
        // Coba ambil daftar zone
        const zones = await cf.zones.list();
        console.log('Cloudflare connection SUCCESS! Zones:', zones);
    } catch (error) {
        console.error('Cloudflare connection FAILED:', error);
    }
}

testCloudflareConnection(); 
# Cloudflare DNS Manager Telegram Bot

A Telegram bot for managing Cloudflare DNS records with a beautiful interface.

## Features

- Manage multiple Cloudflare accounts
- View and manage DNS records
- Add new DNS records
- User-friendly interface with inline buttons
- Secure storage of API keys

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Telegram bot token:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## Usage

1. Start the bot with `/start`
2. Add your Cloudflare account using `/addaccount`
3. Follow the instructions to add your API key
4. Use `/managedns` to manage your DNS records
5. Use `/listaccounts` to see all your added accounts
6. Use `/help` for more information

## Commands

- `/start` - Start the bot
- `/addaccount` - Add a new Cloudflare account
- `/listaccounts` - List all your accounts
- `/managedns` - Manage DNS records
- `/help` - Show help message

## Security

- API keys are stored locally in `accounts.json`
- Each user can only access their own accounts
- API keys are validated before being stored

## Requirements

- Node.js 14 or higher
- A Telegram bot token (get from @BotFather)
- Cloudflare API key

## License

MIT 
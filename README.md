# Cloudflare DNS Manager Telegram Bot

A Telegram bot for managing Cloudflare DNS records with a beautiful interface.

## Features

- Manage multiple Cloudflare accounts
- View and manage DNS records
- Add new DNS records
- User-friendly interface with inline buttons
- Secure storage of API keys

## Quick Installation

### Using Installation Scripts

#### For Linux/macOS:
```bash
# Download the installation script
wget https://raw.githubusercontent.com/zidnyzd/cloudflarebot/main/install.sh

# Make it executable
chmod +x install.sh

# Run the installation script
./install.sh
```

#### For Windows:
```powershell
# Download the installation script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/zidnyzd/cloudflarebot/main/install.bat" -OutFile "install.bat"

# Run the installation script
.\install.bat
```

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/zidnyzd/cloudflarebot.git
   cd cloudflarebot
   ```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Cloudflare DNS Manager Telegram Bot installation...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Installing npm...${NC}"
    sudo apt-get install -y npm
fi

# Create project directory
echo -e "${GREEN}Creating project directory...${NC}"
mkdir -p cloudflarebot
cd cloudflarebot

# Download the repository
echo -e "${GREEN}Downloading repository...${NC}"
wget https://github.com/zidnyzd/cloudflarebot/archive/refs/heads/main.zip

# Unzip the repository
echo -e "${GREEN}Extracting files...${NC}"
unzip main.zip
mv cloudflarebot-main/* .
rm -rf cloudflarebot-main main.zip

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create .env file
echo -e "${GREEN}Creating .env file...${NC}"
echo "Please enter your Telegram Bot Token:"
read BOT_TOKEN
echo "BOT_TOKEN=$BOT_TOKEN" > .env

echo -e "${GREEN}Installation completed!${NC}"
echo -e "${YELLOW}To start the bot, run:${NC}"
echo "npm start" 
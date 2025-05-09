@echo off
echo Starting Cloudflare DNS Manager Telegram Bot installation...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Create project directory
echo Creating project directory...
mkdir cloudflarebot
cd cloudflarebot

:: Download the repository
echo Downloading repository...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/zidnyzd/cloudflarebot/archive/refs/heads/main.zip' -OutFile 'main.zip'"

:: Extract the repository
echo Extracting files...
powershell -Command "Expand-Archive -Path 'main.zip' -DestinationPath '.'"
move cloudflarebot-main\* .
rmdir /s /q cloudflarebot-main
del main.zip

:: Install dependencies
echo Installing dependencies...
npm install

:: Create .env file
echo Creating .env file...
set /p BOT_TOKEN="Please enter your Telegram Bot Token: "
echo BOT_TOKEN=%BOT_TOKEN% > .env

echo Installation completed!
echo To start the bot, run: npm start
pause 
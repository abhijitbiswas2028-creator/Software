@echo off
REM Abhijit Software Industry - Installation Script for Windows
REM This script will install all necessary dependencies

echo 🚀 Installing Abhijit Software Industry...
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist ".env.local" (
    echo 📝 Creating environment file...
    copy env.example .env.local
    echo ✅ Environment file created (.env.local)
    echo ⚠️  Please edit .env.local and add your OpenAI API key
) else (
    echo ✅ Environment file already exists
)

REM Check if OpenAI API key is set
findstr /C:"sk-your_openai_api_key_here" .env.local >nul
if %errorlevel% equ 0 (
    echo ⚠️  Please update your OpenAI API key in .env.local
) else (
    echo ✅ OpenAI API key appears to be configured
)

echo.
echo 🎉 Installation complete!
echo =========================
echo.
echo Next steps:
echo 1. Edit .env.local and add your OpenAI API key
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo For detailed instructions, see INSTALLATION.md
pause



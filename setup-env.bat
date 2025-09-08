@echo off
REM Setup Environment Variables Script for Windows
REM This script creates .env.local with your actual configuration

echo 🔧 Setting up environment variables...

REM Generate a new NextAuth secret using Node.js
for /f %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"') do set NEXTAUTH_SECRET=%%i

REM Create .env.local file
(
echo # Environment Variables for Abhijit Software Industry
echo # This file contains the actual configuration values
echo.
echo # Site Configuration
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
echo NEXT_PUBLIC_SITE_NAME="Abhijit Software Industry"
echo.
echo # Google Gemini Configuration (for chatbot)
echo # Get your API key from: https://makersuite.google.com/app/apikey
echo GEMINI_API_KEY=your_gemini_api_key_here
echo.
echo # Analytics (optional)
echo NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
echo.
echo # Contact Form (optional - for form submissions)
echo CONTACT_EMAIL=info@abhijitsoftware.com
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=your_email@gmail.com
echo SMTP_PASS=your_app_password
echo.
echo # Database (if you decide to add one later)
echo DATABASE_URL=your_database_connection_string
echo.
echo # Security
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
echo NEXTAUTH_URL=http://localhost:3000
) > .env.local

echo ✅ Environment file created (.env.local)
echo 🔑 NextAuth Secret: %NEXTAUTH_SECRET%
echo.
echo 📝 Your configuration is ready!
echo 🚀 Run 'npm run dev' to start the development server
pause

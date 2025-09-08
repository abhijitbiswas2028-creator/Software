#!/bin/bash

# Setup Environment Variables Script
# This script creates .env.local with your actual configuration

echo "🔧 Setting up environment variables..."

# Generate a new NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# Create .env.local file
cat > .env.local << EOF
# Environment Variables for Abhijit Software Industry
# This file contains the actual configuration values

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Abhijit Software Industry"

# Google Gemini Configuration (for chatbot)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here

# Contact Form (optional - for form submissions)
CONTACT_EMAIL=info@abhijitsoftware.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Database (if you decide to add one later)
DATABASE_URL=your_database_connection_string

# Security
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
EOF

echo "✅ Environment file created (.env.local)"
echo "🔑 NextAuth Secret: $NEXTAUTH_SECRET"
echo ""
echo "📝 Your configuration is ready!"
echo "🚀 Run 'npm run dev' to start the development server"

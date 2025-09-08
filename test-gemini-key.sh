#!/bin/bash

# Script to test Google Gemini API key
# Usage: ./test-gemini-key.sh

echo "🧪 Testing Google Gemini API Key..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

# Load environment variables
source .env.local

# Check if API key is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY not found in .env.local"
    exit 1
fi

echo "🔑 API Key: ${GEMINI_API_KEY:0:20}..."
echo ""

# Test API key with a simple request
echo "🚀 Testing Gemini API connection..."

curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, this is a test message. Please respond with just: API working!"
      }]
    }]
  }' | jq -r '.candidates[0].content.parts[0].text // .error.message // "✅ API key is working!"'

echo ""
echo "🔍 If you see an error message above, check:"
echo "   1. API key is correct"
echo "   2. API key format starts with AIzaSy"
echo "   3. You have internet connection"
echo ""
echo "📊 Check your usage at: https://makersuite.google.com/app/apikey"



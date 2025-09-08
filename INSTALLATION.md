# Installation Guide

This guide will help you install all necessary libraries and dependencies for the Abhijit Software Industry website.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

### 1. Check Node.js Version
```bash
node --version
npm --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies
```bash
# Navigate to project directory
cd "web app"

# Install all dependencies
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy environment file
cp env.example .env.local

# Edit .env.local and add your OpenAI API key
# OPENAI_API_KEY=sk-your_actual_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to `http://localhost:3000`

## 📦 Dependencies Overview

### Core Dependencies (package.json)
```json
{
  "next": "14.0.4",           // React framework
  "react": "^18.2.0",         // UI library
  "react-dom": "^18.2.0",     // DOM rendering
  "typescript": "^5.3.3",     // Type safety
  "tailwindcss": "^3.3.6",    // CSS framework
  "framer-motion": "^10.16.16", // Animations
  "lucide-react": "^0.294.0", // Icons
  "openai": "^4.20.1",        // AI integration
  "axios": "^1.6.2",          // HTTP client
  "react-hot-toast": "^2.4.1" // Notifications
}
```

### Development Dependencies
```json
{
  "eslint": "^8.56.0",        // Code linting
  "eslint-config-next": "14.0.4" // Next.js ESLint config
}
```

## 🔧 Manual Installation

If you prefer to install dependencies manually:

```bash
# Core framework
npm install next@14.0.4 react@^18.2.0 react-dom@^18.2.0

# TypeScript
npm install typescript@^5.3.3 @types/node@^20.10.5 @types/react@^18.2.45 @types/react-dom@^18.2.18

# Styling
npm install tailwindcss@^3.3.6 autoprefixer@^10.4.16 postcss@^8.4.32

# UI Components
npm install framer-motion@^10.16.16 lucide-react@^0.294.0

# AI Integration
npm install openai@^4.20.1

# Utilities
npm install axios@^1.6.2 react-hot-toast@^2.4.1

# Development tools
npm install --save-dev eslint@^8.56.0 eslint-config-next@14.0.4
```

## 🐍 Python Dependencies (Optional)

If you plan to add Python backend services:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or install individually
pip install openai==1.3.0 python-dotenv==1.0.0 fastapi==0.104.1
```

## 🐳 Docker Installation (Alternative)

If you prefer using Docker:

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF

# Build and run
docker build -t abhijit-software .
docker run -p 3000:3000 abhijit-software
```

## 🔍 Verify Installation

### Check if everything is working:

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Check for errors** in the terminal

3. **Open browser** to `http://localhost:3000`

4. **Test the chatbot** (requires OpenAI API key)

5. **Check all pages**:
   - Home page: `/`
   - AI Tools: `/ai-tools`
   - Operating Systems: `/operating-systems`
   - Software: `/software`
   - Shortcuts: `/shortcuts`
   - About: `/about`

## 🚨 Troubleshooting

### Common Issues:

#### 1. Node.js Version Error
```bash
# Error: Node.js version too old
# Solution: Update Node.js
nvm install 18
nvm use 18
```

#### 2. Permission Errors
```bash
# Error: EACCES permission denied
# Solution: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### 3. Port Already in Use
```bash
# Error: Port 3000 already in use
# Solution: Use different port
npm run dev -- -p 3001
```

#### 4. Module Not Found
```bash
# Error: Cannot find module
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. TypeScript Errors
```bash
# Error: TypeScript compilation errors
# Solution: Check tsconfig.json and install types
npm install --save-dev @types/react @types/react-dom @types/node
```

## 📊 System Requirements

### Minimum Requirements:
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Node.js**: 18.0+
- **npm**: 8.0+

### Recommended Requirements:
- **RAM**: 8GB+
- **Storage**: 5GB+ free space
- **Node.js**: 20.0+
- **npm**: 10.0+

## 🔄 Update Dependencies

### Update all dependencies:
```bash
npm update
```

### Update specific package:
```bash
npm install package-name@latest
```

### Check for outdated packages:
```bash
npm outdated
```

## 🧪 Testing Installation

### Run tests (if available):
```bash
npm test
```

### Check build:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 📝 Environment Variables

### Required:
```env
OPENAI_API_KEY=sk-your_api_key_here
```

### Optional:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Abhijit Software Industry"
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## ✅ Installation Checklist

Before running the project, ensure:
- [ ] Node.js 18+ is installed
- [ ] npm is working
- [ ] All dependencies are installed (`npm install`)
- [ ] Environment variables are set (`.env.local`)
- [ ] OpenAI API key is configured
- [ ] Development server starts without errors
- [ ] Website loads in browser
- [ ] All pages are accessible
- [ ] Chatbot is working (if API key is set)

## 🆘 Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify Node.js and npm versions
3. Clear cache and reinstall dependencies
4. Check environment variables
5. Review the troubleshooting section above

## 🎉 Success!

Once everything is installed and running, you should see:
- Beautiful landing page with animations
- Working navigation between sections
- Functional search across all pages
- AI chatbot (if API key is configured)
- Responsive design on all devices

Your Abhijit Software Industry website is now ready to use! 🚀



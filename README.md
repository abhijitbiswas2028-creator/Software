# Abhijit Software Industry

A modern, responsive, full-stack website that serves as a central hub for software downloads, AI tools, operating systems, and product information. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dashboard Landing Page**: Clean, grid-based layout with hover effects and animations
- **AI Tools Section**: Curated collection of AI tools and web applications
- **Operating Systems**: Windows, Linux, and macOS download links
- **Software Downloads**: Categorized software with detailed information
- **Useful Shortcuts**: Curated web resources and developer tools
- **AI Chatbot**: Google Gemini-powered chatbot for intelligent product suggestions and support
- **Search Functionality**: Smart search across all sections
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI/UX**: Beautiful animations and hover effects

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 1.5 Flash
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abhijit-software-industry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Chatbot Setup

The website includes an intelligent AI chatbot powered by Google Gemini 1.5 Flash. To enable it:

1. **Get a Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add it to your environment variables**:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **No billing required** - Gemini offers generous free tier
4. **Test the chatbot** by clicking the chat button on the website

For detailed setup instructions, see [GET_GEMINI_API_KEY.md](./GET_GEMINI_API_KEY.md)

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Alternative Deployment Options

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure redirects for SPA routing

#### AWS Amplify
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `out`
3. Deploy

## 📁 Project Structure

```
abhijit-software-industry/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── ai-tools/          # AI Tools section
│   ├── operating-systems/ # OS downloads
│   ├── software/          # Software downloads
│   ├── shortcuts/         # Web shortcuts
│   └── about/             # About page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   ├── SearchBar.tsx      # Search functionality
│   ├── ProductCard.tsx    # Product display card
│   ├── CategoryCard.tsx   # Category display card
│   ├── Chatbot.tsx        # AI chatbot
│   ├── StatsSection.tsx   # Statistics display
│   └── FeatureSection.tsx # Features display
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## 🎨 Customization

### Colors
Update the color scheme in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ... more shades
  }
}
```

### Content
- **Products**: Update product data in respective page files
- **Team**: Modify team information in `app/about/page.tsx`
- **Company Info**: Update company details in the About page

### Styling
- Modify `app/globals.css` for global styles
- Update component styles using Tailwind classes
- Add custom animations in `tailwind.config.js`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific variables:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
# Add other environment variables as needed
```

### Search Configuration
The search functionality is built into each section. To enhance it:
1. Add a global search API endpoint
2. Implement search indexing
3. Add search analytics

### Chatbot Configuration
The chatbot is fully integrated with Google Gemini:
1. Add your Gemini API key to environment variables
2. The chatbot automatically uses the Gemini API
3. Includes proper error handling and fallback responses

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Performance

- **Image Optimization**: Using Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: Implemented for better performance
- **SEO**: Optimized meta tags and structured data

## 🔒 Security

- **HTTPS**: Required for production
- **Input Validation**: Implemented in forms
- **XSS Protection**: Built-in Next.js security features
- **CSRF Protection**: Next.js built-in protection

## 📊 Analytics

To add analytics:
1. Install Google Analytics or similar service
2. Add tracking code to `app/layout.tsx`
3. Configure conversion tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: info@abhijitsoftware.com
- Phone: +1 (555) 012-3456
- Website: software-opal.vercel.app

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Framer Motion for smooth animations
- Unsplash for the placeholder images

---

**Built with ❤️ by Abhijit Software Industry**

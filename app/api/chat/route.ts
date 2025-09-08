import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Product database for context
const products = {
  'ai-tools': [
    { name: 'ChatGPT', description: 'Advanced AI chatbot for conversations, writing, and problem-solving', category: 'Chat & Conversation' },
    { name: 'Midjourney', description: 'AI-powered image generation from text descriptions', category: 'Image Generation' },
    { name: 'GitHub Copilot', description: 'AI pair programmer that helps you write code faster', category: 'Code Assistant' },
    { name: 'Claude', description: 'Anthropic\'s AI assistant for complex reasoning and analysis', category: 'Chat & Conversation' },
    { name: 'DALL-E 3', description: 'OpenAI\'s latest image generation model with improved quality', category: 'Image Generation' },
    { name: 'Notion AI', description: 'AI writing assistant integrated into Notion workspace', category: 'Productivity' },
    { name: 'Runway ML', description: 'AI video editing and generation platform', category: 'Video & Media' },
    { name: 'Jasper AI', description: 'AI content creation platform for marketing and business', category: 'Content Creation' }
  ],
  'software': [
    { name: 'Microsoft Office 2021', description: 'Complete office suite with Word, Excel, PowerPoint, and Outlook', category: 'Productivity' },
    { name: 'Adobe Photoshop 2024', description: 'Professional image editing and digital art creation software', category: 'Graphics & Design' },
    { name: 'Visual Studio Code', description: 'Free source-code editor with built-in debugging and extensions', category: 'Development' },
    { name: 'Notion', description: 'All-in-one workspace for notes, docs, and project management', category: 'Productivity' },
    { name: 'Figma', description: 'Collaborative interface design tool for teams', category: 'Graphics & Design' },
    { name: 'Blender', description: 'Free 3D creation suite for modeling, animation, and rendering', category: 'Graphics & Design' },
    { name: 'IntelliJ IDEA', description: 'Powerful IDE for Java and other JVM languages', category: 'Development' },
    { name: 'Docker Desktop', description: 'Containerization platform for developing and deploying applications', category: 'Development' },
    { name: 'Postman', description: 'API development and testing platform', category: 'Development' },
    { name: 'Norton 360', description: 'Comprehensive antivirus and internet security suite', category: 'Security' },
    { name: 'VLC Media Player', description: 'Free multimedia player that plays most video and audio formats', category: 'Media & Entertainment' },
    { name: 'Spotify', description: 'Music streaming service with millions of songs and podcasts', category: 'Media & Entertainment' },
    { name: 'OBS Studio', description: 'Free and open source software for video recording and live streaming', category: 'Media & Entertainment' },
    { name: 'Steam', description: 'Digital distribution platform for video games', category: 'Gaming' },
    { name: 'Discord', description: 'Voice, video, and text communication platform for gamers', category: 'Gaming' }
  ],
  'operating-systems': [
    { name: 'Windows 11 Pro', description: 'Latest Windows OS with enhanced security, productivity features, and modern design', category: 'Windows' },
    { name: 'Windows 10 Pro', description: 'Reliable Windows OS with enterprise features and broad compatibility', category: 'Windows' },
    { name: 'Ubuntu 22.04 LTS', description: 'Popular Linux distribution with long-term support and user-friendly interface', category: 'Linux' },
    { name: 'Fedora 39', description: 'Cutting-edge Linux distribution with latest features and technologies', category: 'Linux' },
    { name: 'Debian 12', description: 'Stable and reliable Linux distribution with extensive package repository', category: 'Linux' },
    { name: 'Kali Linux 2023.4', description: 'Penetration testing and security auditing Linux distribution', category: 'Linux' },
    { name: 'macOS Sonoma 14', description: 'Latest macOS with enhanced productivity features and improved performance', category: 'macOS' },
    { name: 'macOS Ventura 13', description: 'Previous generation macOS with proven stability and features', category: 'macOS' }
  ],
  'shortcuts': [
    { name: 'GitHub', description: 'Code hosting platform for version control and collaboration', category: 'Developer Tools' },
    { name: 'Stack Overflow', description: 'Q&A platform for programmers and developers', category: 'Developer Tools' },
    { name: 'MDN Web Docs', description: 'Comprehensive documentation for web technologies', category: 'Developer Tools' },
    { name: 'Dribbble', description: 'Design community and inspiration platform', category: 'Design Resources' },
    { name: 'Behance', description: 'Creative portfolio platform for designers and artists', category: 'Design Resources' },
    { name: 'Unsplash', description: 'High-quality free stock photos and images', category: 'Design Resources' },
    { name: 'Trello', description: 'Visual project management and collaboration tool', category: 'Productivity Tools' },
    { name: 'Slack', description: 'Team communication and collaboration platform', category: 'Productivity Tools' },
    { name: 'Coursera', description: 'Online learning platform with courses from top universities', category: 'Learning Resources' },
    { name: 'freeCodeCamp', description: 'Free coding bootcamp and learning platform', category: 'Learning Resources' }
  ]
}

export async function POST(request: NextRequest) {
  let message: string = ''

  try {
    const body = await request.json()
    message = body.message

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          fallback: 'I can help you find software, AI tools, operating systems, or useful shortcuts. What are you looking for today?'
        },
        { status: 500 }
      )
    }

    // Create context about available products
    const productContext = Object.entries(products)
      .map(([category, items]) => 
        `${category}: ${items.map(item => `${item.name} (${item.description})`).join(', ')}`
      )
      .join('\n')

    const systemPrompt = `You are a helpful AI assistant for Abhijit Software Industry, a platform that provides software downloads, AI tools, operating systems, and useful shortcuts. 

Available products:
${productContext}

Your role:
1. Help users find the right software, AI tools, operating systems, or shortcuts based on their needs
2. Provide specific product recommendations with brief explanations
3. Suggest alternatives when appropriate
4. Be friendly, helpful, and concise
5. If asked about something not in our catalog, politely redirect to what we do offer
6. Always mention the category and provide a brief description of recommended products

Keep responses under 200 words and be conversational.`

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create the prompt for Gemini
    const prompt = `${systemPrompt}\n\nUser: ${message}`

    const result = await model.generateContent(prompt)
    const response = result.response.text() || 'Sorry, I couldn\'t process your request.'

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    // Check if it's a quota exceeded error
    const isQuotaExceeded = error?.status === 429 || error?.code === 'insufficient_quota'
    
    // Fallback responses based on keywords
    const fallbackResponses = {
      'software': 'I can help you find software! We have productivity tools, graphics software, development tools, and security software. What specific type of software are you looking for?',
      'ai tools': 'We have a great collection of AI tools! Some popular ones include ChatGPT alternatives, image generators, code assistants, and productivity AI tools. Would you like me to show you some specific categories?',
      'operating system': 'We offer Windows 11, Windows 10, Windows 7, various Linux distributions (Ubuntu, Fedora, Debian, Kali), and Mac OS versions. Which operating system are you interested in?',
      'download': 'I can help you find download links! Just tell me what software, AI tool, or operating system you\'re looking for, and I\'ll provide you with the download information.',
      'help': 'I\'m here to help you find software, AI tools, operating systems, and useful shortcuts. You can ask me about specific products, categories, or just browse our collections. What would you like to know?',
      'default': 'I\'m here to help you find the perfect software solutions! You can ask me about software downloads, AI tools, operating systems, or useful shortcuts. What are you looking for today?'
    }

    const lowerMessage = message.toLowerCase()
    let fallbackResponse = fallbackResponses.default

    for (const [keyword, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(keyword)) {
        fallbackResponse = response
        break
      }
    }

    // Add specific message for quota exceeded
    if (isQuotaExceeded) {
      fallbackResponse = `I'm currently using fallback responses due to API quota limits. ${fallbackResponse} For the full AI experience, please check your Gemini API key.`
    }

    return NextResponse.json(
      { 
        error: isQuotaExceeded ? 'API quota exceeded' : 'AI service temporarily unavailable',
        response: fallbackResponse,
        fallback: true
      },
      { status: 200 }
    )
  }
}

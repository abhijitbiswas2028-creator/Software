'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, Bot, User,
  Loader2, AlertCircle, CheckCircle, Sparkles
} from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
  isError?: boolean
}

const quickSuggestions = [
  "Best AI tools for coding",
  "Windows 11 vs Ubuntu",
  "Find photo editing software",
  "What antivirus do you recommend?",
  "Compare macOS and Windows"
]

// Clean AI response: strip markdown, asterisks, special formatting chars
function cleanText(text: string): string {
  return text
    // Remove markdown bold/italic: **text** or *text* or __text__ or _text_
    .replace(/\*{1,3}([\s\S]*?)\*{1,3}/g, '$1')
    // Remove markdown headings: ### text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown code fences: ```code```
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code: `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown images: ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove markdown blockquotes: > text
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules: --- or *** or ___
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove strikethrough: ~~text~~
    .replace(/~~([\s\S]*?)~~/g, '$1')
    // Remove table formatting artifacts but keep content
    .replace(/^[\s|:,-]+$/gm, '')
    // Collapse multiple newlines to max 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n').map(l => l.trim()).join('\n')
    .trim()
}

export default function EnhancedChatbot() {
  const getWelcomeMessage = () => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        return u.role === 'admin'
          ? 'Admin mode active. I have full system access. Ask me to run commands, check logs, or manage the server.'
          : 'Welcome. I am your product assistant. I can help you find software, AI tools, operating systems, and shortcuts. What are you looking for today?'
      }
    } catch {}
    return 'Welcome. I am your AI assistant. I can help you find software, AI tools, operating systems, and shortcuts.'
  }

  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date(),
      suggestions: quickSuggestions
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      const history = updatedMessages
        .slice(-11, -1)
        .map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.text }))

      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      const role = userData ? JSON.parse(userData).role : 'user'

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: messageToSend,
          history,
          role,
        }),
      })

      const data = await response.json()
      const cleanResponse = cleanText(data.response || 'No response')

      // Handle warning response
      if (data.warning) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: cleanResponse,
          isUser: false,
          timestamp: new Date(),
          isError: true
        }])
        setIsLoading(false)
        return
      }

      // Handle blocked user response
      if (data.blocked) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: data.response || 'Your account has been blocked for security reasons.',
          isUser: false,
          timestamp: new Date(),
          isError: true
        }])
        setIsLoading(false)
        return
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: cleanResponse,
        isUser: false,
        timestamp: new Date(),
        isError: data.error ? true : false
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Connection error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        isError: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const clearChat = () => {
    const welcomeMsg = userRole === 'admin'
      ? 'Admin mode active. I have full system access. Ask me to run commands, check logs, or manage the server.'
      : 'Welcome. I am your AI assistant. I can help you find software, AI tools, operating systems, and shortcuts.'
    setMessages([
      {
        id: '1',
        text: welcomeMsg,
        isUser: false,
        timestamp: new Date(),
        suggestions: quickSuggestions
      }
    ])
  }

  // Detect user role on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        setUserRole(u.role)
      }
    } catch {}
  }, [])

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-2 w-2 text-white" />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  title="Clear chat"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-primary-600' 
                        : message.isError 
                        ? 'bg-red-500' 
                        : 'bg-gray-200'
                    }`}>
                      {message.isUser ? (
                        <User className="h-3 w-3 text-white" />
                      ) : message.isError ? (
                        <AlertCircle className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-primary-600 text-white'
                          : message.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full hover:bg-primary-100 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about software, AI tools, or OS..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

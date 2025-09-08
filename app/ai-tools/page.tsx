'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Search, 
  ExternalLink, 
  Star, 
  Download,
  Filter,
  Grid,
  List
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'

const aiTools = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Advanced AI chatbot for conversations, writing, and problem-solving',
    category: 'Chat & Conversation',
    rating: 4.9,
    downloads: '100M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://chat.openai.com',
    features: ['Natural conversations', 'Code generation', 'Creative writing', 'Problem solving']
  },
  {
    id: 2,
    name: 'Midjourney',
    description: 'AI-powered image generation from text descriptions',
    category: 'Image Generation',
    rating: 4.8,
    downloads: '50M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    url: 'https://midjourney.com',
    features: ['Text-to-image', 'High quality', 'Artistic styles', 'Custom prompts']
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster',
    category: 'Code Assistant',
    rating: 4.7,
    downloads: '10M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://github.com/features/copilot',
    features: ['Code completion', 'Multi-language', 'IDE integration', 'Smart suggestions']
  },
  {
    id: 4,
    name: 'Claude',
    description: 'Anthropic\'s AI assistant for complex reasoning and analysis',
    category: 'Chat & Conversation',
    rating: 4.8,
    downloads: '25M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://claude.ai',
    features: ['Complex reasoning', 'Long context', 'Safe AI', 'Analysis tools']
  },
  {
    id: 5,
    name: 'DALL-E 3',
    description: 'OpenAI\'s latest image generation model with improved quality',
    category: 'Image Generation',
    rating: 4.9,
    downloads: '75M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    url: 'https://openai.com/dall-e-3',
    features: ['High resolution', 'Better prompts', 'Safety filters', 'Commercial use']
  },
  {
    id: 6,
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion workspace',
    category: 'Productivity',
    rating: 4.6,
    downloads: '30M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://notion.so',
    features: ['Writing assistance', 'Note taking', 'Task management', 'Team collaboration']
  },
  {
    id: 7,
    name: 'Runway ML',
    description: 'AI video editing and generation platform',
    category: 'Video & Media',
    rating: 4.7,
    downloads: '15M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
    url: 'https://runwayml.com',
    features: ['Video editing', 'AI effects', 'Text-to-video', 'Green screen']
  },
  {
    id: 8,
    name: 'Jasper AI',
    description: 'AI content creation platform for marketing and business',
    category: 'Content Creation',
    rating: 4.5,
    downloads: '20M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    url: 'https://jasper.ai',
    features: ['Content writing', 'Marketing copy', 'SEO optimization', 'Brand voice']
  }
]

const categories = ['All', 'Chat & Conversation', 'Image Generation', 'Code Assistant', 'Productivity', 'Video & Media', 'Content Creation']

export default function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Tools & Webpages
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover powerful AI tools and web applications for productivity, creativity, and automation. 
              Find the perfect AI solution for your needs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search AI tools, categories, or features..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex bg-white rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTools.length} of {aiTools.length} AI tools
          </p>
        </div>

        {/* Tools Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard 
                product={tool} 
                viewMode={viewMode}
                type="ai-tool"
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI tools found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

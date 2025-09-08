'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Link as LinkIcon, 
  Search, 
  ExternalLink, 
  Star, 
  Globe,
  Filter,
  Grid,
  List,
  Code,
  Palette,
  Briefcase,
  BookOpen,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'

const shortcuts = [
  // Developer Tools
  {
    id: 1,
    name: 'GitHub',
    description: 'Code hosting platform for version control and collaboration',
    category: 'Developer Tools',
    rating: 4.9,
    downloads: '100M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://github.com',
    features: ['Version control', 'Code hosting', 'Collaboration', 'CI/CD']
  },
  {
    id: 2,
    name: 'Stack Overflow',
    description: 'Q&A platform for programmers and developers',
    category: 'Developer Tools',
    rating: 4.7,
    downloads: '50M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://stackoverflow.com',
    features: ['Q&A', 'Code examples', 'Community', 'Reputation system']
  },
  {
    id: 3,
    name: 'MDN Web Docs',
    description: 'Comprehensive documentation for web technologies',
    category: 'Developer Tools',
    rating: 4.8,
    downloads: '25M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://developer.mozilla.org',
    features: ['Web documentation', 'Tutorials', 'API reference', 'Browser compatibility']
  },
  {
    id: 4,
    name: 'CodePen',
    description: 'Online code editor and community for front-end developers',
    category: 'Developer Tools',
    rating: 4.6,
    downloads: '15M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://codepen.io',
    features: ['Code editor', 'Live preview', 'Community', 'Templates']
  },
  // Design Resources
  {
    id: 5,
    name: 'Dribbble',
    description: 'Design community and inspiration platform',
    category: 'Design Resources',
    rating: 4.5,
    downloads: '30M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://dribbble.com',
    features: ['Design inspiration', 'Portfolio', 'Community', 'Job board']
  },
  {
    id: 6,
    name: 'Behance',
    description: 'Creative portfolio platform for designers and artists',
    category: 'Design Resources',
    rating: 4.4,
    downloads: '20M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://www.behance.net',
    features: ['Portfolio showcase', 'Creative projects', 'Inspiration', 'Networking']
  },
  {
    id: 7,
    name: 'Unsplash',
    description: 'High-quality free stock photos and images',
    category: 'Design Resources',
    rating: 4.8,
    downloads: '100M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://unsplash.com',
    features: ['Free photos', 'High quality', 'No attribution', 'API access']
  },
  {
    id: 8,
    name: 'Coolors',
    description: 'Color palette generator and inspiration tool',
    category: 'Design Resources',
    rating: 4.6,
    downloads: '5M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://coolors.co',
    features: ['Color palettes', 'Generator', 'Inspiration', 'Export options']
  },
  // Productivity Tools
  {
    id: 9,
    name: 'Trello',
    description: 'Visual project management and collaboration tool',
    category: 'Productivity Tools',
    rating: 4.3,
    downloads: '50M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://trello.com',
    features: ['Kanban boards', 'Team collaboration', 'Task management', 'Integrations']
  },
  {
    id: 10,
    name: 'Slack',
    description: 'Team communication and collaboration platform',
    category: 'Productivity Tools',
    rating: 4.2,
    downloads: '200M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://slack.com',
    features: ['Team chat', 'File sharing', 'Integrations', 'Video calls']
  },
  {
    id: 11,
    name: 'Google Workspace',
    description: 'Cloud-based productivity and collaboration suite',
    category: 'Productivity Tools',
    rating: 4.4,
    downloads: '1B+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://workspace.google.com',
    features: ['Gmail', 'Drive', 'Docs', 'Sheets', 'Slides']
  },
  {
    id: 12,
    name: 'Calendly',
    description: 'Scheduling and appointment booking tool',
    category: 'Productivity Tools',
    rating: 4.5,
    downloads: '10M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://calendly.com',
    features: ['Scheduling', 'Calendar sync', 'Automated booking', 'Reminders']
  },
  // Learning Resources
  {
    id: 13,
    name: 'Coursera',
    description: 'Online learning platform with courses from top universities',
    category: 'Learning Resources',
    rating: 4.6,
    downloads: '100M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    url: 'https://www.coursera.org',
    features: ['Online courses', 'Certificates', 'University partners', 'Specializations']
  },
  {
    id: 14,
    name: 'freeCodeCamp',
    description: 'Free coding bootcamp and learning platform',
    category: 'Learning Resources',
    rating: 4.8,
    downloads: '5M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    url: 'https://www.freecodecamp.org',
    features: ['Free courses', 'Coding challenges', 'Certificates', 'Community']
  },
  {
    id: 15,
    name: 'YouTube',
    description: 'Video sharing platform with educational content',
    category: 'Learning Resources',
    rating: 4.5,
    downloads: '2B+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    url: 'https://www.youtube.com',
    features: ['Video content', 'Educational channels', 'Tutorials', 'Live streaming']
  },
  {
    id: 16,
    name: 'Khan Academy',
    description: 'Free online learning platform for all subjects',
    category: 'Learning Resources',
    rating: 4.7,
    downloads: '50M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    url: 'https://www.khanacademy.org',
    features: ['Free education', 'All subjects', 'Practice exercises', 'Progress tracking']
  },
  // AI & Tech
  {
    id: 17,
    name: 'OpenAI',
    description: 'AI research company behind ChatGPT and GPT models',
    category: 'AI & Tech',
    rating: 4.9,
    downloads: '100M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://openai.com',
    features: ['ChatGPT', 'GPT models', 'API access', 'Research papers']
  },
  {
    id: 18,
    name: 'Hugging Face',
    description: 'Machine learning model hub and community',
    category: 'AI & Tech',
    rating: 4.6,
    downloads: '10M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://huggingface.co',
    features: ['Model hub', 'Datasets', 'Spaces', 'Transformers library']
  },
  {
    id: 19,
    name: 'Replit',
    description: 'Online IDE and coding platform with AI assistance',
    category: 'AI & Tech',
    rating: 4.4,
    downloads: '5M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://replit.com',
    features: ['Online IDE', 'AI coding', 'Collaboration', 'Deployment']
  },
  {
    id: 20,
    name: 'Product Hunt',
    description: 'Platform for discovering new products and startups',
    category: 'AI & Tech',
    rating: 4.3,
    downloads: '2M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://www.producthunt.com',
    features: ['Product discovery', 'Startup showcase', 'Community', 'Voting']
  }
]

const categories = [
  'All',
  'Developer Tools',
  'Design Resources', 
  'Productivity Tools',
  'Learning Resources',
  'AI & Tech'
]

const categoryIcons = {
  'Developer Tools': Code,
  'Design Resources': Palette,
  'Productivity Tools': Briefcase,
  'Learning Resources': BookOpen,
  'AI & Tech': Zap
}

export default function ShortcutsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredShortcuts = shortcuts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-4">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Useful Shortcuts & Hyperlinks
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Curated collection of web shortcuts, developer tools, AI resources, and productivity platforms. 
              Quick access to the best online tools and services.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search shortcuts, categories, or tools..."
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
            {categories.map((category) => {
              const IconComponent = category === 'All' ? Globe : categoryIcons[category as keyof typeof categoryIcons]
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category}</span>
                </button>
              )
            })}
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
            Showing {filteredShortcuts.length} of {shortcuts.length} shortcuts
          </p>
        </div>

        {/* Shortcuts Grid/List */}
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
          {filteredShortcuts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard 
                product={item} 
                viewMode={viewMode}
                type="shortcut"
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredShortcuts.length === 0 && (
          <div className="text-center py-12">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shortcuts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}



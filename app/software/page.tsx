'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Search, 
  Star, 
  Package,
  Filter,
  Grid,
  List,
  Palette,
  Code,
  Shield,
  Briefcase,
  Music,
  Camera,
  Gamepad2
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'

const software = [
  // Productivity
  {
    id: 1,
    name: 'Microsoft Office 2021',
    description: 'Complete office suite with Word, Excel, PowerPoint, and Outlook',
    category: 'Productivity',
    rating: 4.5,
    downloads: '500M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop',
    url: 'https://www.microsoft.com/microsoft-365',
    features: ['Word processing', 'Spreadsheets', 'Presentations', 'Email client'],
    version: '2021',
    size: '2.5 GB',
    os: 'Windows, macOS'
  },
  {
    id: 2,
    name: 'Adobe Photoshop 2024',
    description: 'Professional image editing and digital art creation software',
    category: 'Graphics & Design',
    rating: 4.8,
    downloads: '200M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://www.adobe.com/products/photoshop.html',
    features: ['Image editing', 'Digital painting', 'Photo retouching', 'Layer support'],
    version: '2024',
    size: '3.2 GB',
    os: 'Windows, macOS'
  },
  {
    id: 3,
    name: 'Visual Studio Code',
    description: 'Free source-code editor with built-in debugging and extensions',
    category: 'Development',
    rating: 4.9,
    downloads: '100M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://code.visualstudio.com',
    features: ['Syntax highlighting', 'IntelliSense', 'Debugging', 'Extensions'],
    version: '1.85',
    size: '300 MB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 4,
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and project management',
    category: 'Productivity',
    rating: 4.6,
    downloads: '50M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    url: 'https://www.notion.so',
    features: ['Note taking', 'Database', 'Collaboration', 'Templates'],
    version: '2.1',
    size: '150 MB',
    os: 'Windows, macOS, Linux'
  },
  // Graphics & Design
  {
    id: 5,
    name: 'Adobe Illustrator 2024',
    description: 'Vector graphics editor for creating logos, illustrations, and designs',
    category: 'Graphics & Design',
    rating: 4.7,
    downloads: '150M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://www.adobe.com/products/illustrator.html',
    features: ['Vector graphics', 'Logo design', 'Illustration', 'Typography'],
    version: '2024',
    size: '2.8 GB',
    os: 'Windows, macOS'
  },
  {
    id: 6,
    name: 'Figma',
    description: 'Collaborative interface design tool for teams',
    category: 'Graphics & Design',
    rating: 4.8,
    downloads: '75M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://www.figma.com',
    features: ['UI/UX design', 'Collaboration', 'Prototyping', 'Components'],
    version: '116.0',
    size: '200 MB',
    os: 'Web, Windows, macOS'
  },
  {
    id: 7,
    name: 'Blender',
    description: 'Free 3D creation suite for modeling, animation, and rendering',
    category: 'Graphics & Design',
    rating: 4.6,
    downloads: '25M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    url: 'https://www.blender.org',
    features: ['3D modeling', 'Animation', 'Rendering', 'VFX'],
    version: '4.0',
    size: '500 MB',
    os: 'Windows, macOS, Linux'
  },
  // Development
  {
    id: 8,
    name: 'IntelliJ IDEA',
    description: 'Powerful IDE for Java and other JVM languages',
    category: 'Development',
    rating: 4.7,
    downloads: '30M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://www.jetbrains.com/idea/',
    features: ['Java IDE', 'Code analysis', 'Refactoring', 'Debugging'],
    version: '2023.3',
    size: '1.2 GB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 9,
    name: 'Docker Desktop',
    description: 'Containerization platform for developing and deploying applications',
    category: 'Development',
    rating: 4.5,
    downloads: '40M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://www.docker.com/products/docker-desktop',
    features: ['Containerization', 'Orchestration', 'DevOps', 'Microservices'],
    version: '4.26',
    size: '800 MB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 10,
    name: 'Postman',
    description: 'API development and testing platform',
    category: 'Development',
    rating: 4.6,
    downloads: '20M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://www.postman.com',
    features: ['API testing', 'Documentation', 'Mock servers', 'Team collaboration'],
    version: '10.20',
    size: '250 MB',
    os: 'Windows, macOS, Linux'
  },
  // Security
  {
    id: 11,
    name: 'Norton 360',
    description: 'Comprehensive antivirus and internet security suite',
    category: 'Security',
    rating: 4.3,
    downloads: '100M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    url: 'https://www.norton.com',
    features: ['Antivirus', 'Firewall', 'VPN', 'Password manager'],
    version: '2024',
    size: '400 MB',
    os: 'Windows, macOS'
  },
  {
    id: 12,
    name: 'Malwarebytes',
    description: 'Advanced malware protection and removal tool',
    category: 'Security',
    rating: 4.4,
    downloads: '75M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    url: 'https://www.malwarebytes.com',
    features: ['Malware removal', 'Real-time protection', 'Web protection', 'Ransomware protection'],
    version: '4.6',
    size: '200 MB',
    os: 'Windows, macOS'
  },
  // Media & Entertainment
  {
    id: 13,
    name: 'VLC Media Player',
    description: 'Free multimedia player that plays most video and audio formats',
    category: 'Media & Entertainment',
    rating: 4.7,
    downloads: '200M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
    url: 'https://www.videolan.org/vlc/',
    features: ['Multiple formats', 'Streaming', 'Subtitles', 'Equalizer'],
    version: '3.0.18',
    size: '50 MB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 14,
    name: 'Spotify',
    description: 'Music streaming service with millions of songs and podcasts',
    category: 'Media & Entertainment',
    rating: 4.5,
    downloads: '500M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    url: 'https://www.spotify.com',
    features: ['Music streaming', 'Podcasts', 'Playlists', 'Offline mode'],
    version: '1.2.20',
    size: '100 MB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 15,
    name: 'OBS Studio',
    description: 'Free and open source software for video recording and live streaming',
    category: 'Media & Entertainment',
    rating: 4.8,
    downloads: '50M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
    url: 'https://obsproject.com',
    features: ['Live streaming', 'Video recording', 'Scene composition', 'Plugins'],
    version: '30.0',
    size: '150 MB',
    os: 'Windows, macOS, Linux'
  },
  // Gaming
  {
    id: 16,
    name: 'Steam',
    description: 'Digital distribution platform for video games',
    category: 'Gaming',
    rating: 4.6,
    downloads: '300M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    url: 'https://store.steampowered.com',
    features: ['Game library', 'Social features', 'Workshop', 'Trading cards'],
    version: 'Latest',
    size: '300 MB',
    os: 'Windows, macOS, Linux'
  },
  {
    id: 17,
    name: 'Discord',
    description: 'Voice, video, and text communication platform for gamers',
    category: 'Gaming',
    rating: 4.4,
    downloads: '400M+',
    price: 'Freemium',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    url: 'https://discord.com',
    features: ['Voice chat', 'Video calls', 'Text messaging', 'Screen sharing'],
    version: '1.0.9001',
    size: '200 MB',
    os: 'Windows, macOS, Linux'
  }
]

const categories = [
  'All', 
  'Productivity', 
  'Graphics & Design', 
  'Development', 
  'Security', 
  'Media & Entertainment', 
  'Gaming'
]

const categoryIcons = {
  'Productivity': Briefcase,
  'Graphics & Design': Palette,
  'Development': Code,
  'Security': Shield,
  'Media & Entertainment': Music,
  'Gaming': Gamepad2
}

export default function SoftwarePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredSoftware = software.filter(item => {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Software Downloads
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Access productivity, graphics, development, security, and entertainment software. 
              Find the perfect tools for your workflow.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search software, categories, or features..."
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
              const IconComponent = category === 'All' ? Package : categoryIcons[category as keyof typeof categoryIcons]
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
            Showing {filteredSoftware.length} of {software.length} software
          </p>
        </div>

        {/* Software Grid/List */}
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
          {filteredSoftware.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard 
                product={item} 
                viewMode={viewMode}
                type="software"
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredSoftware.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No software found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}



'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Monitor, 
  Search, 
  Download, 
  Star, 
  HardDrive,
  Filter,
  Grid,
  List,
  Square,
  Apple,
  Terminal
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'

const operatingSystems = [
  // Windows
  {
    id: 1,
    name: 'Windows 11 Pro',
    description: 'Latest Windows OS with enhanced security, productivity features, and modern design',
    category: 'Windows',
    rating: 4.6,
    downloads: '500M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    url: 'https://www.microsoft.com/en-us/windows/windows-11',
    features: ['Enhanced security', 'Modern UI', 'Better performance', 'Microsoft Store'],
    version: '22H2',
    size: '4.1 GB',
    os: 'Windows'
  },
  {
    id: 2,
    name: 'Windows 10 Pro',
    description: 'Reliable Windows OS with enterprise features and broad compatibility',
    category: 'Windows',
    rating: 4.4,
    downloads: '1B+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    url: 'https://www.microsoft.com/en-us/windows/windows-10',
    features: ['Enterprise features', 'Broad compatibility', 'Regular updates', 'Cortana'],
    version: '22H2',
    size: '3.5 GB',
    os: 'Windows'
  },
  {
    id: 3,
    name: 'Windows 7 Ultimate',
    description: 'Classic Windows OS with proven stability and performance',
    category: 'Windows',
    rating: 4.2,
    downloads: '800M+',
    price: 'Paid',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    url: 'https://www.microsoft.com/en-us/windows/windows-7',
    features: ['Proven stability', 'Classic interface', 'Low system requirements', 'Aero UI'],
    version: 'SP1',
    size: '2.5 GB',
    os: 'Windows'
  },
  // Linux
  {
    id: 4,
    name: 'Ubuntu 22.04 LTS',
    description: 'Popular Linux distribution with long-term support and user-friendly interface',
    category: 'Linux',
    rating: 4.7,
    downloads: '100M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://ubuntu.com/download',
    features: ['Long-term support', 'User-friendly', 'Large community', 'Snap packages'],
    version: '22.04.3',
    size: '4.7 GB',
    os: 'Linux'
  },
  {
    id: 5,
    name: 'Fedora 39',
    description: 'Cutting-edge Linux distribution with latest features and technologies',
    category: 'Linux',
    rating: 4.5,
    downloads: '50M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://getfedora.org',
    features: ['Latest features', 'Cutting-edge tech', 'RPM packages', 'GNOME desktop'],
    version: '39',
    size: '2.1 GB',
    os: 'Linux'
  },
  {
    id: 6,
    name: 'Debian 12',
    description: 'Stable and reliable Linux distribution with extensive package repository',
    category: 'Linux',
    rating: 4.6,
    downloads: '75M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://www.debian.org/distrib/',
    features: ['Stable base', 'Extensive packages', 'Multiple architectures', 'APT package manager'],
    version: '12.1',
    size: '3.2 GB',
    os: 'Linux'
  },
  {
    id: 7,
    name: 'Kali Linux 2023.4',
    description: 'Penetration testing and security auditing Linux distribution',
    category: 'Linux',
    rating: 4.8,
    downloads: '25M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://www.kali.org/get-kali/',
    features: ['Penetration testing', 'Security tools', 'Forensics tools', 'Wireless testing'],
    version: '2023.4',
    size: '4.8 GB',
    os: 'Linux'
  },
  {
    id: 8,
    name: 'Arch Linux',
    description: 'Lightweight and flexible Linux distribution for advanced users',
    category: 'Linux',
    rating: 4.4,
    downloads: '15M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: 'https://archlinux.org/download/',
    features: ['Lightweight', 'Rolling release', 'Customizable', 'Pacman package manager'],
    version: 'Latest',
    size: '800 MB',
    os: 'Linux'
  },
  // macOS
  {
    id: 9,
    name: 'macOS Sonoma 14',
    description: 'Latest macOS with enhanced productivity features and improved performance',
    category: 'macOS',
    rating: 4.5,
    downloads: '200M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    url: 'https://www.apple.com/macos/sonoma/',
    features: ['Enhanced productivity', 'Improved performance', 'New widgets', 'Safari updates'],
    version: '14.2',
    size: '12.5 GB',
    os: 'macOS'
  },
  {
    id: 10,
    name: 'macOS Ventura 13',
    description: 'Previous generation macOS with proven stability and features',
    category: 'macOS',
    rating: 4.3,
    downloads: '300M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    url: 'https://www.apple.com/macos/ventura/',
    features: ['Stage Manager', 'Continuity Camera', 'Spotlight updates', 'Mail improvements'],
    version: '13.6',
    size: '11.2 GB',
    os: 'macOS'
  },
  {
    id: 11,
    name: 'macOS Monterey 12',
    description: 'Stable macOS version with Universal Control and Focus modes',
    category: 'macOS',
    rating: 4.2,
    downloads: '400M+',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    url: 'https://www.apple.com/macos/monterey/',
    features: ['Universal Control', 'Focus modes', 'Shortcuts app', 'Safari updates'],
    version: '12.7',
    size: '10.8 GB',
    os: 'macOS'
  }
]

const categories = ['All', 'Windows', 'Linux', 'macOS']
const osIcons = {
  Windows: Square,
  Linux: Terminal,
  macOS: Apple
}

export default function OperatingSystemsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredOS = operatingSystems.filter(os => {
    const matchesSearch = os.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         os.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         os.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || os.category === selectedCategory
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4">
              <Monitor className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Operating Systems
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Download Windows 11, 10, 7, Linux distributions, and Mac OS versions. 
              Find the perfect operating system for your needs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search operating systems, versions, or features..."
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
              const IconComponent = category === 'All' ? Monitor : osIcons[category as keyof typeof osIcons]
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
            Showing {filteredOS.length} of {operatingSystems.length} operating systems
          </p>
        </div>

        {/* OS Grid/List */}
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
          {filteredOS.map((os, index) => (
            <motion.div
              key={os.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard 
                product={os} 
                viewMode={viewMode}
                type="os"
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredOS.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No operating systems found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

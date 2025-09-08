'use client'

import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Download, 
  Star, 
  Users, 
  DollarSign,
  Monitor,
  Bot,
  Package,
  Link as LinkIcon
} from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  category: string
  rating: number
  downloads: string
  price: string
  image: string
  url: string
  features?: string[]
  version?: string
  size?: string
  os?: string
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  type: 'ai-tool' | 'software' | 'os' | 'shortcut'
}

export default function ProductCard({ product, viewMode, type }: ProductCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'ai-tool':
        return <Bot className="h-5 w-5" />
      case 'software':
        return <Package className="h-5 w-5" />
      case 'os':
        return <Monitor className="h-5 w-5" />
      case 'shortcut':
        return <LinkIcon className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getActionButton = () => {
    switch (type) {
      case 'ai-tool':
      case 'shortcut':
        return (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Visit Tool</span>
          </a>
        )
      case 'software':
      case 'os':
        return (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </a>
        )
      default:
        return (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Visit</span>
          </a>
        )
    }
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card p-6 flex items-center space-x-6"
      >
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getTypeIcon()}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{product.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{product.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{product.price}</span>
                </div>
                {product.version && (
                  <span>v{product.version}</span>
                )}
                {product.size && (
                  <span>{product.size}</span>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              {getActionButton()}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="card p-6 h-full flex flex-col group"
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            {getTypeIcon()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{product.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{product.downloads}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{product.price}</span>
          </div>
        </div>

        {/* Additional Info */}
        {(product.version || product.size || product.os) && (
          <div className="text-xs text-gray-500 mb-4">
            {product.version && <span>v{product.version}</span>}
            {product.size && <span className="ml-2">{product.size}</span>}
            {product.os && <span className="ml-2">{product.os}</span>}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          {getActionButton()}
        </div>
      </div>
    </motion.div>
  )
}



'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  stats: string
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  stats
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="card card-hover p-6 h-full cursor-pointer group"
      >
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {stats}
          </span>
          
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </motion.div>
    </Link>
  )
}



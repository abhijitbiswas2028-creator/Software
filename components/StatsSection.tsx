'use client'

import { motion } from 'framer-motion'
import { Download, Users, Star, Zap } from 'lucide-react'

const stats = [
  {
    icon: Download,
    value: '10K+',
    label: 'Downloads',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    value: '5K+',
    label: 'Active Users',
    color: 'text-green-600'
  },
  {
    icon: Star,
    value: '4.9',
    label: 'Rating',
    color: 'text-yellow-600'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
    color: 'text-purple-600'
  }
]

export default function StatsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4 ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}



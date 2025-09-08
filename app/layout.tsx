import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import EnhancedChatbot from '@/components/EnhancedChatbot'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abhijit Software Industry - Software Downloads & AI Tools',
  description: 'Central hub for software downloads, AI tools, operating systems, and product information. Find the best software solutions for your needs.',
  keywords: 'software downloads, AI tools, operating systems, Windows, Linux, Mac OS, productivity software',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <EnhancedChatbot />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

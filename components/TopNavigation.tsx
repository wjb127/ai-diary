'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, User, Crown } from 'lucide-react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import LanguageSelector from './LanguageSelector'
import { motion } from 'framer-motion'

export default function TopNavigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/', label: t('navigation.home'), icon: Home },
    { href: '/diary', label: t('navigation.diary'), icon: BookOpen },
    { href: '/profile', label: t('navigation.profile'), icon: User },
    { href: '/subscription', label: t('navigation.subscription'), icon: Crown },
  ]

  return (
    <nav className="hidden sm:block fixed top-0 left-0 right-0 glass-strong backdrop-blur-xl border-b border-white/20 z-50">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div 
                  className="glass-subtle rounded-xl p-2.5"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <BookOpen size={24} style={{ color: 'var(--accent-blue)' }} />
                </motion.div>
                <span className="text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {t('title')}
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <motion.div
                  key={href}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'glass-strong shadow-sm'
                        : 'hover:glass-subtle'
                    }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon 
                        size={18} 
                        style={{ 
                          color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                        }} 
                      />
                    </motion.div>
                    <span 
                      className="text-sm font-medium transition-colors duration-300" 
                      style={{ 
                        color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                      }}
                    >
                      {label}
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  )
}
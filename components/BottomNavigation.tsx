'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, User, Crown } from 'lucide-react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { motion } from 'framer-motion'

export default function BottomNavigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/', label: t('navigation.home'), icon: Home },
    { href: '/diary', label: t('navigation.diary'), icon: BookOpen },
    { href: '/profile', label: t('navigation.profile'), icon: User },
    { href: '/subscription', label: t('navigation.subscription'), icon: Crown },
  ]

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 glass-strong backdrop-blur-xl border-t border-white/20 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-4 px-6 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <motion.div
              key={href}
              whileTap={{ scale: 0.9, y: 2 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="min-w-0 flex-1"
            >
              <Link
                href={href}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'glass-subtle'
                    : 'hover:glass-subtle'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon 
                    size={22} 
                    className="mb-2" 
                    style={{ 
                      color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                    }} 
                  />
                </motion.div>
                <span 
                  className="text-xs font-light truncate transition-colors duration-300" 
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
    </nav>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, User, Crown } from 'lucide-react'

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/diary', label: 'AI 일기장', icon: BookOpen },
    { href: '/profile', label: '프로필', icon: User },
    { href: '/subscription', label: '구독', icon: Crown },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong backdrop-blur-xl border-t border-white/20 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-4 px-6 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 min-w-0 flex-1 transform hover:scale-110 group ${
                isActive
                  ? 'glass-subtle'
                  : 'hover:glass-subtle'
              }`}
            >
              <Icon 
                size={22} 
                className="mb-2 transition-transform duration-300 group-hover:rotate-12" 
                style={{ 
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                }} 
              />
              <span 
                className="text-xs font-light truncate transition-colors duration-300" 
                style={{ 
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
'use client'

import { useLanguage, Language } from '@/app/providers/LanguageProvider'
import { Globe } from 'lucide-react'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en')
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className="glass-strong rounded-2xl p-3 hover:glass transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center space-x-2"
        title={language === 'en' ? 'Switch to Korean' : 'Switch to English'}
      >
        <Globe size={20} style={{ color: 'var(--accent-blue)' }} />
        <span 
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}
        >
          {language === 'en' ? 'EN' : '한국어'}
        </span>
      </button>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { BookOpen, Sparkles, Heart, ArrowRight } from 'lucide-react'
import { useLanguage } from './providers/LanguageProvider'
import LanguageSelector from '@/components/LanguageSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Home() {
  const { t } = useLanguage()
  return (
    <div className="pb-20 sm:pb-0 min-h-screen relative">
      {/* Mobile Language Selector */}
      <div className="sm:hidden">
        <LanguageSelector />
      </div>
      {/* 히어로 섹션 - Jonathan Ive 스타일 */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        
        <div className="relative px-4 sm:px-6 py-12 sm:py-20 text-center">
          {/* 메인 로고/타이틀 */}
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 mx-auto max-w-sm sm:max-w-md mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium sm:font-light mb-3 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('subtitle').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('subtitle').split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* CTA 버튼 - shadcn Button with Framer Motion */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button asChild size="lg" className="group glass hover:glass-strong transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              <Link href="/diary" style={{ color: 'var(--accent-blue)' }}>
                <motion.div
                  whileHover={{ rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <BookOpen size={20} />
                </motion.div>
                {t('startWriting')}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 sm:py-12">
        {/* 주요 기능 - shadcn Card 테스트 */}
        <div className="mb-12 sm:mb-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {/* 간편한 작성 */}
            <motion.div
              whileTap={{ scale: 0.98, y: 2 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="glass-readable group hover:glass-strong transition-all duration-500 p-3 sm:p-6 border-0">
                <CardContent className="text-center p-0">
                  <motion.div 
                    className="glass-subtle rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 inline-block"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <BookOpen style={{ color: 'var(--accent-blue)' }} size={16} className="sm:w-6 sm:h-6" />
                  </motion.div>
                  <CardTitle className="text-xs sm:text-lg font-semibold mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {t('features.easyWriting.title')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                    {t('features.easyWriting.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI 추억보정 */}
            <motion.div
              whileTap={{ scale: 0.98, y: 2 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="glass-readable group hover:glass-strong transition-all duration-500 p-3 sm:p-6 border-0">
                <CardContent className="text-center p-0">
                  <motion.div 
                    className="glass-subtle rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 inline-block"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Sparkles style={{ color: 'var(--accent-purple)' }} size={16} className="sm:w-6 sm:h-6" />
                  </motion.div>
                  <CardTitle className="text-xs sm:text-lg font-semibold mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {t('features.aiEnhancement.title')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                    {t('features.aiEnhancement.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            {/* 안전한 보관 */}
            <motion.div
              whileTap={{ scale: 0.98, y: 2 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="glass-readable group hover:glass-strong transition-all duration-500 p-3 sm:p-6 border-0">
                <CardContent className="text-center p-0">
                  <motion.div 
                    className="glass-subtle rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 inline-block"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Heart style={{ color: 'var(--accent-pink)' }} size={16} className="sm:w-6 sm:h-6" />
                  </motion.div>
                  <CardTitle className="text-xs sm:text-lg font-semibold mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {t('features.secureStorage.title')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                    {t('features.secureStorage.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* 사용 방법 - 모바일 최적화 */}
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-12 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium sm:font-light text-center mb-8 sm:mb-10 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t('howToUse.title')}
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-blue)' }}>
                1
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {t('howToUse.step1')}
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-purple)' }}>
                2
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {t('howToUse.step2')}
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-pink)' }}>
                3
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {t('howToUse.step3')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 추천 대상 - 모바일 최적화 */}
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium sm:font-light text-center mb-8 sm:mb-12 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t('recommendedFor.title')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-8">
            <motion.div 
              className="glass-subtle rounded-xl sm:rounded-2xl p-5 sm:p-6"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div 
                className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                ✍️
              </motion.div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {t('recommendedFor.difficulty.title')}
              </h4>
              <p className="text-sm sm:text-base text-center font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t('recommendedFor.difficulty.description').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t('recommendedFor.difficulty.description').split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </motion.div>
            <motion.div 
              className="glass-subtle rounded-xl sm:rounded-2xl p-5 sm:p-6"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div 
                className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center"
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                💝
              </motion.div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {t('recommendedFor.memories.title')}
              </h4>
              <p className="text-sm sm:text-base text-center font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t('recommendedFor.memories.description').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t('recommendedFor.memories.description').split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

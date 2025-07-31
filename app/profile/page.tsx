'use client'

import { useState, useEffect } from 'react'
import { Calendar, BookOpen, Sparkles, BarChart3, Palette } from 'lucide-react'
import { safeDiaryOperations, Diary } from '@/lib/supabase'
import { useTheme, Theme } from '../providers/ThemeProvider'
import { useLanguage } from '../providers/LanguageProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDiaries: 0,
    thisMonthDiaries: 0,
    averageWordsOriginal: 0,
    averageWordsEnhanced: 0,
  })

  useEffect(() => {
    loadDiaries()
  }, [])

  const loadDiaries = async () => {
    try {
      const diaryData = await safeDiaryOperations.getDiaries()
      setDiaries(diaryData)

      // 데모 데이터 제거 - 이제 Supabase DB만 사용
      console.log('터미널 로그: 프로필 페이지 일기 로드 완료, 총', diaryData.length, '개')

      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisMonthDiaries = diaryData.filter(
        diary => new Date(diary.created_at) >= thisMonthStart
      )

      const totalOriginalWords = diaryData.reduce(
        (sum, diary) => sum + diary.original_content.split(' ').length, 0
      )
      const totalEnhancedWords = diaryData.reduce(
        (sum, diary) => sum + diary.ai_content.split(' ').length, 0
      )

      setStats({
        totalDiaries: diaryData.length,
        thisMonthDiaries: thisMonthDiaries.length,
        averageWordsOriginal: diaryData.length > 0 ? Math.round(totalOriginalWords / diaryData.length) : 0,
        averageWordsEnhanced: diaryData.length > 0 ? Math.round(totalEnhancedWords / diaryData.length) : 0,
      })
    } catch (error) {
      console.error('일기 로딩 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMonthlyData = () => {
    const monthlyCount: { [key: string]: number } = {}
    
    diaries.forEach(diary => {
      const date = new Date(diary.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1
    })

    return Object.entries(monthlyCount)
      .sort()
      .slice(-6)
      .map(([month, count]) => ({ month, count }))
  }

  if (isLoading) {
    return (
      <div className="pb-20 min-h-screen relative">
        <div className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="glass-strong rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <div className="h-6 sm:h-8 glass-subtle rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="h-20 sm:h-24 glass-readable rounded-xl"></div>
                <div className="h-20 sm:h-24 glass-readable rounded-xl"></div>
                <div className="h-20 sm:h-24 glass-readable rounded-xl"></div>
                <div className="h-20 sm:h-24 glass-readable rounded-xl"></div>
              </div>
            </div>
            <div className="glass-strong rounded-xl sm:rounded-2xl h-64 sm:h-80"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 sm:pb-0 min-h-screen relative">
      {/* 헤더 - 모바일 최적화 */}
      <div className="glass-strong sticky top-0 z-40 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <div className="glass-subtle rounded-2xl p-3 sm:p-4 inline-block mb-3 sm:mb-4">
            <BarChart3 style={{ color: 'var(--accent-blue)' }} size={28} className="sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium sm:font-light mb-2 sm:mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('profile.title')}</h1>
          <p className="text-base sm:text-lg font-normal sm:font-light" style={{ color: 'var(--text-secondary)' }}>{t('profile.subtitle')}</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* 테마 선택 카드 */}
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <div className="glass-subtle rounded-xl p-2 mr-3">
              <Palette style={{ color: 'var(--accent-purple)' }} size={18} className="sm:w-5 sm:h-5" />
            </div>
            {t('profile.themeSettings')}
          </h2>
          <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <SelectTrigger className="glass-subtle border-0 focus:glass text-base font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong border-0">
              <SelectItem value="glassmorphism">{t('profile.transparent')}</SelectItem>
              <SelectItem value="neumorphism">{t('profile.soft')}</SelectItem>
              <SelectItem value="classic">{t('profile.traditional')}</SelectItem>
              <SelectItem value="minimalism">{t('profile.clean')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 통계 카드 - 모바일 최적화 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--text-light)' }}>{t('profile.stats.totalDiaries')}</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>{stats.totalDiaries}</p>
              </div>
              <div className="glass-subtle rounded-xl p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                <BookOpen style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--text-light)' }}>{t('profile.stats.thisMonth')}</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>{stats.thisMonthDiaries}</p>
              </div>
              <div className="glass-subtle rounded-xl p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                <Calendar style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--text-light)' }}>{t('profile.stats.avgOriginal')}</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-purple)' }}>{stats.averageWordsOriginal}</p>
              </div>
              <div className="glass-subtle rounded-xl p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 style={{ color: 'var(--accent-purple)' }} size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--text-light)' }}>{t('profile.stats.avgEnhanced')}</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-pink)' }}>{stats.averageWordsEnhanced}</p>
              </div>
              <div className="glass-subtle rounded-xl p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles style={{ color: 'var(--accent-pink)' }} size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* 월별 차트 및 최근 일기 - 모바일 최적화 */}
        <div className="space-y-6 sm:space-y-8">
          <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
              <div className="glass-subtle rounded-xl p-2 mr-3">
                <BarChart3 style={{ color: 'var(--accent-blue)' }} size={18} className="sm:w-5 sm:h-5" />
              </div>
              {t('profile.monthlyStats')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {getMonthlyData().map(({ month, count }) => (
                <div key={month} className="flex items-center group">
                  <span className="text-sm sm:text-base font-medium w-16 sm:w-20" style={{ color: 'var(--text-secondary)' }}>{month}</span>
                  <div className="flex-1 mx-3 sm:mx-4">
                    <div className="glass-subtle rounded-full h-2 sm:h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:scale-105"
                        style={{
                          background: 'var(--accent-blue)',
                          width: `${Math.min((count / Math.max(...getMonthlyData().map(d => d.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-bold min-w-[2rem] text-right" style={{ color: 'var(--accent-blue)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
              <div className="glass-subtle rounded-xl p-2 mr-3">
                <Calendar style={{ color: 'var(--accent-blue)' }} size={18} className="sm:w-5 sm:h-5" />
              </div>
              {t('profile.recentDiaries')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {diaries.slice(0, 3).map((diary) => (
                <div key={diary.id} className="glass-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4 group hover:glass-strong transition-all duration-300 transform hover:scale-105" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                  <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>{diary.title}</h3>
                  <p className="text-xs sm:text-sm mb-2 sm:mb-3 truncate leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{diary.original_content}</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-light)' }}>
                    {new Date(diary.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
              {diaries.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="glass-subtle rounded-3xl p-6 sm:p-8 max-w-sm mx-auto">
                    <div className="glass-readable rounded-2xl p-4 mb-4 sm:mb-6 inline-block">
                      <BookOpen size={32} className="sm:w-10 sm:h-10" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <p className="text-base sm:text-lg font-medium mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>{t('profile.noDiaries')}</p>
                    <p className="text-sm sm:text-base font-normal" style={{ color: 'var(--text-secondary)' }}>{t('profile.firstDiary')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 일기 작성 팁 - 모바일 최적화 */}
          <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('profile.tips.title')}</h2>
            <div className="space-y-4 sm:space-y-5">
              <div className="glass-subtle rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300">
                <div className="flex items-start">
                  <div className="glass-readable rounded-xl p-2.5 sm:p-3 mr-3 sm:mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen style={{ color: 'var(--accent-blue)' }} size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('profile.tips.consistency.title')}</h4>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {t('profile.tips.consistency.description')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass-subtle rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:glass-strong transition-all duration-300">
                <div className="flex items-start">
                  <div className="glass-readable rounded-xl p-2.5 sm:p-3 mr-3 sm:mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles style={{ color: 'var(--accent-purple)' }} size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('profile.tips.emotions.title')}</h4>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {t('profile.tips.emotions.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
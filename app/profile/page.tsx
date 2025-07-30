'use client'

import { useState, useEffect } from 'react'
import { Calendar, BookOpen, Sparkles, BarChart3 } from 'lucide-react'
import { supabase, Diary } from '@/lib/supabase'

export default function ProfilePage() {
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
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const diaryData = data || []
      setDiaries(diaryData)

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">프로필</h1>
          <p className="text-gray-600">나의 일기 작성 현황을 확인해보세요</p>
        </div>
      </div>

      <div className="px-4 py-6">

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">총 일기 수</p>
                <p className="text-xl font-bold text-blue-600">{stats.totalDiaries}</p>
              </div>
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">이번 달</p>
                <p className="text-xl font-bold text-green-600">{stats.thisMonthDiaries}</p>
              </div>
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">평균 원본 단어</p>
                <p className="text-xl font-bold text-purple-600">{stats.averageWordsOriginal}</p>
              </div>
              <BarChart3 className="text-purple-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">평균 AI 단어</p>
                <p className="text-xl font-bold text-pink-600">{stats.averageWordsEnhanced}</p>
              </div>
              <Sparkles className="text-pink-600" size={24} />
            </div>
          </div>
        </div>

        {/* 월별 차트 및 최근 일기 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2 text-blue-600" size={18} />
              월별 일기 작성 현황
            </h2>
            <div className="space-y-3">
              {getMonthlyData().map(({ month, count }) => (
                <div key={month} className="flex items-center">
                  <span className="text-sm text-gray-600 w-16">{month}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((count / Math.max(...getMonthlyData().map(d => d.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-green-600" size={18} />
              최근 일기
            </h2>
            <div className="space-y-3">
              {diaries.slice(0, 5).map((diary) => (
                <div key={diary.id} className="border-l-4 border-green-600 pl-3">
                  <h3 className="font-medium text-gray-800 truncate text-sm">{diary.title}</h3>
                  <p className="text-xs text-gray-600 truncate">{diary.original_content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(diary.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
              {diaries.length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm">아직 작성된 일기가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 일기 작성 팁 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">일기 작성 팁</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <BookOpen className="text-blue-600" size={14} />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">꾸준히 작성하기</h4>
                  <p className="text-xs text-gray-600">
                    매일 조금씩이라도 작성하면 더 풍부한 추억을 만들 수 있어요
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                  <Sparkles className="text-purple-600" size={14} />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">감정도 함께 적기</h4>
                  <p className="text-xs text-gray-600">
                    그때의 기분이나 느낌을 함께 적으면 AI가 더 감성적으로 표현해줘요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
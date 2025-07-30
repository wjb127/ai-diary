'use client'

import { useState, useEffect } from 'react'
import { Save, Sparkles, FileText, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { safeDiaryOperations, Diary, isSupabaseConfigured } from '@/lib/supabase'

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [originalText, setOriginalText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [todaysDiary, setTodaysDiary] = useState<Diary | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')

  const enhanceDiary = async () => {
    if (!originalText.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: originalText }),
      })

      const data = await response.json()
      if (data.enhancedText) {
        setEnhancedText(data.enhancedText)
      }
    } catch (error) {
      console.error('일기 변환 오류:', error)
      alert('일기 변환 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDiaryForDate(selectedDate)
  }, [selectedDate])

  const formatDateForDB = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const loadDiaryForDate = async (date: Date) => {
    const diary = await safeDiaryOperations.getDiaryByDate(date)
    setTodaysDiary(diary)
  }

  const saveDiary = async () => {
    if (!title.trim() || !originalText.trim() || !enhancedText.trim()) {
      alert('제목, 원본 일기, 변환된 일기가 모두 필요합니다.')
      return
    }

    if (!isSupabaseConfigured()) {
      alert('데모 모드입니다. 실제 저장을 위해서는 Supabase 설정이 필요합니다.')
      return
    }

    const success = await safeDiaryOperations.saveDiary({
      title,
      original_content: originalText,
      ai_content: enhancedText,
      created_at: selectedDate.toISOString(),
    })

    if (success) {
      alert('일기가 저장되었습니다!')
      setTitle('')
      setOriginalText('')
      setEnhancedText('')
      setShowCreateForm(false)
      loadDiaryForDate(selectedDate)
    } else {
      alert('일기 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const resetForm = () => {
    setTitle('')
    setOriginalText('')
    setEnhancedText('')
    setShowCreateForm(false)
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* 날짜 선택 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-800">AI 일기장</h1>
              <p className="text-sm text-gray-600">{formatDateDisplay(selectedDate)}</p>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={formatDateForDB(selectedDate) >= formatDateForDB(new Date())}
            >
              <ChevronRight size={20} className={formatDateForDB(selectedDate) >= formatDateForDB(new Date()) ? 'text-gray-300' : 'text-gray-600'} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 해당 날짜 일기가 있는 경우 */}
        {todaysDiary ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{todaysDiary.title}</h2>
              <span className="text-sm text-gray-500">
                {new Date(todaysDiary.created_at).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <FileText size={16} className="mr-1" />
                  원본 일기
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {todaysDiary.original_content}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <Sparkles size={16} className="mr-1 text-purple-600" />
                  AI 감성 일기
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {todaysDiary.ai_content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 해당 날짜 일기가 없는 경우 */
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {formatDateForDB(selectedDate) === formatDateForDB(new Date()) 
                  ? "오늘의 일기를 작성해보세요" 
                  : "이 날의 일기가 없습니다"}
              </h3>
              <p className="text-gray-500 mb-6">
                {formatDateForDB(selectedDate) === formatDateForDB(new Date())
                  ? "오늘 있었던 특별한 순간을 기록해보세요"
                  : "다른 날짜를 선택하거나 새 일기를 작성해보세요"}
              </p>
              
              {formatDateForDB(selectedDate) <= formatDateForDB(new Date()) && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  일기 작성하기
                </button>
              )}
            </div>
          </div>
        )}

        {/* 일기 작성 폼 */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={resetForm}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    취소
                  </button>
                  <h2 className="text-lg font-semibold">{formatDateDisplay(selectedDate)}</h2>
                  <button
                    onClick={saveDiary}
                    disabled={!title.trim() || !originalText.trim() || !enhancedText.trim()}
                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium"
                  >
                    저장
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="일기 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="오늘 일을 간단히 휘갈겨 써주세요"
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {enhancedText && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                        <Sparkles size={16} className="mr-1 text-purple-600" />
                        AI 감성 일기
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {enhancedText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 하단 버튼 영역 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={enhanceDiary}
                  disabled={isLoading || !originalText.trim()}
                  className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  <Sparkles className="mr-2" size={20} />
                  {isLoading ? '추억 보정 중...' : 'AI 추억보정'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
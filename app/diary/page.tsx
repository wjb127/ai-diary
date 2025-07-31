'use client'

import { useState, useEffect } from 'react'
import { Sparkles, FileText, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { safeDiaryOperations, Diary, isSupabaseConfigured } from '@/lib/supabase'
import { useLanguage } from '../providers/LanguageProvider'

export default function DiaryPage() {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [originalText, setOriginalText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [todaysDiary, setTodaysDiary] = useState<Diary | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [isNewDiary, setIsNewDiary] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [diaryDatesInMonth, setDiaryDatesInMonth] = useState<number[]>([])

  // 날짜 포맷 함수 (M/D 형식)
  const formatDateForTitle = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()} 일기`
  }

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarDate)
    const firstDay = getFirstDayOfMonth(calendarDate)
    const days = []

    // 빈 칸 추가 (이전 달의 마지막 날들)
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // 현재 달의 날들 추가
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
    setSelectedDate(newDate)
    setShowCalendar(false)
    // 날짜가 변경되면 제목 초기화
    setTitle('')
    setOriginalText('')
    setEnhancedText('')
  }

  const changeCalendarMonth = (direction: number) => {
    const newDate = new Date(calendarDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCalendarDate(newDate)
  }

  // 달력 월이 변경될 때 해당 월의 일기 날짜들을 로드
  const loadDiaryDatesForMonth = async (date: Date) => {
    const dates = await safeDiaryOperations.getDiaryDatesInMonth(date.getFullYear(), date.getMonth())
    setDiaryDatesInMonth(dates)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      calendarDate.getMonth() === today.getMonth() &&
      calendarDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelectedDate = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      calendarDate.getMonth() === selectedDate.getMonth() &&
      calendarDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const hasDiary = (day: number) => {
    return diaryDatesInMonth.includes(day)
  }

  const enhanceDiary = async () => {
    if (!originalText.trim()) return

    console.log('=== AI 추억보정 시작 ===')
    console.log('원본 텍스트 길이:', originalText.length)
    console.log('원본 텍스트:', originalText)

    setIsLoading(true)
    try {
      console.log('서버에 요청 전송 시작...')
      const startTime = Date.now()
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: originalText }),
      })

      const responseTime = Date.now() - startTime
      console.log(`서버 응답 시간: ${responseTime}ms`)
      console.log('응답 상태:', response.status)
      console.log('응답 헤더:', response.headers)

      if (!response.ok) {
        console.error('서버 오류:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('오류 상세:', errorText)
        throw new Error(`서버 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log('서버 응답 데이터:', data)
      
      if (data.enhancedText) {
        console.log('AI 보정 성공!')
        console.log('보정된 텍스트 길이:', data.enhancedText.length)
        setEnhancedText(data.enhancedText)
      } else {
        console.error('보정된 텍스트가 없습니다:', data)
      }
    } catch (error) {
      console.error('=== AI 추억보정 오류 ===')
      console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('오류 메시지:', error instanceof Error ? error.message : error)
      console.error('오류 스택:', error instanceof Error ? error.stack : '')
      console.error('전체 오류 객체:', error)
      
      alert(`AI 추억보정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      console.log('=== AI 추억보정 종료 ===')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDiaryForDate(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    // 선택된 날짜에 일기가 없으면 자동으로 작성 모드로 (모든 날짜 가능)
    if (!todaysDiary) {
      setIsNewDiary(true)
      // 새 일기일 때 제목 기본값 설정
      setTitle(formatDateForTitle(selectedDate))
      setOriginalText('')
      setEnhancedText('')
    } else {
      setIsNewDiary(false)
      // 기존 일기 데이터 로드
      setTitle(todaysDiary.title)
      setOriginalText(todaysDiary.original_content)
      setEnhancedText(todaysDiary.ai_content)
    }
  }, [selectedDate, todaysDiary])

  useEffect(() => {
    // 선택된 날짜가 변경되면 달력도 해당 월로 이동
    setCalendarDate(new Date(selectedDate))
  }, [selectedDate])

  useEffect(() => {
    // 달력 월이 변경될 때마다 해당 월의 일기 날짜들을 로드
    loadDiaryDatesForMonth(calendarDate)
  }, [calendarDate])

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 월의 일기 날짜들을 로드
    loadDiaryDatesForMonth(new Date())
  }, [])

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
    if (!title.trim() || !originalText.trim()) {
      alert('제목과 일기 내용을 입력해주세요.')
      return
    }
    
    if (!enhancedText.trim()) {
      alert('AI 추억보정을 먼저 실행해주세요.')
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
      updated_at: new Date().toISOString(),
    })

    if (success) {
      alert('일기가 저장되었습니다!')
      setTitle('')
      setOriginalText('')
      setEnhancedText('')
      setShowCreateForm(false)
      setIsNewDiary(false)
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
              <h1 className="text-lg font-bold text-gray-800">{t('diary.title')}</h1>
              <button
                onClick={() => setShowCalendar(true)}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
              >
                <Calendar size={16} className="mr-1" />
                {formatDateDisplay(selectedDate)}
              </button>
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

      {/* 달력 팝업 */}
      {showCalendar && (
        <div className="fixed inset-0 popup-backdrop z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-6 w-full max-w-md mx-auto">
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeCalendarMonth(-1)}
                className="glass-subtle p-2 rounded-xl hover:glass transition-all duration-300"
              >
                <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              
              <h2 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
                {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
              </h2>
              
              <button
                onClick={() => changeCalendarMonth(1)}
                className="glass-subtle p-2 rounded-xl hover:glass transition-all duration-300"
              >
                <ChevronRight size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center text-sm font-medium"
                  style={{ 
                    color: index === 0 ? 'var(--accent-red)' : index === 6 ? 'var(--accent-blue)' : 'var(--text-secondary)' 
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 날짜들 */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendar().map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && handleDateSelect(day)}
                  disabled={!day}
                  className={`h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-300 relative ${
                    day
                      ? isSelectedDate(day)
                        ? 'glass text-white'
                        : isToday(day)
                        ? 'glass-subtle'
                        : hasDiary(day)
                        ? 'glass-subtle border border-purple-300'
                        : 'hover:glass-subtle'
                      : ''
                  }`}
                  style={{
                    color: day
                      ? isSelectedDate(day)
                        ? 'white'
                        : isToday(day)
                        ? 'var(--accent-purple)'
                        : hasDiary(day)
                        ? 'var(--accent-purple)'
                        : 'var(--text-primary)'
                      : 'transparent',
                    backgroundColor: day && isSelectedDate(day) ? 'var(--accent-purple)' : 'transparent'
                  }}
                >
                  {day}
                  {/* 일기가 있는 날짜에 작은 점 표시 */}
                  {day && hasDiary(day) && !isSelectedDate(day) && (
                    <div 
                      className="absolute bottom-1 w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-purple)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 달력 하단 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const today = new Date()
                  setSelectedDate(today)
                  setCalendarDate(today)
                  setShowCalendar(false)
                  setTitle('')
                  setOriginalText('')
                  setEnhancedText('')
                }}
                className="flex-1 glass-subtle py-2.5 rounded-xl hover:glass transition-all duration-300 text-sm font-medium"
                style={{ color: 'var(--accent-blue)' }}
              >
                {t('diary.calendar.today')}
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="flex-1 glass-subtle py-2.5 rounded-xl hover:glass transition-all duration-300 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('diary.calendar.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        {/* 새 일기 작성 모드 */}
        {isNewDiary && !todaysDiary ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              {/* 제목 입력 */}
              <input
                type="text"
                placeholder="일기 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                autoFocus
              />
              
              {/* 텍스트 에디터 */}
              <div className="relative">
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="오늘 있었던 일을 자유롭게 적어주세요. 예시) 오늘은 친구들과 카페에서 수다를 떨었다. 오랜만에 만나서 정말 좋았고, 맛있는 디저트도 먹었다."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />ㄴ
                <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                  {originalText.length}자
                </div>
              </div>
              
              {/* AI 보정된 일기 표시 */}
              {enhancedText && (
                <div className="animate-fade-in">
                  <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <Sparkles size={16} className="mr-1 text-purple-600" />
                    AI가 보정한 추억
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {enhancedText}
                    </p>
                  </div>
                </div>
              )}
              
              {/* 버튼 영역 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveDiary}
                  disabled={!title.trim() || !originalText.trim()}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  저장하기
                </button>
                
                <button
                  onClick={enhanceDiary}
                  disabled={isLoading || !originalText.trim()}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 transition-all transform active:scale-95"
                >
                  <Sparkles className="mr-2" size={20} />
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-pulse">추억 보정 중</span>
                      <span className="ml-1 animate-bounce">...</span>
                    </span>
                  ) : (
                    'AI 추억보정'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : todaysDiary ? (
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
            /* 일기가 없는 경우 */
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                이 날의 일기가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 날짜를 선택해주세요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
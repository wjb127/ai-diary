'use client'

import { useState, useEffect } from 'react'
import { Sparkles, FileText, Calendar, ChevronLeft, ChevronRight, Edit2, Save } from 'lucide-react'
import { safeDiaryOperations, Diary, isSupabaseConfigured, testSupabaseConnection } from '@/lib/supabase'
import DiaryEditor from '@/components/DiaryEditor'

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [originalText, setOriginalText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [todaysDiary, setTodaysDiary] = useState<Diary | null>(null)
  // const [showCreateForm, setShowCreateForm] = useState(false)
  // const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [isNewDiary, setIsNewDiary] = useState(true)
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [isEditingExisting, setIsEditingExisting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
    // 컴포넌트 마운트 시 Supabase 연결 테스트
    testSupabaseConnection()
  }, [])

  useEffect(() => {
    // 선택된 날짜에 일기가 없으면 자동으로 작성 모드로 (모든 날짜 가능)
    if (!todaysDiary) {
      console.log('터미널 로그: 일기 없음, 작성 모드 활성화 -', formatDateForDB(selectedDate))
      setIsNewDiary(true)
      setIsEditingExisting(false)
      // 새 일기일 때 제목 기본값 설정
      setTitle(formatDateForTitle(selectedDate))
      setOriginalText('')
      setEnhancedText('')
    } else {
      console.log('터미널 로그: 일기 존재, 편집 가능 모드 -', todaysDiary.title)
      setIsNewDiary(false)
      setIsEditingExisting(false)
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
    console.log('=== 일기 저장 시작 ===')
    console.log('제목:', title)
    console.log('원본 텍스트 길이:', originalText.length)
    console.log('AI 텍스트 길이:', enhancedText.length)
    console.log('선택된 날짜:', selectedDate.toISOString())
    console.log('Supabase 설정됨:', isSupabaseConfigured())
    console.log('신규 일기 여부:', isNewDiary)
    
    if (!title.trim() || !originalText.trim()) {
      console.error('제목 또는 일기 내용이 없음')
      alert('제목과 일기 내용을 입력해주세요.')
      return
    }
    
    if (!enhancedText.trim()) {
      console.error('AI 보정된 텍스트가 없음')
      alert('AI 추억보정을 먼저 실행해주세요.')
      return
    }

    if (!isSupabaseConfigured()) {
      console.error('Supabase가 설정되지 않음')
      alert('데이터베이스가 설정되지 않았습니다. 관리자에게 문의해주세요.')
      return
    }

    setIsSaving(true)
    console.log('일기 저장 데이터 준비 완료, Supabase 호출...')
    
    let success = false
    
    if (isNewDiary) {
      // 새 일기 저장
      const diaryData = {
        title,
        original_content: originalText,
        ai_content: enhancedText,
        created_at: selectedDate.toISOString(),
        updated_at: new Date().toISOString(),
      }
      console.log('새 일기 저장할 데이터:', diaryData)
      success = await safeDiaryOperations.saveDiary(diaryData)
    } else if (todaysDiary) {
      // 기존 일기 수정
      const updates = {
        title,
        original_content: originalText,
        ai_content: enhancedText,
        updated_at: new Date().toISOString()
      }
      console.log('기존 일기 수정할 데이터:', updates)
      success = await safeDiaryOperations.updateDiary(todaysDiary.id, updates)
    }
    
    console.log('저장 결과:', success)
    setIsSaving(false)

    if (success) {
      console.log('일기 저장/수정 성공!')
      alert(isNewDiary ? '일기가 저장되었습니다!' : '일기가 수정되었습니다!')
      setIsNewDiary(false)
      setIsEditingExisting(false)
      loadDiaryForDate(selectedDate)
    } else {
      console.error('일기 저장/수정 실패')
      alert('일기 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
    console.log('=== 일기 저장 종료 ===')
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    console.log('터미널 로그: 날짜 변경 -', formatDateForDB(newDate))
    setSelectedDate(newDate)
    // 날짜가 변경되면 편집 모드 해제
    setIsEditingExisting(false)
  }

  // const resetForm = () => {
  //   console.log('\n=== 폼 리셋 ===')
  //   console.log('터미널 로그: 폼 리셋 실행')
  //   setTitle('')
  //   setOriginalText('')
  //   setEnhancedText('')
  //   setShowCreateForm(false)
  //   setIsEditMode(false)
  //   setIsNewDiary(false)
  // }

  // 일기 수정 기능
  const handleUpdateDiary = async (id: number, updates: Partial<Omit<Diary, 'id'>>) => {
    console.log('\n=== 일기 수정 핸들러 ===')
    console.log('터미널 로그: 일기 수정 요청, ID =', id)
    const success = await safeDiaryOperations.updateDiary(id, updates)
    if (success) {
      console.log('터미널 로그: 일기 수정 성공, 데이터 새로고침')
      loadDiaryForDate(selectedDate)
    }
    return success
  }

  // 일기 삭제 기능
  const handleDeleteDiary = async (id: number) => {
    console.log('\n=== 일기 삭제 핸들러 ===')
    console.log('터미널 로그: 일기 삭제 요청, ID =', id)
    const success = await safeDiaryOperations.deleteDiary(id)
    if (success) {
      console.log('터미널 로그: 일기 삭제 성공, 데이터 새로고침')
      loadDiaryForDate(selectedDate)
      setSelectedDiary(null)
    }
    return success
  }

  return (
    <div className="pb-20 min-h-screen relative">
      {/* 날짜 선택 헤더 - 모바일 최적화 */}
      <div className="glass-strong sticky top-0 z-40 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="glass-subtle p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:glass transition-all duration-300 transform hover:scale-110 active:scale-95 touch-target"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
            
            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg sm:text-2xl font-medium sm:font-light tracking-tight" style={{ color: 'var(--text-primary)' }}>AI 일기장</h1>
              <button
                onClick={() => setShowCalendar(true)}
                className="text-xs sm:text-sm font-normal sm:font-light mt-0.5 sm:mt-1 hover:scale-105 transition-all duration-300 cursor-pointer glass-subtle px-3 py-1 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatDateDisplay(selectedDate)}
              </button>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="glass-subtle p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:glass transition-all duration-300 transform hover:scale-110 active:scale-95 touch-target"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* 달력 모달 */}
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
                  className={`h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-300 ${
                    day
                      ? isSelectedDate(day)
                        ? 'glass text-white'
                        : isToday(day)
                        ? 'glass-subtle'
                        : 'hover:glass-subtle'
                      : ''
                  }`}
                  style={{
                    color: day
                      ? isSelectedDate(day)
                        ? 'white'
                        : isToday(day)
                        ? 'var(--accent-purple)'
                        : 'var(--text-primary)'
                      : 'transparent',
                    backgroundColor: day && isSelectedDate(day) ? 'var(--accent-purple)' : 'transparent'
                  }}
                >
                  {day}
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
                오늘
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="flex-1 glass-subtle py-2.5 rounded-xl hover:glass transition-all duration-300 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-2 sm:px-6 py-6 sm:py-8">
        {/* 새 일기 작성 모드 - 모바일 최적화 */}
        {isNewDiary && !todaysDiary ? (
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            <div className="space-y-5 sm:space-y-6">
              {/* 제목 입력 */}
              <input
                type="text"
                placeholder="일기 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 sm:p-4 glass-readable rounded-xl sm:rounded-2xl focus:outline-none focus:glass text-base sm:text-lg font-normal sm:font-light placeholder-gray-400 transition-all duration-300"
                style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                autoFocus
              />
              
              {/* 텍스트 에디터 - 모바일 최적화 */}
              <div className="relative">
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="오늘 있었던 일을 자유롭게 적어주세요. 예시) 오늘은 친구들과 카페에서 수다를 떨었다. 오랜만에 만나서 정말 좋았고, 맛있는 디저트도 먹었다."
                  className="w-full h-64 sm:h-80 p-4 sm:p-6 glass-readable rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:glass leading-relaxed text-base sm:text-lg font-normal sm:font-light placeholder-gray-400 transition-all duration-300"
                  style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm font-normal sm:font-light" style={{ color: 'var(--text-secondary)' }}>
                  {originalText.length}자
                </div>
              </div>
              
              {/* AI 보정된 일기 표시 */}
              {enhancedText && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="glass-subtle rounded-2xl p-2 mr-3">
                      <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
                    </div>
                    <h3 className="text-lg font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      AI가 보정한 추억
                    </h3>
                  </div>
                  <div className="glass rounded-2xl p-4 sm:p-6" style={{ border: '2px solid rgba(175, 82, 222, 0.3)' }}>
                    <p className="leading-relaxed whitespace-pre-wrap text-lg font-light" style={{ color: 'var(--text-primary)' }}>
                      {enhancedText}
                    </p>
                  </div>
                </div>
              )}
              
              {/* 버튼 영역 - 모바일 최적화 */}
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={enhanceDiary}
                  disabled={isLoading || !originalText.trim()}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 glass rounded-xl sm:rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg font-medium group btn-mobile touch-target"
                  style={{ color: 'var(--accent-purple)' }}
                >
                  <Sparkles className="mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" size={20} />
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-pulse">추억 보정 중</span>
                      <span className="ml-2 animate-bounce">...</span>
                    </span>
                  ) : (
                    'AI 추억보정'
                  )}
                </button>
                
                <button
                  onClick={saveDiary}
                  disabled={!title.trim() || !originalText.trim()}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 glass rounded-xl sm:rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg font-medium btn-mobile touch-target"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        ) : todaysDiary ? (
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            <div className="space-y-5 sm:space-y-6">
              {/* 제목 입력 - 수정 가능 */}
              <input
                type="text"
                placeholder="일기 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 sm:p-4 glass-readable rounded-xl sm:rounded-2xl focus:outline-none focus:glass text-base sm:text-lg font-normal sm:font-light placeholder-gray-400 transition-all duration-300"
                style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
              />
              
              {/* 원본 일기 편집 영역 */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="glass-subtle rounded-2xl p-2 mr-3">
                    <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    원본 일기
                  </h3>
                </div>
                <div className="relative">
                  <textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="오늘 있었던 일을 자유롭게 적어주세요."
                    className="w-full h-64 sm:h-80 p-4 sm:p-6 glass-readable rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:glass leading-relaxed text-base sm:text-lg font-normal sm:font-light placeholder-gray-400 transition-all duration-300"
                    style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                  />
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm font-normal sm:font-light" style={{ color: 'var(--text-secondary)' }}>
                    {originalText.length}자
                  </div>
                </div>
              </div>
              
              {/* AI 보정된 일기 편집 영역 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="glass-subtle rounded-2xl p-2 mr-3">
                      <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
                    </div>
                    <h3 className="text-lg font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      AI 감성 일기
                    </h3>
                  </div>
                  <button
                    onClick={enhanceDiary}
                    disabled={isLoading || !originalText.trim()}
                    className="flex items-center px-3 py-2 glass-subtle rounded-xl hover:glass disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm font-medium"
                    style={{ color: 'var(--accent-purple)' }}
                  >
                    <Sparkles className="mr-1" size={16} />
                    {isLoading ? '보정 중...' : 'AI 재보정'}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={enhancedText}
                    onChange={(e) => setEnhancedText(e.target.value)}
                    placeholder="AI 추억보정을 실행하면 여기에 감성적인 일기가 생성됩니다."
                    className="w-full h-64 sm:h-80 p-4 sm:p-6 glass-readable rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:glass leading-relaxed text-base sm:text-lg font-normal sm:font-light placeholder-gray-400 transition-all duration-300"
                    style={{ 
                      color: 'var(--text-primary)', 
                      backgroundColor: 'transparent',
                      border: enhancedText ? '2px solid rgba(175, 82, 222, 0.3)' : ''
                    }}
                  />
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm font-normal sm:font-light" style={{ color: 'var(--text-secondary)' }}>
                    {enhancedText.length}자
                  </div>
                </div>
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={enhanceDiary}
                  disabled={isLoading || !originalText.trim()}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 glass rounded-xl sm:rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg font-medium group btn-mobile touch-target"
                  style={{ color: 'var(--accent-purple)' }}
                >
                  <Sparkles className="mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" size={20} />
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-pulse">추억 보정 중</span>
                      <span className="ml-2 animate-bounce">...</span>
                    </span>
                  ) : (
                    'AI 추억보정'
                  )}
                </button>
                
                <button
                  onClick={saveDiary}
                  disabled={isSaving || isLoading || !title.trim() || !originalText.trim()}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 glass rounded-xl sm:rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg font-medium btn-mobile touch-target"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  <Save className="mr-2 sm:mr-3" size={20} />
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="animate-pulse">저장 중</span>
                      <span className="ml-2 animate-bounce">...</span>
                    </span>
                  ) : (
                    '저장하기'
                  )}
                </button>
              </div>
              
              {/* 작성/수정 시간 표시 */}
              <div className="text-center pt-4">
                <span className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
                  작성: {new Date(todaysDiary.created_at).toLocaleString('ko-KR')}
                  {todaysDiary.updated_at !== todaysDiary.created_at && (
                    <span className="block mt-1">
                      수정: {new Date(todaysDiary.updated_at).toLocaleString('ko-KR')}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* 선택된 날짜에 일기가 없는 경우 - 모든 날짜에 작성 가능 */
          <div className="text-center py-16">
            <div className="glass-strong rounded-3xl p-6 sm:p-12 max-w-md mx-auto">
              <div className="glass-subtle rounded-3xl p-6 mb-8 inline-block">
                <Calendar size={64} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-2xl font-light mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {formatDateForDB(selectedDate) === formatDateForDB(new Date()) 
                  ? "오늘의 일기를 작성해보세요" 
                  : formatDateForDB(selectedDate) > formatDateForDB(new Date())
                    ? "미래의 일기를 미리 작성해보세요"
                    : "이 날의 일기를 작성해보세요"}
              </h3>
              <p className="text-lg font-light leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                {formatDateForDB(selectedDate) === formatDateForDB(new Date())
                  ? "오늘 있었던 특별한 순간을 기록해보세요"
                  : formatDateForDB(selectedDate) > formatDateForDB(new Date())
                    ? "계획이나 기대를 미리 적어보는 것도 좋아요"
                    : "그날의 기억을 되살려 일기로 남겨보세요"}
              </p>
              
              <button
                onClick={() => {
                  console.log('터미널 로그: 일기 작성 버튼 클릭 -', formatDateForDB(selectedDate))
                  // 작성 모드는 이미 활성화되어 있으므로 스크롤만 이동
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="glass rounded-2xl px-8 py-4 hover:glass-strong transition-all duration-300 transform hover:scale-105 text-lg font-medium"
                style={{ color: 'var(--accent-blue)' }}
              >
                일기 작성하기
              </button>
            </div>
          </div>
        )}

        {/* 일기 상세보기/편집 모달 */}
        {selectedDiary && (
          <DiaryEditor
            diary={selectedDiary}
            onUpdate={handleUpdateDiary}
            onDelete={handleDeleteDiary}
            onClose={() => {
              console.log('터미널 로그: 일기 에디터 닫기')
              setSelectedDiary(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
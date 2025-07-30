'use client'

import { useState, useEffect } from 'react'
import { Sparkles, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
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
    // 오늘 날짜이고 일기가 없으면 자동으로 작성 모드로
    if (formatDateForDB(selectedDate) === formatDateForDB(new Date()) && !todaysDiary) {
      setIsNewDiary(true)
    } else {
      setIsNewDiary(false)
    }
  }, [selectedDate, todaysDiary])

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
      alert('데모 모드입니다. 실제 저장을 위해서는 Supabase 설정이 필요합니다.')
      return
    }

    console.log('일기 저장 데이터 준비 완료, Supabase 호출...')
    const diaryData = {
      title,
      original_content: originalText,
      ai_content: enhancedText,
      created_at: selectedDate.toISOString(),
      updated_at: new Date().toISOString(),
    }
    console.log('저장할 데이터:', diaryData)

    const success = await safeDiaryOperations.saveDiary(diaryData)
    console.log('저장 결과:', success)

    if (success) {
      console.log('일기 저장 성공!')
      alert('일기가 저장되었습니다!')
      setTitle('')
      setOriginalText('')
      setEnhancedText('')
      // setShowCreateForm(false)
      setIsNewDiary(false)
      loadDiaryForDate(selectedDate)
    } else {
      console.error('일기 저장 실패')
      alert('일기 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
    console.log('=== 일기 저장 종료 ===')
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
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
                  placeholder="오늘 있었던 일을 자유롭게 적어주세요.\n\n예시) 오늘은 친구들과 카페에서 수다를 떨었다. 오랜만에 만나서 정말 좋았고, 맛있는 디저트도 먹었다."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
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
              <h2 
                className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => {
                  console.log('터미널 로그: 일기 제목 클릭, 에디터 열기')
                  setSelectedDiary(todaysDiary)
                }}
                title="클릭하여 상세보기/편집"
              >
                {todaysDiary.title}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {new Date(todaysDiary.created_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => {
                    console.log('터미널 로그: 일기 에디터 버튼 클릭')
                    setSelectedDiary(todaysDiary)
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  상세보기
                </button>
              </div>
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
          /* 과거 날짜 일기가 없는 경우 */
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
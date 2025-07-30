'use client'

import { useState } from 'react'
import { Save, Sparkles, FileText, BookOpen } from 'lucide-react'
import { supabase, Diary } from '@/lib/supabase'

export default function DiaryPage() {
  const [originalText, setOriginalText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [showSaved, setShowSaved] = useState(false)
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

  const saveDiary = async () => {
    if (!title.trim() || !originalText.trim() || !enhancedText.trim()) {
      alert('제목, 원본 일기, 변환된 일기가 모두 필요합니다.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('diaries')
        .insert({
          title,
          original_content: originalText,
          ai_content: enhancedText,
        })
        .select()

      if (error) throw error

      alert('일기가 저장되었습니다!')
      setTitle('')
      setOriginalText('')
      setEnhancedText('')
      loadDiaries()
    } catch (error) {
      console.error('일기 저장 오류:', error)
      alert('일기 저장 중 오류가 발생했습니다.')
    }
  }

  const loadDiaries = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDiaries(data || [])
    } catch (error) {
      console.error('일기 로딩 오류:', error)
    }
  }

  const toggleSavedDiaries = () => {
    if (!showSaved) {
      loadDiaries()
    }
    setShowSaved(!showSaved)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 일기장</h1>
        <p className="text-gray-600">오늘의 소중한 순간을 AI와 함께 아름다운 추억으로 만들어보세요</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <FileText className="text-blue-600 mr-2" size={20} />
            <h2 className="text-xl font-semibold">원본 일기</h2>
          </div>
          <input
            type="text"
            placeholder="일기 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="오늘 있었던 일을 간단히 적어보세요. 어떤 형태든 괜찮습니다!"
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={enhanceDiary}
            disabled={isLoading || !originalText.trim()}
            className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            <Sparkles className="mr-2" size={20} />
            {isLoading ? '변환 중...' : 'AI로 아름답게 변환하기'}
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Sparkles className="text-purple-600 mr-2" size={20} />
            <h2 className="text-xl font-semibold">AI 감성 일기</h2>
          </div>
          <div className="h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
            {enhancedText ? (
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{enhancedText}</p>
            ) : (
              <p className="text-gray-400 italic">
                원본 일기를 작성하고 변환 버튼을 누르면 AI가 아름다운 일기로 만들어드립니다.
              </p>
            )}
          </div>
          <button
            onClick={saveDiary}
            disabled={!title.trim() || !originalText.trim() || !enhancedText.trim()}
            className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            <Save className="mr-2" size={20} />
            일기 저장하기
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <button
          onClick={toggleSavedDiaries}
          className="flex items-center mb-4 text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          <BookOpen className="mr-2" size={20} />
          저장된 일기 {showSaved ? '숨기기' : '보기'}
        </button>

        {showSaved && (
          <div className="space-y-4">
            {diaries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">저장된 일기가 없습니다.</p>
            ) : (
              diaries.map((diary) => (
                <div key={diary.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{diary.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(diary.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">원본</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {diary.original_content}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">AI 변환</h4>
                      <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded">
                        {diary.ai_content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
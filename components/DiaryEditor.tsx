'use client'

import { useState } from 'react'
import { Sparkles, Trash2, Edit3, Save, X } from 'lucide-react'
import { Diary } from '@/lib/supabase'

interface DiaryEditorProps {
  diary: Diary
  onUpdate: (id: number, updates: Partial<Omit<Diary, 'id'>>) => Promise<boolean>
  onDelete: (id: number) => Promise<boolean>
  onClose: () => void
}

export default function DiaryEditor({ diary, onUpdate, onDelete, onClose }: DiaryEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(diary.title)
  const [originalContent, setOriginalContent] = useState(diary.original_content)
  const [aiContent, setAiContent] = useState(diary.ai_content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleSave = async () => {
    console.log('일기 수정 저장 시작...')
    setIsSaving(true)
    
    const updates = {
      title,
      original_content: originalContent,
      ai_content: aiContent,
      updated_at: new Date().toISOString()
    }
    
    const success = await onUpdate(diary.id, updates)
    setIsSaving(false)
    
    if (success) {
      setIsEditing(false)
      alert('일기가 수정되었습니다!')
    } else {
      alert('일기 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 일기를 삭제하시겠습니까?')) return
    
    console.log('일기 삭제 시작...')
    setIsDeleting(true)
    
    const success = await onDelete(diary.id)
    setIsDeleting(false)
    
    if (success) {
      alert('일기가 삭제되었습니다!')
      onClose()
    } else {
      alert('일기 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleCancel = () => {
    setTitle(diary.title)
    setOriginalContent(diary.original_content)
    setAiContent(diary.ai_content)
    setIsEditing(false)
  }

  // AI 추억보정 기능
  const enhanceDiary = async () => {
    if (!originalContent.trim()) {
      alert('원본 일기 내용을 입력해주세요.')
      return
    }

    console.log('=== 일기 수정 중 AI 추억보정 시작 ===')
    console.log('수정 중인 원본 텍스트 길이:', originalContent.length)
    console.log('수정 중인 원본 텍스트:', originalContent)

    setIsEnhancing(true)
    try {
      console.log('수정 모드에서 서버에 AI 보정 요청 전송...')
      const startTime = Date.now()
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: originalContent }),
      })

      const responseTime = Date.now() - startTime
      console.log(`수정 모드 AI 보정 응답 시간: ${responseTime}ms`)
      console.log('수정 모드 응답 상태:', response.status)

      if (!response.ok) {
        console.error('수정 모드 AI 보정 서버 오류:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('수정 모드 오류 상세:', errorText)
        throw new Error(`서버 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log('수정 모드 AI 보정 응답 데이터:', data)
      
      if (data.enhancedText) {
        console.log('수정 모드 AI 보정 성공!')
        console.log('수정 모드 보정된 텍스트 길이:', data.enhancedText.length)
        setAiContent(data.enhancedText)
      } else {
        console.error('수정 모드에서 보정된 텍스트가 없습니다:', data)
        alert('AI 추억보정에 실패했습니다.')
      }
    } catch (error) {
      console.error('=== 수정 모드 AI 추억보정 오류 ===')
      console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('오류 메시지:', error instanceof Error ? error.message : error)
      console.error('전체 오류 객체:', error)
      
      alert(`AI 추억보정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      console.log('=== 수정 모드 AI 추억보정 종료 ===')
      setIsEnhancing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Edit3 size={20} className="text-blue-600" />
              ) : (
                <Sparkles size={20} className="text-purple-600" />
              )}
              <h2 className="text-lg font-semibold">
                {isEditing ? '일기 수정' : '일기 보기'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* 제목 수정 */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="일기 제목"
              />
              
              {/* 원본 내용 수정 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  원본 일기
                </label>
                <textarea
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="원본 일기 내용"
                />
              </div>
              
              {/* AI 내용 수정 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-600">
                    AI 감성 일기
                  </label>
                  <button
                    onClick={enhanceDiary}
                    disabled={isEnhancing || !originalContent.trim()}
                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 transition-all"
                  >
                    <Sparkles size={14} className="mr-1" />
                    {isEnhancing ? '보정 중...' : 'AI 재보정'}
                  </button>
                </div>
                <textarea
                  value={aiContent}
                  onChange={(e) => setAiContent(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI 보정된 일기 내용"
                />
              </div>
              
              {/* 수정 버튼들 */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isEnhancing || !title.trim() || !originalContent.trim() || !aiContent.trim()}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving || isEnhancing}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{diary.title}</h1>
                <div className="text-sm text-gray-500">
                  작성: {new Date(diary.created_at).toLocaleString('ko-KR')}
                  {diary.updated_at !== diary.created_at && (
                    <span className="ml-2">
                      (수정: {new Date(diary.updated_at).toLocaleString('ko-KR')})
                    </span>
                  )}
                </div>
              </div>
              
              {/* 원본 일기 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <Edit3 size={16} className="mr-1" />
                  원본 일기
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {diary.original_content}
                  </p>
                </div>
              </div>
              
              {/* AI 감성 일기 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <Sparkles size={16} className="mr-1 text-purple-600" />
                  AI 감성 일기
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {diary.ai_content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
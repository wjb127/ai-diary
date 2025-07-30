import { NextRequest, NextResponse } from 'next/server'
import { enhanceDiary } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    console.log('=== /api/enhance POST 요청 시작 ===')
    const { text } = await request.json()
    console.log('요청 받은 텍스트 길이:', text?.length || 0)
    
    if (!text) {
      console.error('텍스트가 없음')
      return NextResponse.json({ error: '텍스트가 필요합니다.' }, { status: 400 })
    }

    if (text.length > 5000) {
      console.error('텍스트가 너무 김:', text.length)
      return NextResponse.json({ error: '텍스트가 너무 깁니다. (최대 5000자)' }, { status: 400 })
    }

    console.log('enhanceDiary 함수 호출...')
    const enhancedText = await enhanceDiary(text)
    console.log('enhanceDiary 함수 완료, 결과 길이:', enhancedText.length)
    
    return NextResponse.json({ enhancedText })
  } catch (error) {
    console.error('=== /api/enhance API 오류 ===')
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    console.error('전체 오류:', error)
    
    // 에러 상황에서도 기본 응답 제공
    const { text } = await request.json().catch(() => ({ text: '' }))
    const fallbackResponse = `✨ AI 추억보정 (서비스 점검 중)

${text}

현재 AI 서비스가 점검 중입니다. 
원본 일기는 안전하게 저장되었으니 나중에 다시 시도해주세요.

*서비스 이용에 불편을 드려 죄송합니다.*`

    return NextResponse.json({ 
      enhancedText: fallbackResponse,
      warning: '서비스가 일시적으로 불안정합니다.'
    })
  }
}
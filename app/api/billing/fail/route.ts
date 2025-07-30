import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 빌링 인증 실패 콜백 ===')
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const message = searchParams.get('message')
    
    console.log('빌링 인증 실패 정보:', { code, message })
    
    // 실패 페이지로 리다이렉트
    const failUrl = new URL('/subscription', request.url)
    failUrl.searchParams.set('error', 'billing_auth_failed')
    failUrl.searchParams.set('code', code || 'UNKNOWN')
    failUrl.searchParams.set('message', message || '결제 인증에 실패했습니다.')
    
    console.log('구독 페이지로 리다이렉트 (실패):', failUrl.toString())
    return NextResponse.redirect(failUrl)
    
  } catch (error) {
    console.error('=== 빌링 인증 실패 콜백 오류 ===')
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    console.error('전체 오류 객체:', error)
    
    return NextResponse.redirect(new URL('/subscription?error=callback_error', request.url))
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 빌링 인증 성공 콜백 ===')
    const searchParams = request.nextUrl.searchParams
    const customerKey = searchParams.get('customerKey')
    const authKey = searchParams.get('authKey')
    const plan = searchParams.get('plan')
    const amount = searchParams.get('amount')
    
    console.log('빌링 인증 성공 파라미터:', { 
      customerKey, 
      authKey: authKey ? '설정됨' : '없음', 
      plan, 
      amount 
    })
    
    if (!customerKey || !authKey) {
      console.error('필수 파라미터 누락:', { customerKey, authKey })
      return NextResponse.redirect(new URL('/subscription?error=missing_params', request.url))
    }

    // 빌링키 발급 요청
    console.log('빌링키 발급 API 호출...')
    const billingResponse = await fetch(`${request.nextUrl.origin}/api/billing/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        authKey,
      }),
    })

    console.log('빌링키 발급 응답 상태:', billingResponse.status)

    if (!billingResponse.ok) {
      const errorText = await billingResponse.text()
      console.error('빌링키 발급 실패:', errorText)
      return NextResponse.redirect(new URL('/subscription?error=billing_issue_failed', request.url))
    }

    const billingData = await billingResponse.json()
    console.log('빌링키 발급 성공:', billingData)

    // TODO: 여기서 데이터베이스에 빌링키와 구독 정보 저장
    // 임시로 성공 페이지로 리다이렉트
    const successUrl = new URL('/subscription', request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('plan', plan || 'monthly')
    
    console.log('구독 성공 페이지로 리다이렉트:', successUrl.toString())
    return NextResponse.redirect(successUrl)
    
  } catch (error) {
    console.error('=== 빌링 인증 성공 콜백 오류 ===')
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    console.error('전체 오류 객체:', error)
    
    return NextResponse.redirect(new URL('/subscription?error=callback_error', request.url))
  }
}
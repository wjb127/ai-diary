import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== 빌링키 발급 API 시작 ===')
    const { customerKey, authKey } = await request.json()
    
    console.log('빌링키 발급 요청:', { customerKey, authKey })
    
    if (!customerKey || !authKey) {
      return NextResponse.json(
        { error: 'customerKey와 authKey가 필요합니다.' }, 
        { status: 400 }
      )
    }

    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      console.error('TOSS_SECRET_KEY 환경변수가 설정되지 않음')
      return NextResponse.json(
        { error: '결제 설정 오류' }, 
        { status: 500 }
      )
    }

    // Basic 인증 헤더 생성
    const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')
    console.log('토스페이먼츠 빌링키 발급 API 호출...')

    const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        authKey,
      }),
    })

    const responseTime = Date.now()
    console.log(`빌링키 발급 응답 시간: ${responseTime}ms`)
    console.log('빌링키 발급 응답 상태:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('빌링키 발급 오류:', response.status, errorText)
      return NextResponse.json(
        { error: '빌링키 발급 실패', details: errorText }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('빌링키 발급 성공:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('=== 빌링키 발급 API 오류 ===')
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    console.error('전체 오류 객체:', error)
    
    return NextResponse.json(
      { error: '빌링키 발급 중 오류가 발생했습니다.' }, 
      { status: 500 }
    )
  }
}
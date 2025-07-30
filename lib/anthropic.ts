import Anthropic from '@anthropic-ai/sdk'

// Anthropic API 설정 확인
const isAnthropicConfigured = () => {
  return !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key'
}

let anthropic: Anthropic | null = null

// API 키가 설정되어 있을 때만 클라이언트 생성
if (isAnthropicConfigured()) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function enhanceDiary(originalText: string): Promise<string> {
  // API 키가 설정되지 않은 경우 기본 응답
  if (!anthropic || !isAnthropicConfigured()) {
    console.warn('Anthropic API key is not configured. Using fallback response.')
    return `✨ AI 추억보정 (서비스 준비 중)

${originalText}

현재 AI 서비스가 준비 중입니다. 
잠시 후 다시 시도해주세요.

*서비스 이용에 불편을 드려 죄송합니다.*`
  }

  try {
    console.log('Anthropic API 호출 시작...')
    console.log('사용 모델: claude-sonnet-4-20250514')
    console.log('원본 텍스트 길이:', originalText.length)
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `다음은 사용자가 간략하게 적은 일기입니다. 이를 아름답고 감성적인 문체로 다시 써주세요.

지켜야 할 규칙:
1. 내용을 과장하거나 사실과 다르게 쓰지 마세요
2. 사용자가 느꼈을 감정과 상황을 더 풍부하게 표현해주세요  
3. 문학적이고 서정적인 표현을 사용하되, 자연스럽고 읽기 좋게 작성해주세요
4. 특수문자(*, #, -, =, ~, |, 등)나 이모지는 사용하지 마세요
5. 제목이나 부제목 형태로 쓰지 말고 자연스러운 문장으로만 작성해주세요
6. "오늘의 일기", "나의 하루" 같은 제목 형태는 사용하지 마세요

원본 일기:
${originalText}

위 원본을 바탕으로 감성적이고 아름다운 일기로 다시 써주세요. 특수문자나 이모지 없이 순수한 한글 문장만 사용해주세요:`
        }
      ]
    })

    console.log('Anthropic API 응답 받음')
    console.log('응답 타입:', response.content[0].type)
    console.log('보정된 텍스트 길이:', response.content[0].type === 'text' ? response.content[0].text.length : 0)
    
    return response.content[0].type === 'text' ? response.content[0].text : '일기 변환에 실패했습니다.'
  } catch (error) {
    console.error('=== Anthropic API 오류 상세 ===')
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    if (error instanceof Error && 'status' in error) {
      console.error('API 상태 코드:', (error as Error & { status: unknown }).status)
    }
    if (error instanceof Error && 'response' in error) {
      console.error('API 응답:', (error as Error & { response: unknown }).response)
    }
    console.error('전체 오류:', error)
    
    // API 오류 시 기본 응답
    return `✨ AI 추억보정 (오류 발생)

${originalText}

현재 AI 서비스에 일시적인 문제가 발생했습니다. 
잠시 후 다시 시도해주세요.

*원본 일기는 그대로 보관되니 걱정하지 마세요.*`
  }
}
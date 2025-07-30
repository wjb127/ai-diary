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
    return `✨ AI 추억보정 (데모 모드)

${originalText}

오늘 하루를 돌아보니, 평범해 보이는 순간들도 나름의 의미가 있었다. 
이런 작은 일상들이 모여 소중한 추억이 되어간다는 것을 새삼 깨닫게 된다.

*참고: 실제 AI 기능을 사용하려면 Anthropic API 키를 설정해주세요.*`
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `다음은 사용자가 간략하게 적은 오늘의 일기입니다. 이를 아름답고 감성적인 문체로 다시 써주세요. 
          단, 내용을 과장하거나 사실과 다르게 쓰지 말고, 사용자가 느꼈을 감정과 상황을 더 풍부하게 표현해주세요.
          문학적이고 서정적인 표현을 사용하되, 자연스럽고 읽기 좋게 작성해주세요.

          원본 일기:
          ${originalText}

          개선된 일기를 작성해주세요:`
        }
      ]
    })

    return response.content[0].type === 'text' ? response.content[0].text : '일기 변환에 실패했습니다.'
  } catch (error) {
    console.error('AI 일기 변환 오류:', error)
    
    // API 오류 시 기본 응답
    return `✨ AI 추억보정 (오류 발생)

${originalText}

현재 AI 서비스에 일시적인 문제가 발생했습니다. 
잠시 후 다시 시도해주세요.

*원본 일기는 그대로 보관되니 걱정하지 마세요.*`
  }
}
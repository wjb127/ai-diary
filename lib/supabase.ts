import { createClient } from '@supabase/supabase-js'

export interface Diary {
  id: number
  title: string
  original_content: string
  ai_content: string
  created_at: string
}

// Supabase 설정이 없을 경우 기본값 처리
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'

// Supabase 연결 상태 확인
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://dummy.supabase.co' && supabaseAnonKey !== 'dummy_key'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 에러 핸들링이 포함된 Supabase 헬퍼 함수들
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName?: string
): Promise<T> => {
  console.log(`=== Supabase ${operationName || 'Operation'} 시작 ===`)
  console.log('Supabase 설정 상태:', isSupabaseConfigured())
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key 존재:', supabaseAnonKey ? '있음' : '없음')
  
  if (!isSupabaseConfigured()) {
    console.warn('Supabase가 설정되지 않았습니다. 기본값을 반환합니다.')
    return fallbackValue
  }

  try {
    console.log('Supabase 작업 실행 중...')
    const result = await operation()
    console.log(`Supabase ${operationName || 'Operation'} 성공:`, result)
    return result
  } catch (error) {
    console.error(`=== Supabase ${operationName || 'Operation'} 실패 ===`)
    console.error('오류 타입:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : error)
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('오류 코드:', (error as any).code)
    }
    if (error && typeof error === 'object' && 'details' in error) {
      console.error('오류 상세:', (error as any).details)
    }
    if (error && typeof error === 'object' && 'hint' in error) {
      console.error('오류 힌트:', (error as any).hint)
    }
    console.error('전체 오류 객체:', error)
    return fallbackValue
  }
}

// 데이터베이스 연결 테스트
export const testSupabaseConnection = async (): Promise<boolean> => {
  return safeSupabaseOperation(async () => {
    console.log('Supabase 연결 테스트 시작...')
    // 테이블 존재 확인
    const { data, error } = await supabase
      .from('diaries')
      .select('count', { count: 'exact' })
      .limit(0)
    
    console.log('테이블 존재 확인 결과 - data:', data, 'error:', error)
    if (error) {
      if (error.code === '42P01') {
        console.error('❌ diaries 테이블이 존재하지 않습니다!')
        console.log('🔧 해결방법:')
        console.log('1. Supabase Dashboard (https://supabase.com/dashboard) 접속')
        console.log('2. 프로젝트 선택')
        console.log('3. SQL Editor에서 다음 SQL 실행:')
        console.log(`
CREATE TABLE IF NOT EXISTS diaries (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  ai_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);
        `)
      }
      throw error
    }
    console.log('✅ Supabase 연결 및 테이블 확인 성공!')
    return true
  }, false, 'Supabase 연결 테스트')
}

// 일기 관련 안전한 작업들
export const safeDiaryOperations = {
  // 일기 목록 조회
  async getDiaries(): Promise<Diary[]> {
    return safeSupabaseOperation(async () => {
      console.log('일기 목록 조회 쿼리 실행...')
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('쿼리 결과 - data:', data, 'error:', error)
      if (error) throw error
      return data || []
    }, [], '일기 목록 조회')
  },

  // 날짜별 일기 조회
  async getDiaryByDate(date: Date): Promise<Diary | null> {
    return safeSupabaseOperation(async () => {
      const dateStr = date.toISOString().split('T')[0]
      console.log('날짜별 일기 조회 - 검색 날짜:', dateStr)
      console.log('검색 범위:', `${dateStr}T00:00:00.000Z ~ ${dateStr}T23:59:59.999Z`)
      
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .gte('created_at', `${dateStr}T00:00:00.000Z`)
        .lt('created_at', `${dateStr}T23:59:59.999Z`)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('날짜별 조회 결과 - data:', data, 'error:', error)
      if (error) throw error
      return data && data.length > 0 ? data[0] : null
    }, null, '날짜별 일기 조회')
  },

  // 일기 저장
  async saveDiary(diary: Omit<Diary, 'id'>): Promise<boolean> {
    return safeSupabaseOperation(async () => {
      console.log('일기 저장 데이터:', diary)
      const { data, error } = await supabase
        .from('diaries')
        .insert(diary)
        .select()

      console.log('일기 저장 결과 - data:', data, 'error:', error)
      if (error) throw error
      return true
    }, false, '일기 저장')
  }
}
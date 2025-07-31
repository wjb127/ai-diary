import { createClient } from '@supabase/supabase-js'

export interface Diary {
  id: number
  title: string
  original_content: string
  ai_content: string
  created_at: string
  updated_at: string
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
      console.error('오류 코드:', (error as Record<string, unknown>).code)
    }
    if (error && typeof error === 'object' && 'details' in error) {
      console.error('오류 상세:', (error as Record<string, unknown>).details)
    }
    if (error && typeof error === 'object' && 'hint' in error) {
      console.error('오류 힌트:', (error as Record<string, unknown>).hint)
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

// 일기 CRUD 작업들
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

  // C: 일기 생성 (Create)
  async saveDiary(diary: Omit<Diary, 'id'>): Promise<boolean> {
    console.log('\n=== 일기 생성 (CREATE) ===')
    console.log('터미널 로그: 일기 저장 시작')
    console.log('터미널 로그: 제목 ="', diary.title, '"')
    console.log('터미널 로그: 원본 길이 =', diary.original_content.length)
    console.log('터미널 로그: AI 길이 =', diary.ai_content.length)
    console.log('터미널 로그: 날짜 =', diary.created_at)
    
    return safeSupabaseOperation(async () => {
      console.log('일기 저장 데이터:', diary)
      const { data, error } = await supabase
        .from('diaries')
        .insert(diary)
        .select()

      console.log('일기 저장 결과 - data:', data, 'error:', error)
      console.log('터미널 로그: 저장 성공!', data ? `ID: ${data[0]?.id}` : '')
      if (error) {
        console.log('터미널 로그: 저장 실패 -', error.message)
        throw error
      }
      return true
    }, false, '일기 생성')
  },

  // U: 일기 수정 (Update)
  async updateDiary(id: number, updates: Partial<Omit<Diary, 'id'>>): Promise<boolean> {
    console.log('\n=== 일기 수정 (UPDATE) ===')
    console.log('터미널 로그: 일기 수정 시작, ID =', id)
    console.log('터미널 로그: 수정 데이터 =', updates)
    
    return safeSupabaseOperation(async () => {
      const { data, error } = await supabase
        .from('diaries')
        .update(updates)
        .eq('id', id)
        .select()

      console.log('일기 수정 결과 - data:', data, 'error:', error)
      console.log('터미널 로그: 수정 성공!', data ? `수정된 항목: ${data.length}개` : '')
      if (error) {
        console.log('터미널 로그: 수정 실패 -', error.message)
        throw error
      }
      return true
    }, false, '일기 수정')
  },

  // D: 일기 삭제 (Delete)
  async deleteDiary(id: number): Promise<boolean> {
    console.log('\n=== 일기 삭제 (DELETE) ===')
    console.log('터미널 로그: 일기 삭제 시작, ID =', id)
    
    return safeSupabaseOperation(async () => {
      const { data, error } = await supabase
        .from('diaries')
        .delete()
        .eq('id', id)
        .select()

      console.log('일기 삭제 결과 - data:', data, 'error:', error)
      console.log('터미널 로그: 삭제 성공!', data ? `삭제된 ID: ${data[0]?.id}` : '')
      if (error) {
        console.log('터미널 로그: 삭제 실패 -', error.message)
        throw error
      }
      return true
    }, false, '일기 삭제')
  },

  // R: 특정 일기 조회 (Read by ID)
  async getDiaryById(id: number): Promise<Diary | null> {
    console.log('\n=== 일기 조회 by ID (READ) ===')
    console.log('터미널 로그: ID로 일기 조회 시작, ID =', id)
    
    return safeSupabaseOperation(async () => {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', id)
        .single()

      console.log('ID별 일기 조회 결과 - data:', data, 'error:', error)
      console.log('터미널 로그: 조회 결과:', data ? `찾음: "${data.title}"` : '없음')
      if (error && error.code !== 'PGRST116') {
        console.log('터미널 로그: 조회 실패 -', error.message)
        throw error
      }
      return data || null
    }, null, 'ID별 일기 조회')
  },

  // 월별 일기 날짜 목록 조회
  async getDiaryDatesInMonth(year: number, month: number): Promise<number[]> {
    console.log('\n=== 월별 일기 날짜 조회 ===')
    console.log('터미널 로그: 월별 일기 날짜 조회 시작 -', year, '년', month + 1, '월')
    
    return safeSupabaseOperation(async () => {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0]
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
      
      console.log('검색 범위:', startDate, '~', endDate)
      
      const { data, error } = await supabase
        .from('diaries')
        .select('created_at')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .order('created_at', { ascending: true })

      console.log('월별 일기 날짜 조회 결과 - data:', data, 'error:', error)
      
      if (error) {
        console.log('터미널 로그: 월별 조회 실패 -', error.message)
        throw error
      }
      
      // 날짜에서 일(day)만 추출하여 배열로 반환
      const diaryDates = data?.map(diary => {
        const date = new Date(diary.created_at)
        return date.getDate()
      }) || []
      
      // 중복 제거
      const uniqueDates = [...new Set(diaryDates)]
      console.log('터미널 로그: 일기가 있는 날짜들:', uniqueDates)
      
      return uniqueDates
    }, [], '월별 일기 날짜 조회')
  }
}
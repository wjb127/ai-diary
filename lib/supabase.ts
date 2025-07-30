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
  fallbackValue: T
): Promise<T> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Using fallback value.')
    return fallbackValue
  }

  try {
    return await operation()
  } catch (error) {
    console.error('Supabase operation failed:', error)
    return fallbackValue
  }
}

// 일기 관련 안전한 작업들
export const safeDiaryOperations = {
  // 일기 목록 조회
  async getDiaries(): Promise<Diary[]> {
    return safeSupabaseOperation(async () => {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }, [])
  },

  // 날짜별 일기 조회
  async getDiaryByDate(date: Date): Promise<Diary | null> {
    return safeSupabaseOperation(async () => {
      const dateStr = date.toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .gte('created_at', `${dateStr}T00:00:00.000Z`)
        .lt('created_at', `${dateStr}T23:59:59.999Z`)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error
      return data && data.length > 0 ? data[0] : null
    }, null)
  },

  // 일기 저장
  async saveDiary(diary: Omit<Diary, 'id'>): Promise<boolean> {
    return safeSupabaseOperation(async () => {
      const { error } = await supabase
        .from('diaries')
        .insert(diary)

      if (error) throw error
      return true
    }, false)
  }
}
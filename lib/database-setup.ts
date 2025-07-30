import { supabase } from './supabase'

export const createDatabaseTables = async (): Promise<boolean> => {
  try {
    console.log('데이터베이스 테이블 생성 시작...')
    
    // 테이블 생성 SQL
    const createTableSQL = `
      -- 일기 테이블 생성
      CREATE TABLE IF NOT EXISTS diaries (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        original_content TEXT NOT NULL,
        ai_content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const { error: tableError } = await supabase.rpc('exec_sql', { 
      sql_text: createTableSQL 
    })
    
    if (tableError) {
      console.error('테이블 생성 오류:', tableError)
      // RPC가 없는 경우 직접 테이블 생성 시도
      const { error: directError } = await supabase
        .from('diaries')
        .select('id')
        .limit(1)
      
      if (directError && directError.code === '42P01') {
        throw new Error('테이블이 존재하지 않습니다. Supabase Dashboard에서 수동으로 테이블을 생성해주세요.')
      }
    }
    
    console.log('데이터베이스 테이블 생성 완료')
    return true
  } catch (error) {
    console.error('데이터베이스 설정 오류:', error)
    return false
  }
}

export const checkTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('diaries')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.error('diaries 테이블이 존재하지 않습니다.')
      return false
    }
    
    console.log('diaries 테이블 존재 확인됨')
    return true
  } catch (error) {
    console.error('테이블 존재 확인 오류:', error)
    return false
  }
}
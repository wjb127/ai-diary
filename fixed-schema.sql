-- Supabase 데이터베이스 스키마 (수정 버전)
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- 기존 테이블이 있다면 삭제 (선택사항)
-- DROP TABLE IF EXISTS diaries CASCADE;

-- 일기 테이블 생성
CREATE TABLE IF NOT EXISTS diaries (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  ai_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
' LANGUAGE plpgsql;

-- 기존 트리거가 있다면 삭제
DROP TRIGGER IF EXISTS update_diaries_updated_at ON diaries;

-- 트리거 생성
CREATE TRIGGER update_diaries_updated_at 
  BEFORE UPDATE ON diaries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);

-- RLS (Row Level Security) 비활성화 (개발용)
ALTER TABLE diaries DISABLE ROW LEVEL SECURITY;

-- 테이블 확인
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'diaries' 
ORDER BY ordinal_position;
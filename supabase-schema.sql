-- Supabase 데이터베이스 스키마
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

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
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_diaries_updated_at 
  BEFORE UPDATE ON diaries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);

-- 샘플 데이터 (선택사항)
INSERT INTO diaries (title, original_content, ai_content) VALUES 
(
  '첫 번째 일기',
  '오늘은 날씨가 좋았다. 공원에서 산책했다.',
  '따스한 햇살이 내리쬐는 오늘, 나는 공원으로 발걸음을 옮겼다. 싱그러운 바람과 함께 걸으며, 마음 속 깊은 곳까지 평온함이 스며들었다. 자연이 주는 선물 같은 하루였다.'
);
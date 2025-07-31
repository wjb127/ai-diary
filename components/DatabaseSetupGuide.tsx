'use client'

import { useState } from 'react'
import { Database, ExternalLink, Copy, Check } from 'lucide-react'

export default function DatabaseSetupGuide() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- 일기 테이블 생성
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
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_diaries_updated_at 
  BEFORE UPDATE ON diaries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  return (
    <div className="fixed inset-0 popup-backdrop z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Database className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-bold">데이터베이스 설정 필요</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              AI 일기장을 사용하기 위해 Supabase 데이터베이스에 테이블을 생성해야 합니다.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">설정 방법:</h3>
              <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                <li>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Supabase Dashboard 
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                  에 접속
                </li>
                <li>프로젝트 선택</li>
                <li>좌측 메뉴에서 <strong>SQL Editor</strong> 클릭</li>
                <li>아래 SQL을 복사하여 실행</li>
              </ol>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">실행할 SQL:</h3>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} className="mr-1 text-green-600" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1" />
                    복사
                  </>
                )}
              </button>
            </div>
            
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
              <code>{sqlScript}</code>
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>참고:</strong> SQL 실행 후 페이지를 새로고침하면 정상적으로 작동합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
# AI 일기장 프로젝트

Next.js 15 + Supabase + Vercel 기반의 AI 일기장 웹 애플리케이션입니다.

## 프로젝트 개요

사용자가 간단히 작성한 일기를 Claude AI가 아름답고 감성적인 문체로 변환해주는 서비스입니다.

## 주요 기능

- 랜딩 페이지: 서비스 소개 및 주요 기능 안내
- 일기 서비스 페이지: 일기 작성, AI 변환, 저장 기능
- 프로필 페이지: 작성 통계 및 저장된 일기 관리

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 프로젝트 구조

```
ai-diary/
├── app/
│   ├── api/
│   │   └── enhance/
│   │       └── route.ts          # Claude API 연동
│   ├── diary/
│   │   └── page.tsx              # 일기 서비스 페이지
│   ├── profile/
│   │   └── page.tsx              # 프로필 페이지
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 랜딩 페이지
├── components/
│   └── Header.tsx                # 네비게이션 헤더
├── lib/
│   ├── anthropic.ts              # Claude API 래퍼
│   └── supabase.ts               # Supabase 클라이언트
├── supabase-schema.sql           # 데이터베이스 스키마
├── .env.local                    # 환경 변수
└── package.json
```

## 환경 설정

### 필수 환경 변수

`.env.local` 파일에 다음 변수들을 설정해야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Supabase 설정

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-schema.sql` 파일의 내용 실행
3. 프로젝트 URL과 anon key를 환경 변수에 설정

### Anthropic API 설정

1. [Anthropic Console](https://console.anthropic.com/)에서 API 키 발급
2. API 키를 환경 변수에 설정

## 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 데이터베이스 스키마

### diaries 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | BIGSERIAL | 기본 키 |
| title | TEXT | 일기 제목 |
| original_content | TEXT | 사용자 원본 일기 |
| ai_content | TEXT | AI 변환된 일기 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## API 엔드포인트

### POST /api/enhance

일기 내용을 Claude AI로 변환합니다.

**Request Body:**
```json
{
  "text": "원본 일기 내용"
}
```

**Response:**
```json
{
  "enhancedText": "AI가 변환한 일기 내용"
}
```

## 주요 컴포넌트

### Header.tsx
- 네비게이션 메뉴
- 반응형 디자인
- 현재 페이지 활성화 표시

### app/page.tsx (랜딩 페이지)
- 서비스 소개
- 주요 기능 설명
- 사용자 유형별 추천

### app/diary/page.tsx (서비스 페이지)
- 일기 작성 폼
- AI 변환 기능
- 일기 저장 및 조회

### app/profile/page.tsx (프로필 페이지)
- 작성 통계
- 월별 차트
- 최근 일기 목록

## 배포 방법

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. Vercel에서 프로젝트 import
3. 환경 변수 설정
4. 자동 배포

## 라이선스

MIT License

## 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 문제 해결

### 일반적인 문제들

1. **AI 변환이 안 되는 경우**
   - ANTHROPIC_API_KEY 환경 변수 확인
   - API 크레딧 잔액 확인

2. **데이터베이스 연결 오류**
   - Supabase URL과 키 확인
   - 네트워크 연결 상태 확인

3. **빌드 오류**
   - Node.js 버전 확인 (18+ 권장)
   - 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

## 추가 기능 아이디어

- 일기 검색 기능
- 감정 분석 및 태그
- 일기 공유 기능
- 다크 모드
- PWA 지원
- 이메일 알림
- 일기 백업/복원

## 개발 도구 추천

- **IDE**: VS Code with TypeScript extension
- **디버깅**: Chrome DevTools, React Developer Tools
- **API 테스트**: Postman 또는 Thunder Client
- **데이터베이스**: Supabase Dashboard SQL Editor
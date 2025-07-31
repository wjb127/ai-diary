import Link from 'next/link'
import { BookOpen, Sparkles, Heart, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="pb-20 min-h-screen relative">
      {/* 히어로 섹션 - Jonathan Ive 스타일 */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        
        <div className="relative px-4 sm:px-6 py-12 sm:py-20 text-center">
          {/* 메인 로고/타이틀 */}
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 mx-auto max-w-sm sm:max-w-md mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium sm:font-light mb-3 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              AI 일기장
            </h1>
            <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              오늘의 소중한 순간을 AI와 함께<br />
              아름다운 추억으로 만들어보세요
            </p>
          </div>

          {/* CTA 버튼 - 모바일 최적화 */}
          <Link
            href="/diary"
            className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 glass rounded-2xl sm:rounded-full hover:glass-strong transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-base sm:text-lg touch-target"
            style={{ color: 'var(--accent-blue)' }}
          >
            <BookOpen className="mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" size={20} />
            일기 쓰러 가기
            <ArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 sm:py-12">
        {/* 주요 기능 - 모바일 가로 스크롤 최적화 */}
        <div className="mb-12 sm:mb-16 max-w-6xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-x-visible sm:pb-0">
            {/* 간편한 일기 작성 */}
            <div className="flex-shrink-0 w-72 sm:w-auto glass-readable rounded-2xl p-4 sm:p-6 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="text-center">
                <div className="glass-subtle rounded-xl p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <BookOpen style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  간편한 작성
                </h3>
                <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                  자유롭게 써보세요
                </p>
              </div>
            </div>

            {/* AI 추억보정 */}
            <div className="flex-shrink-0 w-72 sm:w-auto glass-readable rounded-2xl p-4 sm:p-6 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="text-center">
                <div className="glass-subtle rounded-xl p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Sparkles style={{ color: 'var(--accent-purple)' }} size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  AI 추억보정
                </h3>
                <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                  감성적으로 변환
                </p>
              </div>
            </div>

            {/* 소중한 추억 보관 */}
            <div className="flex-shrink-0 w-72 sm:w-auto glass-readable rounded-2xl p-4 sm:p-6 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="text-center">
                <div className="glass-subtle rounded-xl p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Heart style={{ color: 'var(--accent-pink)' }} size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  안전한 보관
                </h3>
                <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                  추억을 간직하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 사용 방법 - 모바일 최적화 */}
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-12 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium sm:font-light text-center mb-8 sm:mb-10 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            사용 방법
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-blue)' }}>
                1
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  오늘 있었던 일을 간단히 작성
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-purple)' }}>
                2
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  AI 추억보정 버튼을 눌러 변환
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-xl sm:rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-medium mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-pink)' }}>
                3
              </div>
              <div className="pt-1 sm:pt-2">
                <p className="text-base sm:text-lg font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  아름다운 일기를 저장하고 보관
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 추천 대상 - 모바일 최적화 */}
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium sm:font-light text-center mb-8 sm:mb-12 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            이런 분들께 추천해요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="glass-subtle rounded-xl sm:rounded-2xl p-5 sm:p-6 group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                ✍️
              </div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                글쓰기가 어려운 분
              </h4>
              <p className="text-sm sm:text-base text-center font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                간단한 메모만 적어도 AI가<br />
                아름다운 일기로 만들어드려요
              </p>
            </div>
            <div className="glass-subtle rounded-xl sm:rounded-2xl p-5 sm:p-6 group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                💝
              </div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                추억을 소중히 하는 분
              </h4>
              <p className="text-sm sm:text-base text-center font-normal sm:font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                일상의 평범한 순간도<br />
                특별한 추억으로 만들어보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

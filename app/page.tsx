import Link from 'next/link'
import { BookOpen, Sparkles, Heart, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="pb-20 min-h-screen relative">
      {/* 히어로 섹션 - Jonathan Ive 스타일 */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        
        <div className="relative px-6 py-20 text-center">
          {/* 메인 로고/타이틀 */}
          <div className="glass-strong rounded-3xl p-8 mx-auto max-w-md mb-8">
            <h1 className="text-5xl font-light mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              AI 일기장
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
            <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              오늘의 소중한 순간을 AI와 함께<br />
              아름다운 추억으로 만들어보세요
            </p>
          </div>

          {/* CTA 버튼 - Apple 스타일 */}
          <Link
            href="/diary"
            className="group inline-flex items-center px-8 py-4 glass rounded-full hover:glass-strong transition-all duration-300 transform hover:scale-105 font-medium text-lg"
            style={{ color: 'var(--accent-blue)' }}
          >
            <BookOpen className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={24} />
            일기 쓰러 가기
            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </Link>
        </div>
      </div>

      <div className="px-6 py-12">
        {/* 주요 기능 - 3개 카드 그리드 */}
        <div className="grid gap-6 mb-16 max-w-4xl mx-auto">
          {/* 간편한 일기 작성 */}
          <div className="glass rounded-2xl p-8 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex items-start mb-6">
              <div className="glass-subtle rounded-2xl p-4 mr-5 group-hover:scale-110 transition-transform duration-300">
                <BookOpen style={{ color: 'var(--accent-blue)' }} size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  간편한 일기 작성
                </h3>
                <p className="leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                  오늘 있었던 일을 간단히 휘갈겨 써보세요.<br />
                  어떤 형태든 괜찮습니다. 완벽하지 않아도 됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* AI 추억보정 */}
          <div className="glass rounded-2xl p-8 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex items-start mb-6">
              <div className="glass-subtle rounded-2xl p-4 mr-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles style={{ color: 'var(--accent-purple)' }} size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  AI 추억보정
                </h3>
                <p className="leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                  AI가 여러분의 일상을 아름답고 감성적인 문장으로<br />
                  세심하게 다시 써드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* 소중한 추억 보관 */}
          <div className="glass rounded-2xl p-8 group hover:glass-strong transition-all duration-500 transform hover:-translate-y-2">
            <div className="flex items-start mb-6">
              <div className="glass-subtle rounded-2xl p-4 mr-5 group-hover:scale-110 transition-transform duration-300">
                <Heart style={{ color: 'var(--accent-pink)' }} size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  소중한 추억 보관
                </h3>
                <p className="leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                  변환된 일기를 안전하게 저장하고<br />
                  언제든지 다시 읽어보며 추억을 되새겨보세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 사용 방법 - Minimal Steps */}
        <div className="glass-strong rounded-3xl p-10 mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-10 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            사용 방법
          </h2>
          <div className="space-y-8">
            <div className="flex items-start group">
              <div className="glass-subtle rounded-2xl w-12 h-12 flex items-center justify-center text-lg font-medium mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-blue)' }}>
                1
              </div>
              <div className="pt-2">
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  오늘 있었던 일을 간단히 작성
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-2xl w-12 h-12 flex items-center justify-center text-lg font-medium mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-purple)' }}>
                2
              </div>
              <div className="pt-2">
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  AI 추억보정 버튼을 눌러 변환
                </p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="glass-subtle rounded-2xl w-12 h-12 flex items-center justify-center text-lg font-medium mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-pink)' }}>
                3
              </div>
              <div className="pt-2">
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  아름다운 일기를 저장하고 보관
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 추천 대상 - Clean Grid */}
        <div className="glass rounded-3xl p-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            이런 분들께 추천해요
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-subtle rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                ✍️
              </div>
              <h4 className="text-lg font-semibold mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                글쓰기가 어려운 분
              </h4>
              <p className="text-center font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                간단한 메모만 적어도 AI가<br />
                아름다운 일기로 만들어드려요
              </p>
            </div>
            <div className="glass-subtle rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                💝
              </div>
              <h4 className="text-lg font-semibold mb-3 text-center tracking-tight" style={{ color: 'var(--text-primary)' }}>
                추억을 소중히 하는 분
              </h4>
              <p className="text-center font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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

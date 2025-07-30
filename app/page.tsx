import Link from 'next/link'
import { BookOpen, Sparkles, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="pb-20 min-h-screen">
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            AI 일기장
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            오늘의 소중한 순간을 AI와 함께<br />
            아름다운 추억으로 만들어보세요
          </p>
          <Link
            href="/diary"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <BookOpen className="mr-2" size={20} />
            일기 쓰러 가기
          </Link>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* 주요 기능 */}
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold">간편한 일기 작성</h3>
            </div>
            <p className="text-gray-600 text-sm">
              오늘 있었던 일을 간단히 휘갈겨 써보세요. 어떤 형태든 괜찮습니다.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <Sparkles className="text-purple-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold">AI 추억보정</h3>
            </div>
            <p className="text-gray-600 text-sm">
              AI가 여러분의 일상을 아름답고 감성적인 문장으로 다시 써드립니다.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <Heart className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold">소중한 추억 보관</h3>
            </div>
            <p className="text-gray-600 text-sm">
              변환된 일기를 저장하고 언제든지 다시 읽어보며 추억을 되새겨보세요.
            </p>
          </div>
        </div>

        {/* 사용 방법 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-center mb-6">사용 방법</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                1
              </div>
              <p className="text-gray-700">오늘 있었던 일을 간단히 작성</p>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                2
              </div>
              <p className="text-gray-700">AI 추억보정 버튼을 눌러 변환</p>
            </div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                3
              </div>
              <p className="text-gray-700">아름다운 일기를 저장하고 보관</p>
            </div>
          </div>
        </div>

        {/* 추천 대상 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-center mb-6">이런 분들께 추천해요</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                <span className="text-blue-600 text-lg">✍️</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">글쓰기가 어려운 분</h4>
                <p className="text-gray-600 text-sm">
                  간단한 메모만 적어도 AI가 아름다운 일기로 만들어드려요
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                <span className="text-purple-600 text-lg">💝</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">추억을 소중히 하는 분</h4>
                <p className="text-gray-600 text-sm">
                  일상의 평범한 순간도 특별한 추억으로 만들어보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

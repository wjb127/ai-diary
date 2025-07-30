import Link from 'next/link'
import { BookOpen, Sparkles, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          AI 일기장
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          오늘의 소중한 순간을 AI와 함께 아름다운 추억으로 만들어보세요
        </p>
        <Link
          href="/diary"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          <BookOpen className="mr-2" size={24} />
          일기 쓰러 가기
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <BookOpen className="text-blue-600 mr-3" size={32} />
            <h3 className="text-xl font-semibold">간편한 일기 작성</h3>
          </div>
          <p className="text-gray-600">
            오늘 있었던 일을 간단히 적어보세요. 어떤 형태든 괜찮습니다.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Sparkles className="text-purple-600 mr-3" size={32} />
            <h3 className="text-xl font-semibold">AI 감성 변환</h3>
          </div>
          <p className="text-gray-600">
            AI가 여러분의 일상을 아름답고 감성적인 문장으로 다시 써드립니다.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Heart className="text-red-600 mr-3" size={32} />
            <h3 className="text-xl font-semibold">소중한 추억 보관</h3>
          </div>
          <p className="text-gray-600">
            변환된 일기를 저장하고 언제든지 다시 읽어보며 추억을 되새겨보세요.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">이런 분들께 추천해요</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <span className="text-blue-600 font-semibold">✍️</span>
            </div>
            <div>
              <h4 className="font-semibold mb-2">글쓰기가 어려운 분</h4>
              <p className="text-gray-600 text-sm">
                간단한 메모만 적어도 AI가 아름다운 일기로 만들어드려요
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-4">
              <span className="text-purple-600 font-semibold">💝</span>
            </div>
            <div>
              <h4 className="font-semibold mb-2">추억을 소중히 하는 분</h4>
              <p className="text-gray-600 text-sm">
                일상의 평범한 순간도 특별한 추억으로 만들어보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

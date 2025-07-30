'use client'

import { useState, useEffect } from 'react'
import { Crown, Check, Sparkles, BookOpen, Infinity, Zap } from 'lucide-react'
import SubscriptionModal from '@/components/SubscriptionModal'

// Toss Payments 타입 정의
declare global {
  interface Window {
    TossPayments: any
  }
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tossPayments, setTossPayments] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)

  const plans = {
    free: {
      name: '무료 플랜',
      price: 0,
      features: [
        '월 5회 AI 추억보정',
        '기본 일기 저장',
        '7일간 일기 보관',
        '모바일 앱 사용'
      ],
      limitations: [
        'AI 사용 제한',
        '장기 보관 불가',
        '고급 기능 제한'
      ]
    },
    premium: {
      name: '프리미엄',
      monthlyPrice: 9900,
      yearlyPrice: 99000,
      features: [
        '무제한 AI 추억보정',
        '고급 감성 분석',
        '무제한 일기 저장',
        '클라우드 백업',
        '테마 커스터마이징',
        '통계 및 인사이트',
        '우선 고객지원'
      ]
    }
  }

  const getCurrentPrice = () => {
    if (selectedPlan === 'monthly') {
      return plans.premium.monthlyPrice
    }
    return plans.premium.yearlyPrice
  }

  const getMonthlyEquivalent = () => {
    if (selectedPlan === 'yearly') {
      return Math.round(plans.premium.yearlyPrice / 12)
    }
    return plans.premium.monthlyPrice
  }

  // Toss Payments SDK 초기화
  useEffect(() => {
    const loadTossPayments = async () => {
      if (typeof window !== 'undefined' && window.TossPayments) {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_oEjb0gm23Po1pye14mKbr5vbo1mn'
        const customerKey = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        console.log('토스페이먼츠 SDK 초기화:', { clientKey: clientKey ? '설정됨' : '없음', customerKey })
        
        const tossPaymentsInstance = window.TossPayments(clientKey)
        const paymentInstance = tossPaymentsInstance.payment({ customerKey })
        
        setTossPayments(tossPaymentsInstance)
        setPayment(paymentInstance)
      }
    }

    // SDK 스크립트 로드
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.onload = loadTossPayments
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://js.tosspayments.com/v2/standard"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // 구독 처리 함수
  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!payment) {
      alert('결제 시스템이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    console.log('=== 구독 결제 시작 ===')
    console.log('선택된 플랜:', plan)
    setIsLoading(true)

    try {
      const customerKey = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const amount = plan === 'monthly' ? plans.premium.monthlyPrice : plans.premium.yearlyPrice
      
      console.log('빌링 인증 요청:', { customerKey, amount })
      
      // 빌링 인증 요청
      await payment.requestBillingAuth({
        method: 'CARD', // 카드 자동결제
        successUrl: `${window.location.origin}/api/billing/success?plan=${plan}&amount=${amount}`,
        failUrl: `${window.location.origin}/api/billing/fail`,
        customerEmail: 'user@example.com',
        customerName: '사용자',
      })
    } catch (error) {
      console.error('빌링 인증 오류:', error)
      alert('결제 인증 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 text-center">
          <Crown className="mx-auto text-yellow-500 mb-3" size={32} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">구독 플랜</h1>
          <p className="text-gray-600">더 많은 추억을 아름답게 보관하세요</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 현재 플랜 상태 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800">현재 무료 플랜 사용 중</h3>
              <p className="text-sm text-blue-600">이번 달 AI 사용: 2/5회</p>
            </div>
          </div>
        </div>

        {/* 무료 플랜 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{plans.free.name}</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">무료</span>
              </div>
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              현재 플랜
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {plans.free.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check size={16} className="text-green-600 mr-3" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-2">제한사항:</p>
            {plans.free.limitations.map((limitation, index) => (
              <div key={index} className="flex items-center mb-1">
                <div className="w-4 h-4 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500">{limitation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 플랜 선택 토글 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative ${
                selectedPlan === 'yearly'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              연간 결제
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                17% 할인
              </span>
            </button>
          </div>
        </div>

        {/* 프리미엄 플랜 */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center mb-2">
                <Crown className="text-yellow-500 mr-2" size={20} />
                <h3 className="text-lg font-semibold">{plans.premium.name}</h3>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">₩{getCurrentPrice().toLocaleString()}</span>
                <span className="text-gray-600 ml-1">
                  {selectedPlan === 'monthly' ? '/월' : '/년'}
                </span>
              </div>
              {selectedPlan === 'yearly' && (
                <p className="text-sm text-purple-600">월 ₩{getMonthlyEquivalent().toLocaleString()} 상당</p>
              )}
            </div>
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              추천
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            {plans.premium.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check size={16} className="text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? '처리 중...' : '프리미엄으로 업그레이드'}
          </button>
        </div>

        {/* 특징 설명 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Infinity className="mx-auto text-blue-600 mb-2" size={24} />
            <h4 className="font-medium text-gray-800 mb-1">무제한 사용</h4>
            <p className="text-xs text-gray-600">AI 변환 횟수 제한 없음</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Sparkles className="mx-auto text-purple-600 mb-2" size={24} />
            <h4 className="font-medium text-gray-800 mb-1">고급 AI</h4>
            <p className="text-xs text-gray-600">더 섬세한 감성 표현</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <BookOpen className="mx-auto text-green-600 mb-2" size={24} />
            <h4 className="font-medium text-gray-800 mb-1">무제한 저장</h4>
            <p className="text-xs text-gray-600">모든 추억을 영구보관</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Zap className="mx-auto text-yellow-600 mb-2" size={24} />
            <h4 className="font-medium text-gray-800 mb-1">빠른 처리</h4>
            <p className="text-xs text-gray-600">우선 순위 처리</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">자주 묻는 질문</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">언제든 해지할 수 있나요?</h4>
              <p className="text-sm text-gray-600">네, 언제든지 구독을 해지할 수 있습니다. 해지 후에도 결제 기간 끝까지 서비스를 이용할 수 있어요.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">데이터는 안전한가요?</h4>
              <p className="text-sm text-gray-600">모든 일기 데이터는 암호화되어 안전하게 보관됩니다. 개인정보는 절대 제3자와 공유되지 않아요.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">무료 플랜으로 돌아갈 수 있나요?</h4>
              <p className="text-sm text-gray-600">물론입니다. 언제든지 무료 플랜으로 다운그레이드할 수 있어요.</p>
            </div>
          </div>
        </div>

        {/* 구독 모달 */}
        <SubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  )
}
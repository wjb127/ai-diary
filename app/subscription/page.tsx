'use client'

import { useState, useEffect } from 'react'
import { Crown, Check, Sparkles, BookOpen, Infinity, Zap } from 'lucide-react'
import { useLanguage } from '../providers/LanguageProvider'
import SubscriptionModal from '@/components/SubscriptionModal'

// Toss Payments 타입 정의
interface TossPaymentsInstance {
  payment: (options: { customerKey: string }) => PaymentInstance
}

interface PaymentInstance {
  requestBillingAuth: (options: {
    method: string
    successUrl: string
    failUrl: string
    customerEmail: string
    customerName: string
  }) => Promise<void>
}

declare global {
  interface Window {
    TossPayments: (clientKey: string) => TossPaymentsInstance
  }
}

export default function SubscriptionPage() {
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [payment, setPayment] = useState<PaymentInstance | null>(null)

  const plans = {
    free: {
      name: t('subscription.freePlan'),
      price: 0,
      features: Array.isArray(t('subscription.features.freeFeatures')) 
        ? t('subscription.features.freeFeatures') as unknown as string[]
        : [],
      limitations: Array.isArray(t('subscription.features.freeLimitations')) 
        ? t('subscription.features.freeLimitations') as unknown as string[]
        : []
    },
    premium: {
      name: t('subscription.premiumPlan'),
      monthlyPrice: 9900,
      yearlyPrice: 99000,
      features: Array.isArray(t('subscription.features.premiumFeatures')) 
        ? t('subscription.features.premiumFeatures') as unknown as string[]
        : []
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
    <div className="pb-20 sm:pb-0 min-h-screen relative">
      {/* 헤더 - 모바일 최적화 */}
      <div className="glass-strong sticky top-0 z-40 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <div className="glass-subtle rounded-2xl p-3 sm:p-4 inline-block mb-3 sm:mb-4">
            <Crown style={{ color: 'var(--accent-purple)' }} size={28} className="sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium sm:font-light mb-2 sm:mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>구독 플랜</h1>
          <p className="text-base sm:text-lg font-normal sm:font-light" style={{ color: 'var(--text-secondary)' }}>더 많은 추억을 아름답게 보관하세요</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* 현재 플랜 상태 - 모바일 최적화 */}
        <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8" style={{ border: '2px solid rgba(0, 122, 255, 0.3)' }}>
          <div className="flex items-center">
            <div className="glass-subtle rounded-2xl p-2.5 sm:p-3 mr-3 sm:mr-4">
              <BookOpen style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>현재 무료 플랜 사용 중</h3>
              <p className="text-sm sm:text-base font-normal" style={{ color: 'var(--text-secondary)' }}>이번 달 AI 사용: 2/5회</p>
            </div>
          </div>
        </div>

        {/* 무료 플랜 - 모바일 최적화 */}
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{plans.free.name}</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>무료</span>
              </div>
            </div>
            <div className="glass-subtle px-3 py-1.5 rounded-full">
              <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>현재 플랜</span>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
            {plans.free.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="glass-subtle rounded-xl p-1.5 mr-3 flex-shrink-0">
                  <Check size={14} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-sm sm:text-base font-normal" style={{ color: 'var(--text-primary)' }}>{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3" style={{ color: 'var(--text-light)' }}>제한사항:</p>
            {plans.free.limitations.map((limitation, index) => (
              <div key={index} className="flex items-center mb-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-400/50 mr-3 flex items-center justify-center flex-shrink-0">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <span className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-light)' }}>{limitation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 플랜 선택 토글 - 모바일 최적화 */}
        <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
          <div className="flex glass-subtle rounded-lg p-1">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 touch-target ${
                selectedPlan === 'monthly'
                  ? 'glass-strong shadow-sm transform scale-105'
                  : 'hover:glass'
              }`}
              style={{ color: selectedPlan === 'monthly' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {t('subscription.monthlyBilling')}
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 relative touch-target ${
                selectedPlan === 'yearly'
                  ? 'glass-strong shadow-sm transform scale-105'
                  : 'hover:glass'
              }`}
              style={{ color: selectedPlan === 'yearly' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {t('subscription.yearlyBilling')}
              <span className="absolute -top-1 -right-1 glass-subtle px-2 py-0.5 rounded-full text-xs font-medium" style={{ color: 'var(--accent-pink)', backgroundColor: 'rgba(255, 45, 146, 0.2)' }}>
                {t('subscription.discountBadge')}
              </span>
            </button>
          </div>
        </div>

        {/* 프리미엄 플랜 - 모바일 최적화 */}
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8" style={{ border: '2px solid rgba(175, 82, 222, 0.3)' }}>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex-1">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="glass-subtle rounded-xl p-2 mr-3">
                  <Crown style={{ color: 'var(--accent-purple)' }} size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{plans.premium.name}</h3>
              </div>
              <div className="flex items-baseline mb-1 sm:mb-2">
                <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>₩{getCurrentPrice().toLocaleString()}</span>
                <span className="text-base sm:text-lg font-normal ml-2" style={{ color: 'var(--text-secondary)' }}>
                  {selectedPlan === 'monthly' ? t('subscription.perMonth') : t('subscription.perYear')}
                </span>
              </div>
              {selectedPlan === 'yearly' && (
                <p className="text-sm sm:text-base font-medium" style={{ color: 'var(--accent-purple)' }}>월 ₩{getMonthlyEquivalent().toLocaleString()} {t('subscription.monthlyEquivalent')}</p>
              )}
            </div>
            <div className="glass-subtle px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="text-sm sm:text-base font-medium" style={{ color: 'var(--accent-purple)' }}>
                {t('subscription.recommendedBadge')}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {plans.premium.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="glass-subtle rounded-xl p-1.5 mr-3 flex-shrink-0">
                  <Check size={14} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <span className="text-sm sm:text-base font-normal" style={{ color: 'var(--text-primary)' }}>{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 glass rounded-xl sm:rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg font-medium btn-mobile touch-target"
            style={{ color: 'var(--accent-purple)' }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-pulse">{t('subscription.processing')}</span>
                <span className="ml-2 animate-bounce">...</span>
              </span>
            ) : (
              t('subscription.upgradeButton')
            )}
          </button>
        </div>

        {/* 특징 설명 - 모바일 최적화 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="glass-subtle rounded-xl p-2.5 sm:p-3 inline-block mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Infinity style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.highlights.unlimited.title')}</h4>
            <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>{t('subscription.highlights.unlimited.description')}</p>
          </div>
          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="glass-subtle rounded-xl p-2.5 sm:p-3 inline-block mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Sparkles style={{ color: 'var(--accent-purple)' }} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.highlights.advancedAI.title')}</h4>
            <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>{t('subscription.highlights.advancedAI.description')}</p>
          </div>
          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="glass-subtle rounded-xl p-2.5 sm:p-3 inline-block mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
              <BookOpen style={{ color: 'var(--accent-blue)' }} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.highlights.unlimitedStorage.title')}</h4>
            <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>{t('subscription.highlights.unlimitedStorage.description')}</p>
          </div>
          <div className="glass-readable rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center group hover:glass-strong transition-all duration-300 transform hover:scale-105">
            <div className="glass-subtle rounded-xl p-2.5 sm:p-3 inline-block mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Zap style={{ color: 'var(--accent-purple)' }} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.highlights.fastProcessing.title')}</h4>
            <p className="text-xs sm:text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>{t('subscription.highlights.fastProcessing.description')}</p>
          </div>
        </div>

        {/* FAQ - 모바일 최적화 */}
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-6">
          <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.faq.title')}</h3>
          <div className="space-y-4 sm:space-y-5">
            <div className="glass-subtle rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.faq.cancelAnytime.question')}</h4>
              <p className="text-sm sm:text-base font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('subscription.faq.cancelAnytime.answer')}</p>
            </div>
            <div className="glass-subtle rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.faq.dataSafety.question')}</h4>
              <p className="text-sm sm:text-base font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('subscription.faq.dataSafety.answer')}</p>
            </div>
            <div className="glass-subtle rounded-xl p-4 sm:p-5">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>{t('subscription.faq.downgrade.question')}</h4>
              <p className="text-sm sm:text-base font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('subscription.faq.downgrade.answer')}</p>
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
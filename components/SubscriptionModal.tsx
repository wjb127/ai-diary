'use client'

import { useState } from 'react'
import { X, Crown, Check, Sparkles } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: (plan: 'monthly' | 'yearly') => Promise<void>
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = async () => {
    console.log('구독 시작:', selectedPlan)
    setIsLoading(true)
    
    try {
      await onSubscribe(selectedPlan)
    } catch (error) {
      console.error('구독 오류:', error)
      alert('구독 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 glass-strong border-b border-white/20 px-8 py-6 rounded-t-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="glass-subtle rounded-2xl p-2 mr-3">
                <Crown style={{ color: 'var(--accent-purple)' }} size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-tight" style={{ color: 'var(--text-primary)' }}>AI 일기장 프리미엄</h2>
            </div>
            <button
              onClick={onClose}
              className="glass-subtle p-3 rounded-2xl hover:glass transition-all duration-300 transform hover:scale-110"
            >
              <X size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-8">
          {/* 프리미엄 혜택 */}
          <div className="mb-8">
            <h3 className="text-xl font-light mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>프리미엄 혜택</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="glass-subtle rounded-2xl p-2 mr-4">
                  <Check size={16} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>무제한 AI 추억보정</span>
              </div>
              <div className="flex items-center">
                <div className="glass-subtle rounded-2xl p-2 mr-4">
                  <Check size={16} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>무제한 일기 저장</span>
              </div>
              <div className="flex items-center">
                <div className="glass-subtle rounded-2xl p-2 mr-4">
                  <Check size={16} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>고급 통계 및 분석</span>
              </div>
              <div className="flex items-center">
                <div className="glass-subtle rounded-2xl p-2 mr-4">
                  <Check size={16} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>데이터 백업 및 내보내기</span>
              </div>
              <div className="flex items-center">
                <div className="glass-subtle rounded-2xl p-2 mr-4">
                  <Check size={16} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <span className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>우선 고객 지원</span>
              </div>
            </div>
          </div>

          {/* 요금제 선택 */}
          <div className="mb-8">
            <h3 className="text-xl font-light mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>요금제 선택</h3>
            <div className="space-y-4">
              {/* 월간 요금제 */}
              <div
                className={`glass-subtle rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedPlan === 'monthly'
                    ? 'glass border-2'
                    : 'hover:glass'
                }`}
                style={selectedPlan === 'monthly' ? { borderColor: 'var(--accent-blue)' } : {}}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-300 ${
                        selectedPlan === 'monthly' 
                          ? 'border-blue-500 bg-blue-500 transform scale-110' 
                          : 'border-gray-400'
                      }`}>
                        {selectedPlan === 'monthly' && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>월간 구독</p>
                        <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>언제든 해지 가능</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-light" style={{ color: 'var(--accent-blue)' }}>₩9,900</p>
                    <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>/월</p>
                  </div>
                </div>
              </div>

              {/* 연간 요금제 */}
              <div
                className={`glass-subtle rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 relative ${
                  selectedPlan === 'yearly'
                    ? 'glass border-2'
                    : 'hover:glass'
                }`}
                style={selectedPlan === 'yearly' ? { borderColor: 'var(--accent-purple)' } : {}}
                onClick={() => setSelectedPlan('yearly')}
              >
                {/* 할인 배지 */}
                <div className="absolute -top-3 -right-3 glass rounded-2xl px-3 py-1.5 text-sm font-medium" style={{ color: 'var(--accent-pink)' }}>
                  17% 할인
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-300 ${
                        selectedPlan === 'yearly' 
                          ? 'border-purple-500 bg-purple-500 transform scale-110' 
                          : 'border-gray-400'
                      }`}>
                        {selectedPlan === 'yearly' && (
                          <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>연간 구독</p>
                        <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>2개월 무료 혜택</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-light" style={{ color: 'var(--accent-purple)' }}>₩99,000</p>
                    <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
                      /년
                      <span className="line-through ml-2 opacity-60">₩118,800</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 구독 버튼 */}
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-8 py-5 glass rounded-2xl hover:glass-strong disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg font-medium group"
            style={{ color: selectedPlan === 'monthly' ? 'var(--accent-blue)' : 'var(--accent-purple)' }}
          >
            <Sparkles className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={24} />
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3" style={{ borderColor: 'var(--text-primary)' }}></div>
                구독 처리 중...
              </span>
            ) : (
              `${selectedPlan === 'monthly' ? '월간' : '연간'} 구독 시작하기`
            )}
          </button>

          {/* 안내 문구 */}
          <div className="mt-6 text-center">
            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              7일 무료 체험 후 자동 결제됩니다.<br />
              언제든 해지 가능합니다.
            </p>
            <p className="text-sm font-light mt-2" style={{ color: 'var(--text-secondary)' }}>
              결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
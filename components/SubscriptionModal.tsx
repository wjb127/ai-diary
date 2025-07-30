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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="text-yellow-500 mr-2" size={24} />
              <h2 className="text-xl font-bold">AI 일기장 프리미엄</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {/* 프리미엄 혜택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">프리미엄 혜택</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check size={14} className="text-green-600" />
                </div>
                <span className="text-gray-700">무제한 AI 추억보정</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check size={14} className="text-green-600" />
                </div>
                <span className="text-gray-700">무제한 일기 저장</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check size={14} className="text-green-600" />
                </div>
                <span className="text-gray-700">고급 통계 및 분석</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check size={14} className="text-green-600" />
                </div>
                <span className="text-gray-700">데이터 백업 및 내보내기</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check size={14} className="text-green-600" />
                </div>
                <span className="text-gray-700">우선 고객 지원</span>
              </div>
            </div>
          </div>

          {/* 요금제 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">요금제 선택</h3>
            <div className="space-y-3">
              {/* 월간 요금제 */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPlan === 'monthly' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === 'monthly' && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">월간 구독</p>
                        <p className="text-sm text-gray-600">언제든 해지 가능</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₩9,900</p>
                    <p className="text-sm text-gray-500">/월</p>
                  </div>
                </div>
              </div>

              {/* 연간 요금제 */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors relative ${
                  selectedPlan === 'yearly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                {/* 할인 배지 */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  17% 할인
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPlan === 'yearly' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === 'yearly' && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">연간 구독</p>
                        <p className="text-sm text-gray-600">2개월 무료 혜택</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₩99,000</p>
                    <p className="text-sm text-gray-500">
                      /년
                      <span className="line-through text-gray-400 ml-1">₩118,800</span>
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
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all transform active:scale-95 font-semibold"
          >
            <Sparkles className="mr-2" size={20} />
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                구독 처리 중...
              </span>
            ) : (
              `${selectedPlan === 'monthly' ? '월간' : '연간'} 구독 시작하기`
            )}
          </button>

          {/* 안내 문구 */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              7일 무료 체험 후 자동 결제됩니다. 언제든 해지 가능합니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
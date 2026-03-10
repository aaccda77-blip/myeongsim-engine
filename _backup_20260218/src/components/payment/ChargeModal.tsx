'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface ChargeModalProps {
    onClose: () => void;
    userId: string;
}

export default function ChargeModal({ onClose, userId }: ChargeModalProps) {
    const [amount, setAmount] = useState<number | null>(null);
    const [depositorName, setDepositorName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'select' | 'input' | 'success'>('select');

    const handleSelectAmount = (val: number) => {
        setAmount(val);
        setStep('input');
    };

    const handleSubmit = async () => {
        if (!amount || !depositorName.trim()) return;
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('payment_requests')
                .insert({
                    user_id: userId,
                    amount,
                    depositor_name: depositorName,
                    status: 'pending'
                });

            if (error) throw error;
            setStep('success');
        } catch (err) {
            console.error('Charge Error:', err);
            alert('신청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                {step === 'select' && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-2 text-center">포인트 충전</h2>
                        <p className="text-sm text-gray-400 text-center mb-6">충전할 금액을 선택해주세요.</p>
                        <div className="space-y-3">
                            <button onClick={() => handleSelectAmount(5000)} className="w-full flex justify-between items-center p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition border border-gray-700">
                                <span className="text-white font-bold">5,000 P</span>
                                <span className="text-cyan-400">5,000원</span>
                            </button>
                            <button onClick={() => handleSelectAmount(10000)} className="w-full flex justify-between items-center p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition border border-gray-700">
                                <span className="text-white font-bold">10,000 P</span>
                                <span className="text-cyan-400">10,000원</span>
                            </button>
                        </div>
                    </>
                )}

                {step === 'input' && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-2 text-center">입금 정보 입력</h2>
                        <div className="bg-gray-800 p-4 rounded-xl mb-4 text-center border border-gray-700">
                            <p className="text-xs text-gray-400 mb-1">입금하실 계좌</p>
                            <p className="text-lg font-bold text-yellow-400">국민은행 123-456-7890</p>
                            <p className="text-sm text-white mt-1">예금주: 명심코칭</p>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs text-gray-400 block mb-2">입금자명 (실제 입금 이름)</label>
                            <input
                                type="text"
                                value={depositorName}
                                onChange={(e) => setDepositorName(e.target.value)}
                                placeholder="홍길동"
                                className="w-full bg-black border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!depositorName.trim() || isSubmitting}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition"
                        >
                            {isSubmitting ? '처리 중...' : '신청하기'}
                        </button>

                        <button onClick={() => setStep('select')} className="w-full mt-3 text-sm text-gray-500 hover:text-white">
                            뒤로가기
                        </button>
                    </>
                )}

                {step === 'success' && (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">신청 완료!</h2>
                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                            입금이 확인되면 포인트가 지급됩니다.<br />
                            (보통 10분 이내 처리)
                        </p>
                        <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl">
                            확인
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, RefreshCw, Loader2, DollarSign } from 'lucide-react';

interface PaymentRequest {
    id: string;
    depositor_name: string;
    amount: number;
    item_id: string;
    created_at: string;
}

export default function AdminPage() {
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPayments(data);
            }
        } catch (e) {
            console.error(e);
            alert('로드 실패');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('입금을 확인하고 승인하시겠습니까?')) return;

        setProcessingId(id);
        try {
            const res = await fetch('/api/admin/payments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                alert('승인되었습니다.');
                fetchPayments(); // Refresh list
            } else {
                throw new Error('처리 실패');
            }
        } catch (e) {
            alert('오류가 발생했습니다.');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-gold mb-2">무통장 입금 관리</h1>
                        <p className="text-gray-400">PENDING 상태의 입금 요청을 확인하고 승인합니다.</p>
                    </div>
                    <button
                        onClick={fetchPayments}
                        className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* List */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-5 bg-gray-800/50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">요청 시간</div>
                        <div className="col-span-1">입금자명</div>
                        <div className="col-span-1">상품 (Tier)</div>
                        <div className="col-span-1 text-right pr-4">금액</div>
                        <div className="col-span-1 text-center">Action</div>
                    </div>

                    {isLoading ? (
                        <div className="p-12 flex justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            대기 중인 입금 요청이 없습니다.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {payments.map((payment) => (
                                <div key={payment.id} className="grid grid-cols-5 p-4 items-center hover:bg-white/5 transition-colors">
                                    <div className="col-span-1 text-sm text-gray-400">
                                        {format(new Date(payment.created_at), 'MM.dd HH:mm', { locale: ko })}
                                    </div>
                                    <div className="col-span-1 font-bold text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-gold/20 flex items-center justify-center text-primary-gold text-xs">
                                            {payment.depositor_name[0]}
                                        </div>
                                        {payment.depositor_name}
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${payment.item_id === 'MASTER' ? 'bg-purple-900/50 text-purple-400 border border-purple-800' : 'bg-blue-900/50 text-blue-400 border border-blue-800'
                                            }`}>
                                            {payment.item_id}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-right pr-4 text-sm font-mono text-gray-300">
                                        {payment.amount.toLocaleString()}원
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button
                                            onClick={() => handleApprove(payment.id)}
                                            disabled={processingId === payment.id}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingId === payment.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>승인</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PaymentRequest {
    id: string;
    user_id: string;
    amount: number;
    depositor_name: string;
    created_at: string;
    status: string;
    user_email?: string; // Optional join
}

export default function AdminPaymentsPage() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdmin();
        fetchRequests();
    }, []);

    const checkAdmin = async () => {
        // Ideally check role table here. MVP: Just load page and let RLS fail if not admin.
        // Or implemented hardcoded check.
        setIsAdmin(true);
    };

    const fetchRequests = async () => {
        setLoading(true);
        // Join with profiles if possible, or just fetch ID
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (data) setRequests(data);
        setLoading(false);
    };

    const handleApprove = async (req: PaymentRequest) => {
        if (!confirm(`${req.depositor_name}님의 ${req.amount}원 입금을 승인하시겠습니까?`)) return;

        try {
            // 1. Update Request Status
            const { error: reqError } = await supabase
                .from('payment_requests')
                .update({ status: 'approved' })
                .eq('id', req.id);

            if (reqError) throw reqError;

            // 2. Increment User Points (Using RPC is better, but MVP assumes two calls)
            // Check current points first
            const { data: userData } = await supabase.from('profiles').select('points').eq('id', req.user_id).single();
            const currentPoints = userData?.points || 0;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ points: currentPoints + req.amount })
                .eq('id', req.user_id);

            if (profileError) {
                alert('Payment marked approved but Profile update failed! Check DB.');
                throw profileError;
            }

            alert('승인 완료');
            fetchRequests(); // Refresh
        } catch (e) {
            console.error(e);
            alert('처리 중 오류 발생');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-cyan-400">💎 포인트 충전 관리 (Admin)</h1>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">신청일시</th>
                            <th className="p-4">입금자명</th>
                            <th className="p-4">금액</th>
                            <th className="p-4">User ID</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center">로딩 중...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">대기 중인 요청이 없습니다.</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-sm text-gray-300">{new Date(req.created_at).toLocaleString()}</td>
                                    <td className="p-4 font-bold">{req.depositor_name}</td>
                                    <td className="p-4 text-yellow-400 font-bold">{req.amount.toLocaleString()} P</td>
                                    <td className="p-4 text-xs text-gray-500 font-mono">{req.user_id}</td>
                                    <td className="p-4 text-right flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleApprove(req)}
                                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-md transition-colors"
                                        >
                                            승인 (Approve)
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('정말 거절하시겠습니까?')) return;
                                                const { error } = await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', req.id);
                                                if (!error) {
                                                    alert('거절되었습니다.');
                                                    fetchRequests();
                                                }
                                            }}
                                            className="bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs transition-colors"
                                        >
                                            거절
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

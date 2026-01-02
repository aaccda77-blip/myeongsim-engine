'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Shield, CheckCircle, Clock, User } from 'lucide-react';

interface UserRecord {
    id: string;
    phone_hash: string;
    created_at: string;
    membership_tier: string;
    is_active: boolean;
    expires_at?: string;
    payment_amount?: number;
    approved_at?: string;
}

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTiers, setSelectedTiers] = useState<Record<string, string>>({});



    const handleLogin = async () => {
        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                fetchUsers();
            } else {
                alert(data.error || '비밀번호가 틀렸습니다.');
            }
        } catch (error) {
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setUsers(data);
        if (error) console.error('User Fetch Error:', error);
        setLoading(false);
    };

    const approveUser = async (userId: string, tier: string) => {
        const now = new Date();
        let expiresAt: Date | null = null;
        let paymentAmount = 0;

        // Calculate expiration based on tier
        switch (tier) {
            case 'TRIAL_30M':
                expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
                paymentAmount = 3900;
                break;
            case 'PASS_24H':
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                paymentAmount = 9900;
                break;
            case 'VIP_7D':
                expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
                paymentAmount = 49000;
                break;
            default:
                alert('올바른 이용권을 선택해주세요.');
                return;
        }

        const { error } = await supabase
            .from('users')
            .update({
                membership_tier: tier,
                is_active: true,
                expires_at: expiresAt.toISOString(),
                payment_amount: paymentAmount,
                approved_at: now.toISOString(),
                approved_by: 'admin' // Could be dynamic in future
            })
            .eq('id', userId);

        if (!error) {
            alert(`승인 완료! (${tier}, 만료: ${expiresAt.toLocaleString('ko-KR')})`);
            fetchUsers();
        } else {
            alert('승인 실패: ' + error.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="비밀번호 입력"
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        로그인
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-indigo-400" />
                            <h1 className="text-2xl font-bold text-white">회원 관리 대시보드</h1>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            새로고침
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white py-12">로딩 중...</div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => {
                            // [Security Fix] Strict Expiration Check
                            const isActive = user.expires_at && new Date(user.expires_at) > new Date();
                            const isExpired = user.expires_at && new Date(user.expires_at) < new Date(); // [Fix] Re-added for UI
                            const hasPremium = user.membership_tier && user.membership_tier !== 'FREE' && isActive;

                            // [Admin Dashboard Auto-Select] Map User Request to Admin Code
                            const requestedTier = (() => {
                                const t = user.membership_tier;
                                if (t === 'TRIAL') return 'TRIAL_30M';
                                if (t === 'PASS') return 'PASS_24H';
                                if (t === 'VIP') return 'VIP_7D';
                                if (['TRIAL_30M', 'PASS_24H', 'VIP_7D'].includes(t)) return t;
                                return '';
                            })();

                            const selectedTier = selectedTiers[user.id] || requestedTier || '';

                            return (
                                <div
                                    key={user.id}
                                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-white font-mono text-sm">
                                                    {user.phone_hash.substring(0, 12)}...
                                                </div>
                                                <div className="text-gray-400 text-xs mt-1">
                                                    가입: {new Date(user.created_at).toLocaleDateString('ko-KR')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${user.membership_tier === 'FREE' || !user.membership_tier
                                            ? 'bg-gray-500/20 text-gray-300'
                                            : isExpired
                                                ? 'bg-red-500/20 text-red-300'
                                                : 'bg-green-500/20 text-green-300'
                                            }`}>
                                            {user.membership_tier || 'FREE'}
                                        </div>
                                    </div>

                                    {user.expires_at && (
                                        <div className="flex items-center gap-2 text-xs mb-3">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className={isExpired ? 'text-red-400' : 'text-gray-400'}>
                                                {isExpired ? '만료됨' : '만료'}: {new Date(user.expires_at).toLocaleString('ko-KR')}
                                            </span>
                                        </div>
                                    )}

                                    {user.membership_tier === 'FREE' || !user.membership_tier || isExpired ? (
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedTier}
                                                onChange={(e) => setSelectedTiers(prev => ({ ...prev, [user.id]: e.target.value }))}
                                                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            >
                                                <option value="">이용권 선택</option>
                                                <option value="TRIAL_30M">💎 맛보기 (30분) - 3,900원</option>
                                                <option value="PASS_24H">⚡ 데이 패스 (24시간) - 9,900원</option>
                                                <option value="VIP_7D">👑 VIP (7일) - 49,000원</option>
                                            </select>
                                            <button
                                                onClick={() => selectedTier && approveUser(user.id, selectedTier)}
                                                disabled={!selectedTier}
                                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                승인
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-green-400 text-sm flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            승인됨 ({user.payment_amount?.toLocaleString()}원)
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {users.length === 0 && (
                            <div className="text-center text-gray-400 py-12">
                                등록된 회원이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

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

    // 🔴 [실시간 동시 접속자 수 현황 카운트]
    const [onlineUserCount, setOnlineUserCount] = useState<number>(1);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Supabase Presence 채널을 통한 실시간 접속자 추적
        const presenceChannel = supabase.channel('online-users-presence', {
            config: {
                presence: {
                    key: 'admin-tracker'
                }
            }
        });

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const count = Object.keys(state).length;
                console.log('🔴 [Presence] Realtime Online Users Count:', count, state);
                setOnlineUserCount(Math.max(1, count));
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('🟢 [Presence] User Joined:', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('🔴 [Presence] User Left:', key, leftPresences);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        online_at: new Date().toISOString(),
                        role: 'admin'
                    });
                }
            });

        return () => {
            supabase.removeChannel(presenceChannel);
        };
    }, [isAuthenticated]);



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
        try {
            // [Fix] Force fresh data fetch (Browser Caching issue)
            const response = await fetch(`/api/admin/users?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setIsAuthenticated(true); // [UX] Auto-login successful
            } else {
                const errorData = await response.json();
                if (response.status === 401) {
                    setIsAuthenticated(false);
                } else {
                    alert(`오류: ${errorData.details || errorData.error || '데이터를 불러올 수 없습니다.'}`);
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    // [UX] Check session on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const approveUser = async (userId: string, tier: string) => {
        try {
            const response = await fetch('/api/admin/users/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, tier })
            });

            const data = await response.json();

            if (data.success) {
                alert(`승인 완료! (${tier})`);
                fetchUsers();
            } else {
                alert('승인 실패: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            alert('승인 중 오류가 발생했습니다.');
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('정말로 이 사용자를 삭제하시겠습니까? (복구 불가)')) return;

        try {
            const response = await fetch('/api/admin/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (data.success) {
                alert('사용자가 삭제되었습니다.');
                fetchUsers();
            } else {
                alert('삭제 실패: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-indigo-400" />
                            <h1 className="text-2xl font-bold text-white">회원 관리 대시보드</h1>
                            
                            {/* 🔴 [실시간 동시 접속자 수 뱃지] */}
                            <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3.5 py-1.5 rounded-full text-red-200 text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                                <span>🔴 실시간 동시 접속자: <strong className="text-white text-sm font-mono font-black ml-1">{onlineUserCount}명</strong> (Live)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="/admin/users"
                                className="bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                👥 가입자 통합 관리
                            </a>
                            <a
                                href="/admin/payments"
                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs transition-colors"
                            >
                                💳 결제 내역
                            </a>
                            <a
                                href="/admin/keys"
                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs transition-colors"
                            >
                                🔑 키 관리
                            </a>
                            <button
                                onClick={fetchUsers}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
                            >
                                새로고침
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white py-12">로딩 중...</div>
                ) : (
                    <div className="grid gap-4">
                        {users.sort((a, b) => {
                            const isPendingA = a.is_active === false || (a.membership_tier && a.membership_tier !== 'FREE' && (!a.expires_at || new Date(a.expires_at) < new Date()));
                            const isPendingB = b.is_active === false || (b.membership_tier && b.membership_tier !== 'FREE' && (!b.expires_at || new Date(b.expires_at) < new Date()));

                            if (isPendingA && !isPendingB) return -1;
                            if (!isPendingA && isPendingB) return 1;

                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                        }).map((user) => {
                            const isActive = user.is_active && user.expires_at && new Date(user.expires_at) > new Date();
                            const isExpired = user.expires_at && new Date(user.expires_at) < new Date();
                            const isPending = user.is_active === false || (user.membership_tier && user.membership_tier !== 'FREE' && !isActive);

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
                                    className={`bg-white/10 backdrop-blur-lg border rounded-xl p-5 transition-all ${isPending ? 'border-yellow-400/50 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'border-white/20 hover:bg-white/15'}`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <User className={`w-5 h-5 ${isPending ? 'text-yellow-400' : 'text-gray-400'}`} />
                                            <div>
                                                <div className="text-white font-mono text-sm flex items-center gap-2">
                                                    {user.phone_hash ? `${user.phone_hash.substring(0, 12)}...` : '(전화번호 없음)'}
                                                    {isPending && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full animate-pulse">승인 대기중</span>}
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
                                                : isActive
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {user.membership_tier || 'FREE'}
                                        </div>
                                    </div>

                                    {user.expires_at && (
                                        <div className="flex items-center gap-2 text-xs mb-3">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className={isExpired ? 'text-red-400' : 'text-gray-400'}>
                                                {isExpired ? '만료됨' : '만료'}: {new Date(user.expires_at).toLocaleString('ko-KR')}
                                                {/* [DEBUG] Show raw value */}
                                                <br />
                                                <span className="text-[10px] text-gray-600">Raw: {user.expires_at}</span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        {!(user.membership_tier === 'FREE' || !user.membership_tier || isExpired) && isActive && (
                                            <div className="text-green-400 text-sm flex items-center gap-1 mb-1">
                                                <CheckCircle className="w-4 h-4" />
                                                승인됨 ({user.payment_amount?.toLocaleString()}원) - {user.membership_tier}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <select
                                                value={selectedTier}
                                                onChange={(e) => setSelectedTiers(prev => ({ ...prev, [user.id]: e.target.value }))}
                                                className={`flex-1 bg-black/50 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 ${isPending ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-white/20'}`}
                                            >
                                                <option value="">이용권 선택 (충전/연장)</option>
                                                <option value="CHAT_3">⚡ 890원 전 컨텐츠 3회 이용권 (890원)</option>
                                            </select>
                                            <button
                                                onClick={() => selectedTier && approveUser(user.id, selectedTier)}
                                                disabled={!selectedTier}
                                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {isActive ? '변경/연장' : '승인'}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg transition-colors border border-red-500/30"
                                                title="사용자 삭제 (중복 계정 정리용)"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
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

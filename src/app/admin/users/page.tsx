'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Search, ShieldCheck, Clock, RefreshCw, Trash2, 
    UserCheck, CreditCard, Sparkles, Filter, ChevronRight, Lock, Key, Calendar, Zap
} from 'lucide-react';
import MyeongsimSunLogo from '@/components/common/MyeongsimSunLogo';

interface Subscriber {
    id: string;
    phone_hash: string;
    created_at: string;
    membership_tier: string;
    is_active: boolean;
    expires_at?: string;
    payment_amount?: number;
    approved_at?: string;
    saju_summary?: string;
    chat_turns_left?: number;
}

export default function AdminUsersPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState<string>('ALL');
    const [selectedTiers, setSelectedTiers] = useState<Record<string, string>>({});

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setIsAuthenticated(true);
            } else if (response.status === 401) {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
                alert(data.error || '관리자 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            alert('로그인 오류가 발생했습니다.');
        }
    };

    const approveUser = async (userId: string, tier: string) => {
        try {
            const response = await fetch('/api/admin/users/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, tier })
            });
            const data = await response.json();
            if (data.success) {
                alert(`성공: [${tier}] 권한이 승인되었습니다!`);
                fetchUsers();
            } else {
                alert('승인 실패: ' + (data.error || '알 수 없는 오류'));
            }
        } catch (error) {
            alert('승인 처리 중 오류 발생');
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('정말로 이 가입자 정보를 삭제하시겠습니까?')) return;
        try {
            const response = await fetch('/api/admin/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (data.success) {
                alert('삭제되었습니다.');
                fetchUsers();
            } else {
                alert('삭제 실패: ' + data.error);
            }
        } catch (error) {
            alert('삭제 중 오류 발생');
        }
    };

    // Filtered Users
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchSearch = u.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                (u.phone_hash && u.phone_hash.includes(searchTerm));
            if (filterTier === 'ALL') return matchSearch;
            if (filterTier === 'ACTIVE') return matchSearch && u.is_active;
            if (filterTier === 'PENDING') return matchSearch && !u.is_active;
            if (filterTier === 'MICRO') return matchSearch && u.membership_tier?.includes('890');
            return matchSearch && u.membership_tier === filterTier;
        });
    }, [users, searchTerm, filterTier]);

    // Stats
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.is_active).length;
        const pending = users.filter(u => !u.is_active).length;
        const microCount = users.filter(u => u.membership_tier?.includes('890') || u.payment_amount === 890).length;
        return { total, active, pending, microCount };
    }, [users]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                    <MyeongsimSunLogo size={56} className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5 text-amber-400" /> 가입자 관리자 인증
                    </h1>
                    <p className="text-xs text-gray-400 mb-6">명심코칭 회원 현황 및 수다권 승인을 위한 대시보드입니다.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="관리자 보안 비밀번호 입력"
                            className="w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-center text-sm focus:outline-none focus:border-amber-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold rounded-xl shadow-lg transition-all"
                        >
                            관리자 대시보드 입장
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
            {/* Header Banner */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <MyeongsimSunLogo size={44} />
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-amber-400" /> 가입자 통합 관리 시스템
                        </h1>
                        <p className="text-xs text-gray-400">전체 회원 등급, 890원 수다권 충전, 프리미엄 승인 및 실시간 가입 현황</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 새로고침
                    </button>
                    <a
                        href="/admin"
                        className="px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1"
                    >
                        메인 관리자 <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 font-medium">전체 가입자</span>
                        <Users className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-black text-white">{stats.total} 명</p>
                </div>
                <div className="bg-slate-900/80 border border-green-500/30 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-green-300 font-medium">활성 회원</span>
                        <UserCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-black text-green-400">{stats.active} 명</p>
                </div>
                <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-amber-300 font-medium">승인 대기</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-black text-amber-300">{stats.pending} 명</p>
                </div>
                <div className="bg-slate-900/80 border border-yellow-500/30 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-yellow-300 font-medium">890원 수다 결제자</span>
                        <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-black text-yellow-300">{stats.microCount} 명</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto bg-slate-900/90 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="유저 ID 또는 전화번호 검색..."
                        className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                    {[
                        { key: 'ALL', label: '전체 보기' },
                        { key: 'ACTIVE', label: '🟢 활성 회원' },
                        { key: 'PENDING', label: '⏳ 승인 대기' },
                        { key: 'MICRO', label: '⚡ 890원 수다회원' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilterTier(f.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterTier === f.key ? 'bg-amber-500 text-black shadow-md' : 'bg-slate-800 text-gray-400 hover:text-white border border-white/5'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="max-w-7xl mx-auto bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/90 text-gray-300 border-b border-white/10 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4">가입자 식별 ID</th>
                                <th className="p-4">가입 일시</th>
                                <th className="p-4">현재 등급</th>
                                <th className="p-4">상태</th>
                                <th className="p-4">만료 예정일</th>
                                <th className="p-4 text-center">권한 승인 관리</th>
                                <th className="p-4 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        검색 조건에 일치하는 가입자가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u, idx) => {
                                    const displayName = u.phone_hash && u.phone_hash.length > 20
                                        ? `👤 가입자 #${idx + 1} (${u.phone_hash.slice(0, 8)})`
                                        : `👤 가입자 #${idx + 1} (${u.id.slice(0, 8)})`;

                                    return (
                                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                                                    <span>{displayName}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-2">
                                                    <span>ID: {u.id.slice(0, 13)}...</span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(u.id);
                                                            alert('가입자 ID가 클립보드에 복사되었습니다! 📋');
                                                        }}
                                                        className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[9px] text-amber-400 border border-amber-400/30 transition-all"
                                                        title="전체 ID 복사"
                                                    >
                                                        📋 복사
                                                    </button>
                                                </div>
                                            </td>
                                        <td className="p-4 text-gray-400">
                                            {u.created_at ? new Date(u.created_at).toLocaleString('ko-KR') : '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${u.membership_tier?.includes('890') ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : u.membership_tier === 'PREMIUM' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-gray-800 text-gray-400 border-white/10'}`}>
                                                {u.membership_tier || '무료체험'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {u.is_active ? (
                                                <span className="text-green-400 font-bold flex items-center gap-1">
                                                    🟢 활성
                                                </span>
                                            ) : (
                                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                                    ⏳ 승인대기
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-400 font-mono">
                                            {u.expires_at ? new Date(u.expires_at).toLocaleDateString('ko-KR') : '제한없음'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <select
                                                    value={selectedTiers[u.id] || u.membership_tier || '890원 수다 3회'}
                                                    onChange={(e) => setSelectedTiers({ ...selectedTiers, [u.id]: e.target.value })}
                                                    className="bg-slate-800 border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                                >
                                                    <option value="890원 수다 3회">⚡ 890원 수다 3회</option>
                                                    <option value="무료 체험 회원">🎁 무료 체험 회원</option>
                                                </select>
                                                <button
                                                    onClick={() => approveUser(u.id, selectedTiers[u.id] || '890원 수다 3회')}
                                                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all shadow-sm"
                                                >
                                                    승인
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => deleteUser(u.id)}
                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all"
                                                title="가입자 삭제"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

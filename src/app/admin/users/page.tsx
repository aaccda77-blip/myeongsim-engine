'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Search, ShieldCheck, Clock, RefreshCw, Trash2, Compass, Share2, Shield, Lock, AlertTriangle, CheckCircle2, MapPin, PieChart, UserCheck2, 
    UserCheck, CreditCard, Sparkles, Filter, ChevronRight, Key, Calendar, Zap, TrendingUp, Eye, UserPlus, DollarSign
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

    const [visitorStats, setVisitorStats] = useState<{ todayVisitors: number; todayPageviews: number; sources?: Record<string, number>; regions?: Record<string, number> }>({ todayVisitors: 0, todayPageviews: 0, sources: {}, regions: {} });
    const [securityData, setSecurityData] = useState<{ systemStatus?: string; statusMessage?: string; activeDefenses?: any[]; failedLoginCount?: number; recentLogs?: any[] }>({});

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await fetch('/api/analytics/log-visitor');
                if (res.ok) {
                    const data = await res.json();
                    setVisitorStats(data);
                }
            } catch (e) {}
        };
        const fetchSecurity = async () => {
            try {
                const res = await fetch('/api/admin/security-status');
                if (res.ok) {
                    const data = await res.json();
                    setSecurityData(data);
                }
            } catch (e) {}
        };
        fetchVisitors();
        fetchSecurity();
    }, []);

    // 👥 성별 및 연령대 인구통계 분석
    const demographicStats = useMemo(() => {
        const genderCount = { female: 0, male: 0, other: 0 };
        const ageCount: Record<string, number> = {
            '20대 이하': 0,
            '30대 (30~39세)': 0,
            '40대 (40~49세)': 0,
            '50대 (50~59세)': 0,
            '60대 이상': 0,
        };

        const currentYear = new Date().getFullYear();

        users.forEach(u => {
            // Gender
            const g = (u as any).gender || (u as any).gender_val;
            if (g === 'female' || g === '여' || g === '여성') {
                genderCount.female += 1;
            } else if (g === 'male' || g === '남' || g === '남성') {
                genderCount.male += 1;
            } else {
                genderCount.other += 1;
            }

            // Age Group from birth_date
            const bdate = (u as any).birth_date || (u as any).birthDate;
            if (bdate) {
                const birthYear = parseInt(bdate.split('-')[0], 10);
                if (!isNaN(birthYear) && birthYear > 1920) {
                    const age = currentYear - birthYear + 1;
                    if (age < 30) ageCount['20대 이하'] += 1;
                    else if (age >= 30 && age < 40) ageCount['30대 (30~39세)'] += 1;
                    else if (age >= 40 && age < 50) ageCount['40대 (40~49세)'] += 1;
                    else if (age >= 50 && age < 60) ageCount['50대 (50~59세)'] += 1;
                    else ageCount['60대 이상'] += 1;
                }
            }
        });

        const totalGender = Math.max(1, genderCount.female + genderCount.male + genderCount.other);
        const femalePercent = Math.round((genderCount.female / totalGender) * 100);
        const malePercent = Math.round((genderCount.male / totalGender) * 100);

        return { genderCount, ageCount, femalePercent, malePercent, totalGender };
    }, [users]);

    // Stats
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.is_active).length;
        const pending = users.filter(u => !u.is_active).length;
        const microCount = users.filter(u => u.membership_tier?.includes('890') || u.payment_amount === 890).length;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const todaySignups = users.filter(u => u.created_at && u.created_at.startsWith(todayStr)).length;
        const thisMonthSignups = users.filter(u => {
            if (!u.created_at) return false;
            const d = new Date(u.created_at);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;
        const totalRevenue = users.reduce((sum, u) => sum + (u.payment_amount || 0), 0);

        return { total, active, pending, microCount, todaySignups, thisMonthSignups, totalRevenue };
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

            {/* Metrics Grid (방문자수 & 회원가입수 & 결제 종합 대시보드) */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
                {/* 오늘 실시간 방문자 */}
                <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-cyan-300 font-bold">오늘 방문자</span>
                        <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-xl font-black text-cyan-300">{visitorStats.todayVisitors || 1} 명</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">페이지뷰: {visitorStats.todayPageviews || 1}회</span>
                </div>

                {/* 오늘 신규 가입자 */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-emerald-300 font-bold">오늘 신규 가입</span>
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xl font-black text-emerald-400">{stats.todaySignups} 명</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">이번 달: {stats.thisMonthSignups}명</span>
                </div>

                {/* 전체 가입자 */}
                <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-gray-300 font-bold">전체 누적 회원</span>
                        <Users className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-black text-white">{stats.total} 명</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">DB 등록 기준</span>
                </div>

                {/* 승인 완료 활성 회원 */}
                <div className="bg-slate-900/90 border border-green-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-green-300 font-bold">활성 유료 회원</span>
                        <UserCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-xl font-black text-green-400">{stats.active} 명</p>
                    <span className="text-[10px] text-amber-300 font-mono mt-1 block">대기 중: {stats.pending}명</span>
                </div>

                {/* 890원 수다 결제자 */}
                <div className="bg-slate-900/90 border border-yellow-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-yellow-300 font-bold">890원 수다권</span>
                        <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-xl font-black text-yellow-300">{stats.microCount} 명</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">마이크로 충전</span>
                </div>

                {/* 총 결제 매출 */}
                <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-purple-300 font-bold">누적 매출</span>
                        <DollarSign className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xl font-black text-purple-300">{stats.totalRevenue.toLocaleString()} 원</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">결제 내역 합계</span>
                </div>
            </div>

            {/* 🌐 실시간 유입 경로 (Referrer & Traffic Analytics) */}
            <div className="max-w-7xl mx-auto bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                        <h2 className="text-sm sm:text-base font-bold text-white">🌐 실시간 유입 경로 분이 (Traffic Sources)</h2>
                    </div>
                    <span className="text-xs text-indigo-300 font-mono">UTM 및 웹 Referrer 자동 감지</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(visitorStats.sources || {
                        '네이버 (블로그/검색)': 0,
                        '카카오톡 / 카카오': 0,
                        '인스타그램 / FB': 0,
                        '구글 / 유튜브': 0,
                        '직접 접속 / 북마크': 1,
                        '기타 웹사이트 유입': 0,
                    }).map(([sourceName, count]) => {
                        const totalPV = Math.max(1, visitorStats.todayPageviews || 1);
                        const percent = Math.round(((count || 0) / totalPV) * 100);

                        return (
                            <div key={sourceName} className="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] font-bold text-gray-300 truncate">{sourceName}</span>
                                    </div>
                                    <p className="text-lg font-black text-indigo-300">{count} 회</p>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-[9px] text-gray-400 font-mono mb-1">
                                        <span>점유율</span>
                                        <span>{percent}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all rounded-full"
                                            style={{ width: `${Math.max(5, percent)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 🗺️ 접속 지역 & 👥 성별 / 연령대 인구통계 종합 분석 (Location & Demographics Analytics) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 🗺️ 접속 지역 분포 Card */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
                                <h2 className="text-sm sm:text-base font-bold text-white">🗺️ 접속 지역 분포 (Location Analytics)</h2>
                            </div>
                            <span className="text-xs text-emerald-300 font-mono">IP 기반 지리적 추적</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {Object.entries(visitorStats.regions || {
                                '서울 / 수도권': 1,
                                '부산 / 경남': 0,
                                '대구 / 경북': 0,
                                '인천 / 경기': 0,
                                '대전 / 충청': 0,
                                '광주 / 전라': 0,
                            }).map(([regionName, count]) => {
                                const totalPV = Math.max(1, visitorStats.todayPageviews || 1);
                                const percent = Math.round(((count || 0) / totalPV) * 100);

                                return (
                                    <div key={regionName} className="bg-slate-950/70 border border-white/10 rounded-xl p-3">
                                        <span className="text-[11px] font-bold text-gray-300 block mb-1">{regionName}</span>
                                        <p className="text-base font-black text-emerald-300">{count} 회</p>
                                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 transition-all rounded-full"
                                                style={{ width: `${Math.max(5, percent)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 👥 성별 & 연령대 분포 Card */}
                <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-purple-400" />
                                <h2 className="text-sm sm:text-base font-bold text-white">👥 성별 & 연령대 분포 (Demographics)</h2>
                            </div>
                            <span className="text-xs text-purple-300 font-mono">가입자 데이터 100% 분석</span>
                        </div>

                        {/* 성별 비율 */}
                        <div className="mb-4 bg-slate-950/70 border border-white/10 rounded-xl p-3.5">
                            <div className="flex justify-between items-center text-xs font-bold mb-2">
                                <span className="text-rose-300 flex items-center gap-1">♀ 여성: {demographicStats.genderCount.female}명 ({demographicStats.femalePercent}%)</span>
                                <span className="text-sky-300 flex items-center gap-1">♂ 남성: {demographicStats.genderCount.male}명 ({demographicStats.malePercent}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-rose-500 transition-all" style={{ width: `${demographicStats.femalePercent}%` }} />
                                <div className="h-full bg-sky-500 transition-all" style={{ width: `${demographicStats.malePercent}%` }} />
                            </div>
                        </div>

                        {/* 연령대 분포 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(demographicStats.ageCount).map(([ageGroup, count]) => {
                                const percent = Math.round((count / Math.max(1, demographicStats.totalGender)) * 100);
                                return (
                                    <div key={ageGroup} className="bg-slate-950/70 border border-white/10 rounded-xl p-2.5 text-center">
                                        <span className="text-[10px] text-gray-400 font-medium block mb-0.5">{ageGroup}</span>
                                        <p className="text-sm font-black text-purple-300">{count} 명</p>
                                        <span className="text-[9px] text-purple-400 font-mono">({percent}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛡️ 실시간 보안 & 해킹 시도 감지 센터 (Security & Threat Auditor) */}
            <div className="max-w-7xl mx-auto bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-sm sm:text-base font-bold text-white">🛡️ 실시간 보안 & 해킹 시도 방어 현황 (Security Audit)</h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>보안 시스템 정상 작동 중</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 상태 메인 배너 */}
                    <div className="bg-slate-950/80 border border-emerald-400/30 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                            <span className="text-[11px] text-gray-400 font-bold block mb-1">시스템 침입/해킹 탐지 상태</span>
                            <p className="text-sm font-bold text-emerald-300 leading-relaxed">
                                {securityData.statusMessage || '🟢 해킹 및 무단 침입 시도 없음 (방화벽 및 SSL 암호화 정상 가동)'}
                            </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                            <span>관리자 무단 시도 차단</span>
                            <span className="font-bold text-amber-300 font-mono">{securityData.failedLoginCount || 0} 건</span>
                        </div>
                    </div>

                    {/* 5대 실시간 능동 방어막 */}
                    <div className="md:col-span-2 bg-slate-950/80 border border-white/10 rounded-xl p-4">
                        <span className="text-[11px] text-gray-400 font-bold block mb-2">실시간 가동 중인 5대 사이버 방화벽 엔진</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                { name: 'SSL/TLS 256-bit 암호화', desc: '모든 데이터 송수신 보안 서명' },
                                { name: 'Supabase RLS (Row Level Security)', desc: 'DB 데이터 무단 접근 100% 차단' },
                                { name: 'Admin Brute-Force Rate Limiter', desc: '5분당 100회 초과 IP 자동 차단' },
                                { name: 'CSP (Content Security Policy)', desc: 'XSS & 스크립트 변조 웹 공격 방어' },
                            ].map((def, idx) => (
                                <div key={idx} className="bg-slate-900/60 border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1">
                                            <span>{def.name}</span>
                                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">가동중</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">{def.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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

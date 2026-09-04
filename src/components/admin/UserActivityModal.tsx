'use client';

import React, { useState, useEffect } from 'react';
import { 
    X, Activity, Clock, CheckCircle2, AlertTriangle, Shield, 
    Lock, Unlock, RefreshCw, Smartphone, Headphones, Wind, Zap, 
    Star, BookOpen, Heart, ArrowUpRight, Filter
} from 'lucide-react';
import { ServerActivityLog } from '@/app/api/admin/user-activities/route';

interface UserActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName?: string;
    currentTier?: string;
    isActive?: boolean;
    onStatusChange?: () => void;
}

export default function UserActivityModal({
    isOpen,
    onClose,
    userId,
    userName = '회원',
    currentTier = 'GUEST',
    isActive = false,
    onStatusChange
}: UserActivityModalProps) {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<ServerActivityLog[]>([]);
    const [topActions, setTopActions] = useState<{ action: string; count: number }[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/user-activities?userId=${encodeURIComponent(userId)}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                setTopActions(data.topActions || []);
                setTotalCount(data.totalCount || 0);
            }
        } catch (e) {
            console.error('Failed to load user activities:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && userId) {
            fetchActivities();
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    // 관리자 승인 / 잠금 제어 핸들러
    const handleSetAccess = async (tier: 'MONTHLY_98K' | 'BOOK_ZERO_POINT' | 'LOCK') => {
        setIsUpdating(true);
        try {
            if (tier === 'LOCK') {
                // 잠금(닫기) 처리
                const res = await fetch('/api/admin/users/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, tier: 'GUEST', isActive: false })
                });
                if (res.ok) {
                    alert(`🔒 [${userName}] 님의 접근을 잠금(닫기) 처리했습니다.`);
                    if (onStatusChange) onStatusChange();
                }
            } else {
                // 열어주기(승인) 처리
                const res = await fetch('/api/admin/users/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, tier })
                });
                if (res.ok) {
                    const tierName = tier === 'MONTHLY_98K' ? '월정액 98,000원 ALL-PASS' : '도서 구매자 기본 제로포인트';
                    alert(`🟢 [${userName}] 님의 [${tierName}] 승인(열어주기)이 완료되었습니다!`);
                    if (onStatusChange) onStatusChange();
                }
            }
        } catch (e) {
            alert('상태 변경 중 오류가 발생했습니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'WATCH':
                return <Smartphone size={14} className="text-cyan-400" />;
            case 'SOUND':
                return <Headphones size={14} className="text-amber-400" />;
            case 'BREATH':
                return <Wind size={14} className="text-emerald-400" />;
            case 'BIO_CARE':
                return <Heart size={14} className="text-rose-400" />;
            default:
                return <Activity size={14} className="text-indigo-400" />;
        }
    };

    const formatTimestamp = (iso: string) => {
        try {
            const d = new Date(iso);
            return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        } catch {
            return iso;
        }
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
            <div className="relative w-full max-w-2xl bg-[#0d121f] border border-cyan-500/40 rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* 상단 헤더 & 원터치 제어 바 */}
                <div className="p-5 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                                <span>{userName}</span>
                                <span className="text-xs text-gray-400 font-mono font-normal">({userId})</span>
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                                {isActive ? '🟢 열림 (승인)' : '🔴 닫힘 (잠금)'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            현재 등급: <strong className="text-amber-300">{currentTier}</strong>
                        </p>
                    </div>

                    {/* 원터치 열어주기 & 닫기 제어 버튼 그룹 */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            onClick={() => handleSetAccess('MONTHLY_98K')}
                            disabled={isUpdating}
                            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Unlock size={12} />
                            <span>🟢 월정액 열어주기</span>
                        </button>

                        <button
                            onClick={() => handleSetAccess('BOOK_ZERO_POINT')}
                            disabled={isUpdating}
                            className="py-1.5 px-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <BookOpen size={12} />
                            <span>도서승인</span>
                        </button>

                        <button
                            onClick={() => handleSetAccess('LOCK')}
                            disabled={isUpdating}
                            className="py-1.5 px-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Lock size={12} />
                            <span>🔴 닫기(잠금)</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-all cursor-pointer ml-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* KPI 요약 바 (총 이용 횟수 & Top 3 기능) */}
                <div className="px-5 py-3 bg-black/40 border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-400 block font-mono">총 활동 횟수</span>
                        <span className="text-base font-black text-cyan-300 font-mono">{totalCount}회</span>
                    </div>

                    {topActions.length > 0 ? (
                        topActions.map((item, idx) => (
                            <div key={idx} className="p-2 bg-white/[0.02] rounded-xl border border-white/5 text-left">
                                <span className="text-[10px] text-amber-400 block font-mono font-bold">Top {idx + 1}</span>
                                <span className="text-[11px] font-bold text-gray-200 truncate block" title={item.action}>
                                    {item.action}
                                </span>
                                <span className="text-[9.5px] text-gray-400 font-mono">{item.count}회 실행</span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 p-2 bg-white/[0.02] rounded-xl border border-white/5 text-gray-500 text-[11px] flex items-center justify-center">
                            아직 누적된 활동 데이터가 없습니다.
                        </div>
                    )}
                </div>

                {/* 중앙 타임라인 컨텐츠 */}
                <div className="p-5 overflow-y-auto space-y-2.5 text-left flex-1">
                    <div className="flex items-center justify-between pb-1">
                        <h3 className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
                            <Clock size={13} className="text-cyan-400" />
                            <span>사용자 실시간 이용 타임라인</span>
                        </h3>
                        <button
                            onClick={fetchActivities}
                            className="text-[11px] text-gray-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                            <span>새로고침</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                            <RefreshCw size={20} className="animate-spin text-cyan-400" />
                            <span>이용 내역을 불러오는 중...</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-12 text-center bg-white/[0.02] rounded-2xl border border-white/5 space-y-2">
                            <Activity size={28} className="mx-auto text-gray-600" />
                            <p className="text-xs text-gray-300 font-bold">아직 기록된 활동이 없습니다.</p>
                            <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                                사용자가 워치 다이얼, 엠씨스퀘어 청취, 1:1 선언문 각인 등을 실행하면 실시간으로 여기에 시간대별로 기록됩니다.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex items-start justify-between gap-3"
                                >
                                    <div className="flex items-start gap-2.5">
                                        <div className="p-2 rounded-xl bg-black/60 border border-white/10 shrink-0 mt-0.5">
                                            {getCategoryIcon(log.category)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white block">
                                                {log.action}
                                            </span>
                                            {log.details && (
                                                <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                                                    {log.details}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono shrink-0 whitespace-nowrap pt-1">
                                        {formatTimestamp(log.timestamp)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 하단 푸터 */}
                <div className="p-3 bg-black/60 border-t border-white/10 text-center">
                    <span className="text-[10px] text-gray-500 font-mono">
                        상단 [월정액 열어주기] 또는 [닫기(잠금)] 버튼을 누르면 회원의 화면에 실시간으로 즉시 반영됩니다.
                    </span>
                </div>
            </div>
        </div>
    );
}

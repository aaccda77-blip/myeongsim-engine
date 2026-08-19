'use client';

import React, { useState } from 'react';
import { X, Eye, MapPin, User, Compass, Clock, FileText, Search, RefreshCw, ChevronRight, Activity, ShieldCheck, Tag } from 'lucide-react';
import { DetailedVisitorLog } from '@/app/api/analytics/log-visitor/route';

interface VisitorDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: DetailedVisitorLog[];
    todayVisitorsCount: number;
    todayPageviewsCount: number;
    onRefresh: () => void;
}

export default function VisitorDetailModal({
    isOpen,
    onClose,
    logs = [],
    todayVisitorsCount = 0,
    todayPageviewsCount = 0,
    onRefresh,
}: VisitorDetailModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'member' | 'guest'>('all');
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    if (!isOpen) return null;

    const filteredLogs = logs.filter(log => {
        const matchSearch =
            log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.pathname.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'member') return matchSearch && log.isMember;
        if (filterType === 'guest') return matchSearch && !log.isMember;
        return matchSearch;
    });

    const activeLog = logs.find(l => l.id === selectedLogId) || filteredLogs[0] || logs[0];

    const getSourceBadgeColor = (source: string) => {
        if (source.includes('네이버')) return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
        if (source.includes('카카오')) return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
        if (source.includes('인스타그램') || source.includes('FB')) return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
        if (source.includes('구글') || source.includes('유튜브')) return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
        return 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-5xl bg-zinc-950 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-950/80 rounded-xl border border-cyan-500/40 text-cyan-400">
                            <Eye className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-zinc-100 flex items-center gap-2">
                                오늘의 방문자 실시간 상세 모니터링
                                <span className="text-xs px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 font-mono">
                                    LIVE ANALYTICS
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                방문자의 회원 아이디, 접속 지역, 성별/연령대, 유입 매체 및 열람한 페이지 동선을 실시간 분석합니다.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                            title="새로고침"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">새로고침</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Top Summary KPI Cards */}
                <div className="px-6 py-4 bg-zinc-900/30 border-b border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-zinc-900/80 rounded-xl border border-cyan-500/20">
                        <span className="text-[11px] text-zinc-400 block font-medium">오늘 방문자 수</span>
                        <span className="text-lg font-black text-cyan-300">{todayVisitorsCount} 명</span>
                    </div>
                    <div className="p-3 bg-zinc-900/80 rounded-xl border border-cyan-500/20">
                        <span className="text-[11px] text-zinc-400 block font-medium">오늘 총 페이지뷰</span>
                        <span className="text-lg font-black text-cyan-400">{todayPageviewsCount} 회</span>
                    </div>
                    <div className="p-3 bg-zinc-900/80 rounded-xl border border-emerald-500/20">
                        <span className="text-[11px] text-zinc-400 block font-medium">회원 접속 비율</span>
                        <span className="text-lg font-black text-emerald-400">
                            {logs.length > 0 ? Math.round((logs.filter(l => l.isMember).length / logs.length) * 100) : 0}%
                        </span>
                    </div>
                    <div className="p-3 bg-zinc-900/80 rounded-xl border border-purple-500/20">
                        <span className="text-[11px] text-zinc-400 block font-medium">최신 동선 추적</span>
                        <span className="text-xs font-bold text-purple-300 truncate block mt-1">
                            {logs[0] ? `${logs[0].name} (${logs[0].pathname})` : '오늘 방문자 없음'}
                        </span>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="px-6 py-3 border-b border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                                filterType === 'all' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            전체 ({logs.length})
                        </button>
                        <button
                            onClick={() => setFilterType('member')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                                filterType === 'member' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            등록 회원만 ({logs.filter(l => l.isMember).length})
                        </button>
                        <button
                            onClick={() => setFilterType('guest')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                                filterType === 'guest' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            비회원 게스트 ({logs.filter(l => !l.isMember).length})
                        </button>
                    </div>

                    <div className="relative flex-1 max-w-xs">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="아이디, 지역, 매체, 페이지 검색..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
                        />
                    </div>
                </div>

                {/* Main Content Layout (Left List, Right Details) */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                    
                    {/* Left: Visitor List */}
                    <div className="md:col-span-5 overflow-y-auto max-h-[500px] md:max-h-full p-4 space-y-2.5">
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-16 text-zinc-500">
                                <div className="text-3xl mb-3">🌙</div>
                                <div className="text-sm font-semibold text-zinc-400">오늘 방문자 없음</div>
                                <div className="text-xs mt-1">실제 방문자가 접속하면 여기에 실시간으로 표시됩니다.</div>
                            </div>
                        ) : (
                            filteredLogs.map(log => {
                                const isSelected = log.id === activeLog?.id;
                                return (
                                    <div
                                        key={log.id}
                                        onClick={() => setSelectedLogId(log.id)}
                                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                            isSelected
                                                ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                                                : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${log.isMember ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`} />
                                                <span className="font-bold text-xs text-zinc-100 truncate max-w-[140px]">
                                                    {log.name}
                                                </span>
                                                {log.isMember && (
                                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                                                        회원
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-zinc-400 font-mono">{log.lastSeenAt}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700/60 flex items-center gap-1">
                                                <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                                                {log.region}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded border ${getSourceBadgeColor(log.source)}`}>
                                                {log.source}
                                            </span>
                                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700/60">
                                                {log.gender} · {log.ageGroup}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                                            <span className="truncate max-w-[180px] font-mono text-cyan-300/90">
                                                📄 {log.pathname}
                                            </span>
                                            <span className="font-bold text-zinc-300">
                                                {log.pageviewCount}회 열람
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Right: Detailed Deep Dive Drawer for Active Log */}
                    <div className="md:col-span-7 overflow-y-auto p-5 space-y-5 bg-zinc-950/80">
                        {activeLog ? (
                            <>
                                {/* Profile Card Header */}
                                <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-zinc-100">{activeLog.name}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                                                    activeLog.isMember 
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                }`}>
                                                    {activeLog.isMember ? '가입 회원' : '비회원 (게스트)'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400 font-mono">
                                                ID / Email: <span className="text-cyan-300 font-bold">{activeLog.email !== '이메일 없음' ? activeLog.email : activeLog.userId}</span>
                                            </p>
                                        </div>

                                        <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                                            IP: {activeLog.ip}
                                        </span>
                                    </div>

                                    {/* Grid of details */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/80 text-xs">
                                        <div className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800">
                                            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-cyan-400" /> 접속 지역
                                            </span>
                                            <span className="font-bold text-zinc-200">{activeLog.region}</span>
                                        </div>

                                        <div className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800">
                                            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
                                                <User className="w-3 h-3 text-purple-400" /> 성별 / 연령대
                                            </span>
                                            <span className="font-bold text-zinc-200">{activeLog.gender} / {activeLog.ageGroup}</span>
                                        </div>

                                        <div className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800">
                                            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
                                                <Compass className="w-3 h-3 text-amber-400" /> 유입 매체
                                            </span>
                                            <span className="font-bold text-amber-300 truncate block">{activeLog.source}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Page View Journey Timeline */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                            열람한 페이지 및 실시간 이동 동선 (총 {activeLog.pageviewCount}회)
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono">
                                            첫 접속: {activeLog.firstSeenAt}
                                        </span>
                                    </h4>

                                    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-4 space-y-3">
                                        {activeLog.pagesViewed.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-xs group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-[10px]">
                                                        {idx + 1}
                                                    </div>
                                                    {idx < activeLog.pagesViewed.length - 1 && (
                                                        <div className="w-0.5 h-6 bg-zinc-800 my-1" />
                                                    )}
                                                </div>

                                                <div className="flex-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 group-hover:border-cyan-500/40 transition">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono font-bold text-cyan-300 text-xs">
                                                            {item.path}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-zinc-600" />
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary Box */}
                                <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 leading-relaxed flex items-start gap-2.5">
                                    <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block mb-0.5">실시간 세션 요약 분석</span>
                                        이 방문자는 <strong>{activeLog.source}</strong>(으)로 유입되어 <strong>{activeLog.region}</strong>에서 접속하였습니다. 총 {activeLog.pageviewCount}개의 페이지를 탐색하였으며, 가장 최신 열람 페이지는 <code className="bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-200">{activeLog.pathname}</code> 입니다.
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-zinc-500 text-xs">
                                좌측 목록에서 상세 정보를 확인하고 싶은 방문자를 선택해 주세요.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        개인정보보호 및 실시간 위치/동선 보안 모니터링 적용 중
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

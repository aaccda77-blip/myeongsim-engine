'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, Search, ArrowLeft, CheckCircle2, AlertTriangle, FileText, 
    User, Calendar, Globe, Smartphone, Lock, Download, Copy, Check, ExternalLink, X, Scale,
    Ban, RefreshCw, AlertOctagon, CheckSquare
} from 'lucide-react';
import Link from 'next/link';

interface ForensicRecord {
    trackingCode: string;
    buyer: string;
    order: string;
    serial: string;
    ip: string;
    userAgent: string;
    timestamp: string;
    action: 'stream' | 'download';
}

interface BlockedOrderRecord {
    orderNumber: string;
    reason?: string;
    blockedAt: string;
}

export default function ForensicTracePage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ForensicRecord | null>(null);
    const [recentLogs, setRecentLogs] = useState<ForensicRecord[]>([]);
    const [blockedOrders, setBlockedOrders] = useState<BlockedOrderRecord[]>([]);
    const [searchError, setSearchError] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'download' | 'stream' | 'blocked'>('all');

    // 통계 수치
    const [stats, setStats] = useState({ total: 0, download: 0, stream: 0, blocked: 0 });

    // 네이버 환불 방어 증명서 모달
    const [evidenceModalData, setEvidenceModalData] = useState<ForensicRecord | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // 수동 차단 입력창
    const [manualBlockOrder, setManualBlockOrder] = useState('');
    const [manualBlockReason, setManualBlockReason] = useState('허위 주문번호 / 네이버 환불 취소 건');
    const [isProcessingBlock, setIsProcessingBlock] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/trace');
            const data = await res.json();
            if (data.success) {
                setRecentLogs(data.recentLogs || []);
                setBlockedOrders(data.blockedOrders || []);
                setStats({
                    total: data.totalRecords || 0,
                    download: data.downloadCount || 0,
                    stream: data.streamCount || 0,
                    blocked: data.blockedCount || (data.blockedOrders ? data.blockedOrders.length : 0),
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setSearchError('');
        setResult(null);

        try {
            const res = await fetch(`/api/admin/trace?code=${encodeURIComponent(query.trim())}`);
            const data = await res.json();
            if (data.success && data.result) {
                setResult(data.result);
            } else {
                setSearchError(data.message || '일치하는 포렌식 감사 기록을 찾을 수 없습니다.');
            }
        } catch (err: any) {
            setSearchError('조회 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 차단 여부 확인
    const isOrderCurrentlyBlocked = (orderNum: string) => {
        if (!orderNum) return false;
        return blockedOrders.some(b => b.orderNumber.toUpperCase() === orderNum.toUpperCase());
    };

    // 차단 / 해제 처리 핸들러
    const handleToggleBlock = async (orderNum: string, currentBlocked: boolean, reason?: string) => {
        const action = currentBlocked ? 'unblock' : 'block';
        const actionName = currentBlocked ? '차단 해제' : '이용 권한 즉시 차단/회수';
        
        if (!confirm(`주문번호 [${orderNum}] 건을 정말로 ${actionName}하시겠습니까?`)) {
            return;
        }

        setIsProcessingBlock(true);
        setActionMessage(null);

        try {
            const res = await fetch('/api/admin/trace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    orderNumber: orderNum,
                    reason: reason || manualBlockReason || '관리자 직권 조치',
                })
            });
            const data = await res.json();
            if (data.success) {
                setActionMessage({ type: 'success', text: data.message || `${actionName} 처리 완료!` });
                if (action === 'block') {
                    setManualBlockOrder('');
                }
                await fetchLogs();
            } else {
                setActionMessage({ type: 'error', text: data.message || '처리에 실패했습니다.' });
            }
        } catch (err: any) {
            setActionMessage({ type: 'error', text: '서버 통신 오류가 발생했습니다.' });
        } finally {
            setIsProcessingBlock(false);
            setTimeout(() => setActionMessage(null), 5000);
        }
    };

    const filteredLogs = recentLogs.filter(log => {
        if (activeFilter === 'download') return log.action === 'download';
        if (activeFilter === 'stream') return log.action === 'stream';
        if (activeFilter === 'blocked') return isOrderCurrentlyBlocked(log.order);
        return true;
    });

    // 네이버페이 분쟁조정 소명 텍스트 생성
    const getDefenseText = (item: ForensicRecord) => {
        return `[네이버페이 / 스마트스토어 반품·환불 거부 소명서]
■ 주문번호: ${item.order}
■ 구매자 성함: ${item.buyer}
■ 상품명: 《ZERO POINT》 309p 전자책 올인원 패키지 (디지털 콘텐츠)
■ 열람/다운로드 일시: ${new Date(item.timestamp).toLocaleString('ko-KR')}
■ 접속 IP: ${item.ip}
■ 이용 기기: ${item.userAgent}
■ 디지털 포렌식 식별코드: ${item.trackingCode}

[법적 근거 및 소명 내용]
본 상품은 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 규정된 디지털 콘텐츠 상품입니다.
상기 구매자는 상기 일시에 명심코칭 도서관에 접속하여 본인 전용 포렌식 워터마크가 각인된 완권 전자책을 기기로 성공적으로 열람/소장 완료하였음이 시스템 감사 로그를 통해 객관적으로 증명됩니다.

디지털 콘텐츠의 특성상 콘텐츠의 제공이 개시된 이후에는 단순 변심으로 인한 청약철회(환불)가 법적으로 엄격히 제한됩니다. 따라서 본 건은 환불 불가 건으로 정상 종결 처리를 요청드립니다.

- 청류출판사 (EDITIONS CHEONGRYU) 저작권 보안팀 드림 -`;
    };

    const handleCopyDefense = (item: ForensicRecord) => {
        navigator.clipboard.writeText(getDefenseText(item));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-[#090615] text-slate-100 p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* 상단 네비게이션 */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>관리자 메인 대시보드로 돌아가기</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[11px] text-emerald-400 font-bold">감사 추적기 & 환불 방어 실시간 가동 중</span>
                    </div>
                </div>

                {/* 알림 메시지 배너 */}
                {actionMessage && (
                    <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold transition-all ${
                        actionMessage.type === 'success' 
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                            : 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                    }`}>
                        {actionMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertOctagon size={16} />}
                        <span>{actionMessage.text}</span>
                    </div>
                )}

                {/* 헤더 섹션 */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181136] via-[#100b26] to-[#0a0618] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold">
                                <Shield size={13} />
                                <span>방식 1: 선 열람(1초 즉시 해금) + 실시간 원클릭 권한 차단 시스템</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                디지털 도서관 구매자 감사 & 실시간 차단 센터
                            </h1>
                            <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                                고객은 결제 즉시 1초 만에 전자책을 읽고, 관리자는 네이버페이/YES24 판매자센터와 대조하여 
                                <strong className="text-rose-400"> 가짜 주문번호나 환불 신청 건을 버튼 클릭 한 번으로 즉시 차단</strong>합니다.
                            </p>
                        </div>
                    </div>

                    {/* 실시간 4대 통계 카드 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[10px] text-gray-400">총 열람/접속 감사 로그</p>
                            <p className="text-xl font-black text-cyan-300 mt-1">{stats.total} <span className="text-xs font-normal text-gray-400">건</span></p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30">
                            <p className="text-[10px] text-amber-300 flex items-center gap-1 font-bold">
                                <Download size={11} />
                                <span>다운로드 완료 건</span>
                            </p>
                            <p className="text-xl font-black text-amber-300 mt-1">{stats.download} <span className="text-xs font-normal text-amber-300/70">건</span></p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/30">
                            <p className="text-[10px] text-purple-300">보안 스트리밍 열람 건</p>
                            <p className="text-xl font-black text-purple-300 mt-1">{stats.stream} <span className="text-xs font-normal text-purple-300/70">건</span></p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-400/30">
                            <p className="text-[10px] text-rose-300 flex items-center gap-1 font-bold">
                                <Ban size={11} />
                                <span>현재 차단(Revoked) 건</span>
                            </p>
                            <p className="text-xl font-black text-rose-400 mt-1">{stats.blocked} <span className="text-xs font-normal text-rose-300/70">건</span></p>
                        </div>
                    </div>
                </div>

                {/* 🚫 [수동 주문번호 즉시 차단 등록 바] 🌟 */}
                <div className="p-5 rounded-2xl bg-[#160e29] border border-rose-500/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                            <Ban size={14} />
                            <span>가짜 주문번호 / 취소·환불 고객 이용 권한 즉시 차단(Revoke)</span>
                        </div>
                        <span className="text-[10px] text-gray-400">차단 즉시 해당 고객의 도서관 화면이 자동 잠김 처리됩니다.</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={manualBlockOrder}
                            onChange={(e) => setManualBlockOrder(e.target.value)}
                            placeholder="차단할 주문번호 입력 (예: 20260904-12345678)"
                            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-black/50 border border-rose-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 font-mono"
                        />
                        <input
                            type="text"
                            value={manualBlockReason}
                            onChange={(e) => setManualBlockReason(e.target.value)}
                            placeholder="차단 사유 (예: 네이버페이 주문취소)"
                            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                            onClick={() => handleToggleBlock(manualBlockOrder, false, manualBlockReason)}
                            disabled={isProcessingBlock || !manualBlockOrder.trim()}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <Ban size={13} />
                            <span>즉시 차단 실행</span>
                        </button>
                    </div>
                </div>

                {/* 🔍 포렌식 감사 검색 영역 */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="포렌식 코드 (CR-XXXX) 또는 네이버 주문번호, 독자 성함으로 정밀 추적..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                        <span>역추적 검색</span>
                    </button>
                </form>

                {searchError && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle size={15} />
                        <span>{searchError}</span>
                    </div>
                )}

                {/* 🎯 검색된 단일 결과 상세 카드 */}
                {result && (
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181530] to-[#0f0c22] border-2 border-cyan-400/50 shadow-2xl space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                                    <CheckCircle2 size={18} />
                                </span>
                                <div>
                                    <h3 className="font-bold text-sm text-white">포렌식 역추적 식별 성공</h3>
                                    <p className="text-[11px] text-cyan-300 font-mono mt-0.5">식별 코드: {result.trackingCode}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* 원클릭 차단/해제 버튼 */}
                                <button
                                    onClick={() => handleToggleBlock(result.order, isOrderCurrentlyBlocked(result.order))}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                        isOrderCurrentlyBlocked(result.order)
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500/30'
                                    }`}
                                >
                                    {isOrderCurrentlyBlocked(result.order) ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                                    <span>{isOrderCurrentlyBlocked(result.order) ? '✅ 차단 해제' : '🚫 이용 권한 차단'}</span>
                                </button>
                                {/* 네이버 환불 방어 증빙서 버튼 */}
                                <button
                                    onClick={() => setEvidenceModalData(result)}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                                >
                                    <Scale size={13} />
                                    <span>네이버 환불 방어 증명서</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <User size={13} className="text-cyan-400" />
                                    <span>구매 독자 성함</span>
                                </p>
                                <p className="text-base font-bold text-white">{result.buyer}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <FileText size={13} className="text-amber-400" />
                                    <span>네이버 스마트스토어 주문번호</span>
                                </p>
                                <p className="text-base font-mono font-bold text-amber-300 flex items-center gap-2">
                                    <span>{result.order}</span>
                                    {isOrderCurrentlyBlocked(result.order) && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/40">차단됨</span>
                                    )}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Calendar size={13} className="text-indigo-400" />
                                    <span>이용 일시</span>
                                </p>
                                <p className="text-sm font-mono text-gray-200">
                                    {new Date(result.timestamp).toLocaleString('ko-KR')} ({result.action === 'download' ? '📥 파일 다운로드' : '👁️ 스트리밍 열람'})
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Globe size={13} className="text-emerald-400" />
                                    <span>접속 IP 주소</span>
                                </p>
                                <p className="text-sm font-mono text-emerald-300">{result.ip}</p>
                            </div>

                            <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Smartphone size={13} className="text-purple-400" />
                                    <span>이용 기기 (User-Agent)</span>
                                </p>
                                <p className="text-xs font-mono text-gray-300 break-all">{result.userAgent}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 📋 최근 감사 로그 리스트 (필터 탭 포함) */}
                <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'bg-white/5 text-gray-400'}`}
                            >
                                전체 기록 ({recentLogs.length})
                            </button>
                            <button
                                onClick={() => setActiveFilter('download')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${activeFilter === 'download' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-white/5 text-gray-400'}`}
                            >
                                <Download size={12} />
                                <span>📥 다운로드 완료 ({stats.download})</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('stream')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFilter === 'stream' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' : 'bg-white/5 text-gray-400'}`}
                            >
                                <span>👁️ 스트리밍 ({stats.stream})</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('blocked')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${activeFilter === 'blocked' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40' : 'bg-white/5 text-gray-400'}`}
                            >
                                <Ban size={12} />
                                <span>🚫 차단된 고객 ({stats.blocked})</span>
                            </button>
                        </div>

                        <button
                            onClick={fetchLogs}
                            className="text-xs text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                            <RefreshCw size={12} />
                            <span>새로고침</span>
                        </button>
                    </div>

                    {filteredLogs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                            해당 필터 조건의 포렌식 감사 기록이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredLogs.map((log, idx) => {
                                const isBlocked = isOrderCurrentlyBlocked(log.order);
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
                                            isBlocked 
                                                ? 'bg-rose-950/20 border-rose-500/30' 
                                                : 'bg-white/5 hover:bg-white/10 border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                                                isBlocked
                                                    ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                                                    : log.action === 'download' 
                                                        ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40' 
                                                        : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                                            }`}>
                                                {isBlocked ? '🚫 권한 차단됨' : (log.action === 'download' ? '📥 PDF 다운로드' : '👁️ 스트리밍 열람')}
                                            </span>
                                            <div>
                                                <p className="font-bold text-white flex items-center gap-2">
                                                    <span>{log.buyer}</span>
                                                    <span className="text-gray-400 font-mono text-[11px]">({log.order})</span>
                                                </p>
                                                <p className="text-[10px] font-mono text-cyan-300 mt-0.5">
                                                    포렌식 코드: {log.trackingCode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 text-right">
                                            <div className="text-[11px] text-gray-400 font-mono hidden sm:block">
                                                <p>{new Date(log.timestamp).toLocaleString('ko-KR')}</p>
                                                <p className="text-[10px] text-emerald-400">{log.ip}</p>
                                            </div>

                                            {/* 🚫 원클릭 즉시 차단 / 해제 버튼 🌟 */}
                                            <button
                                                onClick={() => handleToggleBlock(log.order, isBlocked)}
                                                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                                    isBlocked
                                                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300'
                                                        : 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300'
                                                }`}
                                                title={isBlocked ? '차단 해제하기' : '허위/환불 고객 즉시 차단'}
                                            >
                                                {isBlocked ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                                                <span>{isBlocked ? '차단해제' : '차단하기'}</span>
                                            </button>

                                            {/* 환불 방어 증거 버튼 */}
                                            <button
                                                onClick={() => setEvidenceModalData(log)}
                                                className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                                title="네이버 환불 방어 증명서 발급"
                                            >
                                                <Scale size={12} />
                                                <span>소명서</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ⚖️ [네이버 스마트스토어 환불 방어 증명서 팝업 모달] 🌟 */}
            {evidenceModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
                    <div className="w-full max-w-xl bg-[#0f0b24] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left relative overflow-hidden">
                        {/* 상단 닫기 */}
                        <div className="flex items-start justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2 text-amber-300 font-black text-base">
                                <Scale size={20} />
                                <span>네이버 스마트스토어 분쟁조정용 공식 소명서</span>
                            </div>
                            <button
                                onClick={() => setEvidenceModalData(null)}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* 소명 공문서 카드 */}
                        <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/30 font-mono text-[11px] text-gray-200 space-y-2 whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto">
                            {getDefenseText(evidenceModalData)}
                        </div>

                        {/* 버튼 영역 */}
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => handleCopyDefense(evidenceModalData)}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
                            >
                                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                <span>{isCopied ? '소명서 복사 완료! (네이버 톡톡/분쟁센터에 붙여넣기)' : '📋 네이버페이 답변용 소명문 복사하기'}</span>
                            </button>
                            <button
                                onClick={() => setEvidenceModalData(null)}
                                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

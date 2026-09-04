'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, Search, ArrowLeft, CheckCircle2, AlertTriangle, FileText, 
    User, Calendar, Globe, Smartphone, Lock, Download, Copy, Check, ExternalLink, X, Scale
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

export default function ForensicTracePage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ForensicRecord | null>(null);
    const [recentLogs, setRecentLogs] = useState<ForensicRecord[]>([]);
    const [searchError, setSearchError] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'download' | 'stream'>('all');

    // 통계 수치
    const [stats, setStats] = useState({ total: 0, download: 0, stream: 0 });

    // 네이버 환불 방어 증명서 모달
    const [evidenceModalData, setEvidenceModalData] = useState<ForensicRecord | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/trace');
            const data = await res.json();
            if (data.success) {
                setRecentLogs(data.recentLogs || []);
                setStats({
                    total: data.totalRecords || 0,
                    download: data.downloadCount || 0,
                    stream: data.streamCount || 0,
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

    const filteredLogs = recentLogs.filter(log => {
        if (activeFilter === 'download') return log.action === 'download';
        if (activeFilter === 'stream') return log.action === 'stream';
        return true;
    });

    // 네이버페이 분쟁조정 소명 텍스트 생성
    const getDefenseText = (item: ForensicRecord) => {
        return `[네이버페이 / 스마트스토어 반품·환불 거부 소명서]
■ 주문번호: ${item.order}
■ 구매자 성함: ${item.buyer}
■ 상품명: 《ZERO POINT》 309p 전자책 올인원 패키지 (디지털 콘텐츠)
■ 다운로드 일시: ${new Date(item.timestamp).toLocaleString('ko-KR')}
■ 접속 IP: ${item.ip}
■ 이용 기기: ${item.userAgent}
■ 디지털 포렌식 식별코드: ${item.trackingCode}

[법적 근거 및 소명 내용]
본 상품은 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 규정된 디지털 콘텐츠 상품입니다.
상기 구매자는 상기 일시에 명심코칭 도서관에 접속하여 본인 전용 포렌식 워터마크가 각인된 완권 PDF 파일을 기기로 성공적으로 다운로드 및 열람 완료하였음이 시스템 감사 로그를 통해 객관적으로 증명됩니다.

디지털 콘텐츠의 특성상 파일이 기기에 다운로드되어 제공이 개시된 이후에는 단순 변심으로 인한 청약철회(환불)가 법적으로 엄격히 제한됩니다. 따라서 본 건은 환불 불가 건으로 정상 종결 처리를 요청드립니다.

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
                        <span>관리자 대시보드로 돌아가기</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 font-mono">
                        <Lock size={12} />
                        <span>청류출판사 DRM 2.0 포렌식 & 환불 방어 센터</span>
                    </div>
                </div>

                {/* 헤더 */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                <span>실시간 다운로드 감사 추적 & 네이버 환불 방어기</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-normal">
                                    REFUND DEFENSE
                                </span>
                            </h1>
                            <p className="text-xs text-gray-400">
                                고객이 <strong className="text-amber-300">"실제 파일을 다운로드했는지"</strong> 정확한 시각과 IP를 추적하여, 악성 환불 요구 시 <strong className="text-cyan-300">네이버페이 100% 방어용 법적 증빙서</strong>를 즉시 발급합니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3대 핵심 감사 통계 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[#140d2b] border border-cyan-500/30">
                        <p className="text-xs text-gray-400 font-medium">총 누적 포렌식 감사 기록</p>
                        <p className="text-2xl font-black text-cyan-300 mt-1">{stats.total} 건</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">실시간 감사 추적 중</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1b1130] border-2 border-amber-400/40 shadow-lg shadow-amber-500/10">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-amber-300 font-bold flex items-center gap-1">
                                <Download size={13} />
                                <span>📥 실제 PDF 다운로드 완료</span>
                            </p>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                                환불 불가 확정
                            </span>
                        </div>
                        <p className="text-2xl font-black text-amber-300 mt-1">{stats.download} 명</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">파일 소장 완료 (전자상거래법 제17조 적용)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#140d2b] border border-purple-500/30">
                        <p className="text-xs text-purple-300 font-medium">👁️ 스트리밍 웹 열람</p>
                        <p className="text-2xl font-black text-purple-300 mt-1">{stats.stream} 건</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">도서관 브라우저 열람</p>
                    </div>
                </div>

                {/* 검색 바 */}
                <form onSubmit={handleSearch} className="relative">
                    <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#150f2a] border-2 border-cyan-500/40 shadow-xl">
                        <Search size={20} className="text-cyan-400 ml-3 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="고객 성함, 스마트스토어 주문번호(예: 20260904-...), 또는 포렌식 코드 입력..."
                            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none px-2 font-mono"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? '조회 중...' : '감사 기록 조회 ➔'}
                        </button>
                    </div>
                </form>

                {/* 검색 에러 메시지 */}
                {searchError && (
                    <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                        <AlertTriangle size={16} className="shrink-0 text-red-400" />
                        <span>{searchError}</span>
                    </div>
                )}

                {/* 🎯 개별 검색 결과 카드 */}
                {result && (
                    <div className="rounded-3xl bg-gradient-to-b from-[#181135] to-[#100b24] border-2 border-amber-400/60 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="font-bold text-sm">
                                    {result.action === 'download' 
                                        ? '📥 PDF 파일 다운로드 완료 확인 (환불 불가 증거 확보)' 
                                        : '👁️ 스트리밍 열람 기록 확인'}
                                </span>
                            </div>
                            <button
                                onClick={() => setEvidenceModalData(result)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                            >
                                <Scale size={13} />
                                <span>⚖️ 네이버 환불 방어 증명서 발급</span>
                            </button>
                        </div>

                        {/* 상세 그리드 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <User size={13} className="text-cyan-400" />
                                    <span>구매자 성함</span>
                                </p>
                                <p className="text-base font-bold text-white">{result.buyer}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <FileText size={13} className="text-amber-400" />
                                    <span>네이버 스마트스토어 주문번호</span>
                                </p>
                                <p className="text-base font-mono font-bold text-amber-300">{result.order}</p>
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
                                <span>📥 다운로드 완료 건만 ({stats.download})</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('stream')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFilter === 'stream' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' : 'bg-white/5 text-gray-400'}`}
                            >
                                <span>👁️ 스트리밍만 ({stats.stream})</span>
                            </button>
                        </div>

                        <button
                            onClick={fetchLogs}
                            className="text-xs text-cyan-400 hover:underline cursor-pointer"
                        >
                            새로고침
                        </button>
                    </div>

                    {filteredLogs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                            해당 필터 조건의 포렌식 감사 기록이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredLogs.map((log, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${log.action === 'download' ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 animate-pulse' : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'}`}>
                                            {log.action === 'download' ? '📥 PDF 다운로드 완료' : '👁️ 스트리밍 열람'}
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

                                    <div className="flex items-center gap-3 text-right">
                                        <div className="text-[11px] text-gray-400 font-mono">
                                            <p>{new Date(log.timestamp).toLocaleString('ko-KR')}</p>
                                            <p className="text-[10px] text-emerald-400">{log.ip}</p>
                                        </div>
                                        {/* 환불 방어 증거 버튼 */}
                                        <button
                                            onClick={() => setEvidenceModalData(log)}
                                            className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                            title="네이버 환불 방어 증명서 발급"
                                        >
                                            <Scale size={12} />
                                            <span>환불방어 증빙</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
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

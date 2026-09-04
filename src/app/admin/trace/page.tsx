'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Search, ArrowLeft, CheckCircle2, AlertTriangle, FileText, User, Calendar, Globe, Smartphone, Lock } from 'lucide-react';
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

    const fetchRecentLogs = async () => {
        try {
            const res = await fetch('/api/admin/trace');
            const data = await res.json();
            if (data.success && data.recentLogs) {
                setRecentLogs(data.recentLogs);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchRecentLogs();
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
                setSearchError(data.message || '일치하는 포렌식 추적 기록을 찾을 수 없습니다.');
            }
        } catch (err: any) {
            setSearchError('조회 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090615] text-slate-100 p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
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
                        <span>청류출판사 DRM 2.0 포렌식 보안 센터</span>
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
                                <span>불법 유출자 디지털 포렌식 역추적기</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-normal">
                                    LIVE TRACE
                                </span>
                            </h1>
                            <p className="text-xs text-gray-400">
                                유출된 PDF 또는 스크린샷에 찍힌 <strong className="text-amber-300">[포렌식 추적 코드]</strong> 또는 <strong className="text-cyan-300">[주문번호]</strong>를 입력하면 다운로드한 구매자의 신원을 1초 만에 특정합니다.
                            </p>
                        </div>
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
                            placeholder="포렌식 추적 코드(예: CR-B2B4-3ED2-B99A) 또는 주문번호/구매자명 입력..."
                            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none px-2 font-mono"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? '추적 중...' : '역추적 실행 ➔'}
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

                {/* 🎯 역추적 결과 카드 */}
                {result && (
                    <div className="rounded-3xl bg-gradient-to-b from-[#181135] to-[#100b24] border-2 border-amber-400/50 p-6 space-y-6 shadow-2xl animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="font-bold text-sm">유출자 신원 식별 완료 (100% 매칭)</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">
                                감사 기록 ID: {result.trackingCode}
                            </span>
                        </div>

                        {/* 상세 정보 그리드 */}
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
                                    <span>다운로드/열람 일시</span>
                                </p>
                                <p className="text-sm font-mono text-gray-200">
                                    {new Date(result.timestamp).toLocaleString('ko-KR')} ({result.action === 'download' ? '📥 파일 다운로드' : '👁️ 스트리밍 열람'})
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Globe size={13} className="text-emerald-400" />
                                    <span>다운로드 접속 IP 주소</span>
                                </p>
                                <p className="text-sm font-mono text-emerald-300">{result.ip}</p>
                            </div>

                            <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <p className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Smartphone size={13} className="text-purple-400" />
                                    <span>다운로드 기기 (User-Agent)</span>
                                </p>
                                <p className="text-xs font-mono text-gray-300 break-all">{result.userAgent}</p>
                            </div>
                        </div>

                        {/* 법적 대응 안내 박스 */}
                        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 space-y-2">
                            <p className="font-bold flex items-center gap-1.5 text-red-300">
                                <span>⚖️ 저작권법 제136조 위반 형사고발 증빙 자료 안내</span>
                            </p>
                            <p className="leading-relaxed text-[11px] text-gray-300">
                                상기 구매자는 도서 《ZERO POINT》 정품 구매 당시 고유 포렌식 워터마크가 각인된 파일을 다운로드하였으며, 해당 파일이 외부에 무단 배포된 경우 저작권법 제136조(5년 이하의 징역 또는 5천만원 이하의 벌금)에 따라 형사 고소 및 손해배상 청구의 명백한 피의자로 특정됩니다.
                            </p>
                        </div>
                    </div>
                )}

                {/* 최근 포렌식 발급 기록 목록 */}
                <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <span>📋 최근 발급된 포렌식 감사 로그 ({recentLogs.length}건)</span>
                        </h2>
                        <button
                            onClick={fetchRecentLogs}
                            className="text-xs text-cyan-400 hover:underline"
                        >
                            새로고침
                        </button>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                            아직 발급된 다운로드 포렌식 감사 로그가 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentLogs.slice(0, 15).map((log, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setQuery(log.trackingCode);
                                        setResult(log);
                                    }}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.action === 'download' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'}`}>
                                            {log.action === 'download' ? '📥 소장 다운로드' : '👁️ 스트림'}
                                        </span>
                                        <div>
                                            <p className="font-bold text-white">
                                                {log.buyer} <span className="text-gray-400 font-normal">({log.order})</span>
                                            </p>
                                            <p className="text-[10px] font-mono text-cyan-300">{log.trackingCode}</p>
                                        </div>
                                    </div>

                                    <div className="text-right text-[11px] text-gray-400 font-mono">
                                        <p>{new Date(log.timestamp).toLocaleTimeString('ko-KR')}</p>
                                        <p className="text-[10px] text-gray-500">{log.ip}</p>
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

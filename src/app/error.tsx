'use client';
 
import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCcw, Trash2, Home, Sparkles } from 'lucide-react';
 
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isChunkError, setIsChunkError] = useState(false);

    useEffect(() => {
        console.error('Global Error specific:', error);
        
        const msg = error?.message || '';
        const isChunk = msg.includes('Failed to load chunk') || 
                        msg.includes('ChunkLoadError') || 
                        msg.includes('Loading chunk') || 
                        msg.includes('Loading CSS chunk');

        if (isChunk) {
            setIsChunkError(true);
            // 실서버 새 버전 배포로 인한 청크 해시 변경 -> 즉시 1회 자동 새로고침으로 최신 번들 다운로드
            if (typeof window !== 'undefined') {
                const reloadKey = 'myeongsim_chunk_reload_attempt';
                const attempt = Number(sessionStorage.getItem(reloadKey) || '0');
                if (attempt < 2) {
                    sessionStorage.setItem(reloadKey, String(attempt + 1));
                    window.location.reload();
                }
            }
        }
    }, [error]);
 
    const handleRetry = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('myeongsim_chunk_reload_attempt');
            window.location.reload();
        } else {
            reset();
        }
    };

    const handleHardReset = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('myeongsim_chunk_reload_attempt');
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
    };
 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans select-none">
            <div className="bg-gray-900/90 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    {isChunkError ? (
                        <Sparkles size={32} className="text-amber-400 animate-pulse" />
                    ) : (
                        <AlertTriangle size={32} className="text-red-500" />
                    )}
                </div>
 
                <h2 className="text-xl font-bold mb-2 text-white">
                    {isChunkError ? '✨ 새 버전이 업데이트되었습니다' : '시스템 오류가 발생했습니다'}
                </h2>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed break-keep">
                    {isChunkError ? (
                        <>
                            명심코칭 서비스가 최신 버전으로 업데이트되었습니다.<br />
                            아래 <strong className="text-amber-300 underline underline-offset-4">최신 버전으로 새로고침</strong> 버튼을 누르시면 즉시 정상 이용하실 수 있습니다.
                        </>
                    ) : (
                        <>
                            죄송합니다. 앱 실행 중 예기치 못한 문제가 발생했습니다.<br />
                            <span className="text-xs text-gray-500 font-mono mt-1 block">({error.message || 'Unknown Context'})</span>
                        </>
                    )}
                </p>
 
                <div className="space-y-3">
                    <button
                        onClick={handleRetry}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
                    >
                        <RefreshCcw size={18} />
                        <span>{isChunkError ? '최신 버전으로 새로고침' : '다시 시도하기'}</span>
                    </button>
 
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                sessionStorage.removeItem('myeongsim_chunk_reload_attempt');
                                window.location.href = '/';
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors border border-white/10 text-sm cursor-pointer"
                    >
                        <Home size={18} />
                        <span>메인페이지로 이동</span>
                    </button>
 
                    <button
                        onClick={handleHardReset}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-900/20 text-red-400 hover:text-red-300 font-medium rounded-xl border border-red-500/20 hover:bg-red-900/30 transition-colors text-xs cursor-pointer"
                    >
                        <Trash2 size={16} />
                        <span>데이터 초기화 및 재시작</span>
                    </button>
                </div>
 
                <p className="text-xs text-gray-500 mt-5">
                    * 최신 버전 반영을 위해 브라우저 새로고침을 진행해 주세요.
                </p>
            </div>
        </div>
    );
}

'use client';
 
import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Trash2, Home } from 'lucide-react';
 
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error specific:', error);
    }, [error]);
 
    const handleHardReset = () => {
        // 1. Clear all local storage (corrupted state)
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            // Clear cookies if possible (optional)
        }
        // 2. Force reload
        window.location.href = '/';
    };
 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>
 
                <h2 className="text-xl font-bold mb-2">시스템 오류가 발생했습니다</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    죄송합니다. 앱 실행 중 예기치 못한 문제가 발생했습니다.<br />
                    (Error: {error.message || 'Unknown Context'})
                </p>
 
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCcw size={18} />
                        다시 시도하기
                    </button>
 
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors border border-white/10"
                    >
                        <Home size={18} />
                        메인페이지로 이동
                    </button>
 
                    <button
                        onClick={handleHardReset}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/30 text-red-400 font-medium rounded-xl border border-red-500/30 hover:bg-red-900/50 transition-colors"
                    >
                        <Trash2 size={18} />
                        데이터 초기화 및 재시작
                    </button>
                </div>
 
                <p className="text-xs text-gray-600 mt-6">
                    * '다시 시도'로 해결되지 않으면 '데이터 초기화'를 눌러주세요.
                </p>
            </div>
        </div>
    );
}

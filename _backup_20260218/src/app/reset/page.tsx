'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPage() {
    const router = useRouter();
    const [status, setStatus] = useState('initializing');

    useEffect(() => {
        const cleanup = async () => {
            try {
                setStatus('cleaning');
                // 1. Clear Local Storage
                if (typeof window !== 'undefined') {
                    console.log('Clearing Local Storage...');
                    localStorage.clear();
                    sessionStorage.clear();

                    // Optional: Clear specific cookies if needed (client-side only for non-httpOnly)
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                }

                // Simulate delay for visual feedback
                await new Promise(resolve => setTimeout(resolve, 1500));
                setStatus('complete');

                // 2. Redirect to Home
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (e) {
                console.error('Reset failed:', e);
                setStatus('error');
            }
        };

        cleanup();
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">

                {status === 'cleaning' && (
                    <>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Trash2 size={32} className="text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">데이터 정리 중...</h2>
                        <p className="text-gray-400 text-sm">오류를 해결하기 위해 저장된 데이터를<br />깨끗이 지우고 있습니다.</p>
                    </>
                )}

                {status === 'complete' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">초기화 완료!</h2>
                        <p className="text-gray-400 text-sm">잠시 후 메인 화면으로 이동합니다.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-xl font-bold mb-2 text-red-500">초기화 실패</h2>
                        <p className="text-gray-400 text-sm">수동으로 브라우저 캐시를 삭제해주세요.</p>
                    </>
                )}
            </div>
        </div>
    );
}

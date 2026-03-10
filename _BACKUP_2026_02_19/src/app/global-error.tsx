'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Critical Root Error:', error);
    }, [error]);

    return (
        <html>
            <body className="bg-black text-white flex items-center justify-center min-h-screen">
                <div className="text-center p-8 max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">치명적인 오류 발생</h2>
                    <p className="text-gray-400 mb-8">앱을 불러오는 데 실패했습니다.</p>
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location.href = '/';
                            }
                        }}
                        className="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors"
                    >
                        앱 초기화 및 재시작
                    </button>
                </div>
            </body>
        </html>
    );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthCodeError() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">로그인 오류</h1>
            <p className="text-gray-400 mb-8 max-w-sm">
                인증 코드가 만료되었거나 이미 사용되었습니다.<br />
                다시 로그인을 시도해주세요.
            </p>

            <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#050B14] font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                로그인 페이지로 돌아가기
            </button>
        </div>
    );
}

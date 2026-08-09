'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * CAFE 알고리즘 데모 페이지 완전 삭제 처리
 * /master-core/cafe 접근 시 /master-core로 즉시 리다이렉트
 */
export default function CafeDemoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/master-core');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070A12] text-gray-400">
      <p className="text-xs font-mono animate-pulse">이동 중...</p>
    </div>
  );
}

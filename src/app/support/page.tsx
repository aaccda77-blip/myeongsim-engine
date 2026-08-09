'use client';

import React from 'react';
import SupportInquiryModal from '@/components/modals/SupportInquiryModal';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-0 sm:p-4">
            <SupportInquiryModal
                isOpen={true}
                onClose={() => {
                    if (typeof window !== 'undefined' && window.history.length > 1) {
                        router.back();
                    } else {
                        window.location.href = '/report';
                    }
                }}
            />
        </div>
    );
}

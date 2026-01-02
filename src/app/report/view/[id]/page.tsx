'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MindTotemInteractiveView from '@/components/report/MindTotemInteractiveView';
import { Loader2 } from 'lucide-react';

export default function ReportViewPage({ params }: { params: { id: string } }) {
    const [reportData, setReportData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // [Data Strategy] Load data from LocalStorage using Key (id or generic)
        const storedData = localStorage.getItem('mind_totem_report_data');
        if (!storedData) {
            router.push('/'); // No data found, redirect to home
            return;
        }

        try {
            const parsed = JSON.parse(storedData);
            setReportData(parsed);
        } catch (e) {
            console.error("Failed to parse report data", e);
            router.push('/');
        }
    }, [router]);

    if (!reportData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary-olive mb-4" />
                <p className="font-serif animate-pulse opacity-70">영혼의 기록을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black overflow-hidden relative">
            {/* Background Texture - Paper/Starry mix */}
            <div className="absolute inset-0 bg-[#0a0a0a] opacity-90 z-0 pointer-events-none" />
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("/assets/noise.png")' }} />

            <div className="relative z-10 w-full h-full">
                <MindTotemInteractiveView data={reportData} />
            </div>
        </main>
    );
}

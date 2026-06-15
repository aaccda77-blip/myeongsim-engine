'use client';

import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import MultiDimensionalBlueprint from '@/components/chat/MultiDimensionalBlueprint'; // New Module

export default function SajuPaljaView() {
    const { reportData, nextStep } = useReportStore();

    // In a real scenario, map reportData (Saju Pillars) to the MultiDimensionalBlueprint CodeData format here.
    // For now, we use the fallback/mock inside the component if data is not explicitly shaped yet.
    // The visual transformation is what matters for the demo.

    return (
        <div className="w-full min-h-full flex flex-col p-4 md:p-8 relative overflow-hidden bg-[#0a0f18] justify-center items-center">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-primary-olive/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full"
            >
                {/* 
                 * 우리가 방금 만든 '다차원 기질 설계도' 컴포넌트를 이 뷰에 렌더링합니다.
                 * 기존 4개의 기둥 카드 대신 이 통합된 인터랙티브 뷰를 보여줍니다. 
                 */}
                <MultiDimensionalBlueprint 
                    showActionButton={true}
                    onActionClick={nextStep}
                />
            </motion.div>
        </div>
    );
}

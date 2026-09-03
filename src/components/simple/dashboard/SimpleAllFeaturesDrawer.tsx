'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, ExternalLink, Shield, Sparkles, BookOpen, User, Briefcase, Activity, Heart, HelpCircle } from 'lucide-react';

interface SimpleAllFeaturesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectReport: () => void;
}

export function SimpleAllFeaturesDrawer({
    isOpen,
    onClose,
    onSelectReport
}: SimpleAllFeaturesDrawerProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const sections = [
        {
            category: '나를 이해하기',
            items: [
                { title: '나의 리포트 (기질·성격 분석)', desc: '14단계 입체 기질 진단서', action: () => { onClose(); onSelectReport(); } },
                { title: '바이오-싱크 (생체 동기화)', desc: '실시간 심박/스트레스 관리', action: () => { onClose(); router.push('/bio-care'); } },
                { title: '3D 신경망 정밀 진단', desc: 'X/Y/Z 축 3-Code 의식 측정', action: () => { onClose(); router.push('/neural-diagnosis'); } },
                { title: '양자 각성 히든 룸', desc: '108 핵심 자각 퀘스트 & 감정 연금술', action: () => { onClose(); router.push('/quantum-awakening'); } }
            ]
        },
        {
            category: '코칭 & 힐링',
            items: [
                { title: '명심 AI 1:1 심층 상담', desc: '무의식 방어기제 디버깅 코치', action: () => { onClose(); router.push('/myeongsim-chat'); } },
                { title: '코칭 에세이 & 432Hz 힐링송', desc: '사주 기질 맞춤형 헌정 치유 음원', action: () => { onClose(); router.push('/today'); } },
                { title: '마스터 코어 스텝백', desc: '관점 전환 인지 훈련', action: () => { onClose(); router.push('/master-core/step-back'); } }
            ]
        },
        {
            category: '정보 & 비즈니스',
            items: [
                { title: '명심코칭 디지털 도서관', desc: '도서 《제로 포인트》 e-Book 전문', action: () => { onClose(); router.push('/library'); } },
                { title: '국세청 창업·N잡 매핑', desc: '홈택스 6자리 표준 업종 추천', action: () => { onClose(); router.push('/startup'); } },
                { title: '서비스 소개 & 특허 정보', desc: '특허출원 제10-2025-0166877호', action: () => { onClose(); router.push('/intro'); } }
            ]
        },
        {
            category: 'VIP & 지원',
            items: [
                { title: 'VIP 프리미엄 패키지', desc: '무제한 정밀 리포트 & VIP 코칭권', action: () => { onClose(); router.push('/support'); } },
                { title: '고객센터 & 1:1 문의', desc: '마인드플로우랩 공식 지원', action: () => { onClose(); router.push('/support'); } }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 select-none">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="w-full max-w-md max-h-[85vh] bg-[#111C2F] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0e1726]">
                    <div>
                        <h3 className="text-sm font-black text-white">
                            전체 기능 둘러보기
                        </h3>
                        <p className="text-[11px] text-[#9AA7B7]">
                            명심코칭의 모든 분석과 코칭 메뉴입니다.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 본문 리스트 */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
                    {sections.map((sec, i) => (
                        <div key={i} className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                                {sec.category}
                            </h4>
                            <div className="space-y-1.5">
                                {sec.items.map((item, j) => (
                                    <div
                                        key={j}
                                        onClick={item.action}
                                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-white">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-[#9AA7B7]">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <ExternalLink size={13} className="text-gray-400 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

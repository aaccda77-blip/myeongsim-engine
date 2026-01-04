'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CooperationProfileData } from '@/types/genius-report';
import { Building2, Network, Users2, Handshake, User, Shuffle } from 'lucide-react';

interface CooperationProfileProps {
    data: CooperationProfileData;
}

const COOPERATION_CONFIG = [
    {
        key: 'flexible' as const,
        label: 'Situationally FLEXIBLE',
        labelKo: '상황에 따라 유연하게',
        icon: Shuffle
    },
    {
        key: 'largeOrganization' as const,
        label: 'In larger ORGANIZATIONS',
        labelKo: '대조직 속에서',
        icon: Building2
    },
    {
        key: 'networks' as const,
        label: 'In NETWORKS',
        labelKo: '네트워크를 통해',
        icon: Network
    },
    {
        key: 'communities' as const,
        label: 'In supportive COMMUNITIES',
        labelKo: '커뮤니티 안에서',
        icon: Users2
    },
    {
        key: 'partnership' as const,
        label: 'PARTNERSHIP with a second person',
        labelKo: '1:1 파트너십으로',
        icon: Handshake
    },
    {
        key: 'autonomous' as const,
        label: 'Autonomous and INDEPENDENT',
        labelKo: '자율적이고 독립적으로',
        icon: User
    },
];

export default function CooperationProfile({ data }: CooperationProfileProps) {
    // 정렬된 데이터 (높은 순)
    const sortedData = [...COOPERATION_CONFIG].sort((a, b) => data[b.key] - data[a.key]);

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            {/* Header */}
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                🤝 MY COOPERATION PROFILE
            </h3>
            <p className="text-xs text-gray-400 mb-6">어떤 환경에서 일할 때 가장 좋은 성과를 내는지 보여줍니다</p>

            {/* Bars */}
            <div className="space-y-3">
                {sortedData.map((config, idx) => {
                    const value = data[config.key];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={config.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="flex items-center gap-3"
                        >
                            {/* Icon */}
                            <Icon className="w-4 h-4 text-amber-500/70 shrink-0" />

                            {/* Bar Container */}
                            <div className="flex-1">
                                <div className="h-5 w-full bg-black/30 rounded overflow-hidden border border-white/5 relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.08, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded relative"
                                    >
                                        {/* Inner Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                    </motion.div>

                                    {/* Label inside bar */}
                                    <div className="absolute inset-0 flex items-center px-2">
                                        <span className="text-[10px] text-white/90 font-medium truncate drop-shadow-lg">
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Preferred Team Role */}
            <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">MY PREFERRED TEAM ROLE</p>
                <p className="text-sm text-white">
                    "<span className="text-amber-400 font-bold">TEAM SUPPORTER</span>", supportive, communicative, process-oriented
                </p>
            </div>
        </div>
    );
}

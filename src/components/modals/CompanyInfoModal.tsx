'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Mail, FileText, ExternalLink } from 'lucide-react';

interface CompanyInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CompanyInfoModal({ isOpen, onClose }: CompanyInfoModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div 
                className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0b1329] border border-white/15 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-5 relative text-left"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
                        aria-label="닫기"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-base">명심코칭 (마인드플로우랩)</h3>
                            <p className="text-gray-400 text-xs font-medium">사업자 정보 및 고객센터 안내</p>
                        </div>
                    </div>

                    {/* Business Info */}
                    <div className="space-y-2 text-xs text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-gray-400">대표자</span>
                            <span className="font-semibold text-gray-200">이경윤</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-gray-400">사업자등록번호</span>
                            <span className="font-mono text-gray-200 font-semibold">838-03-03892</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-gray-400">통신판매업신고번호</span>
                            <span className="font-mono text-gray-200 font-semibold">2026-세종-0576</span>
                        </div>
                        <div className="flex justify-between items-center py-1 text-amber-300">
                            <span className="text-gray-400">특허출원번호</span>
                            <span className="font-mono font-bold">제10-2025-0166877호</span>
                        </div>
                    </div>

                    {/* Customer Support */}
                    <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
                        <h4 className="font-bold text-gray-200 flex items-center gap-1.5">
                            <Mail size={14} className="text-amber-400" /> 고객센터
                        </h4>
                        <p className="text-gray-300 font-mono text-xs">support@myeongsimcoaching.com</p>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            ※ 전화 상담은 제공하지 않습니다. 문의하기 게시판을 이용해주시면 빠르게 답변드리겠습니다.
                        </p>
                        <div className="pt-1">
                            <a
                                href="/support"
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/40 transition-colors cursor-pointer"
                            >
                                💬 1:1 문의하기 게시판 이동
                            </a>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <a href="/terms" className="hover:text-white transition-colors cursor-pointer">이용약관</a>
                            <span>|</span>
                            <a href="/privacy" className="hover:text-white transition-colors cursor-pointer font-bold text-gray-200">개인정보처리방침</a>
                        </div>
                        <span className="text-[10px] text-gray-500">© 2026 MindFlow Lab</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// @ts-nocheck
import React, { useState } from 'react';
import { CreditCard, Copy, ExternalLink, Check, Lock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void;
}

export default function PaymentCard({ onCopy, onDetailedReport }: PaymentCardProps) {
    const [copied, setCopied] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'TRIAL' | 'PASS' | 'VIP'>('PASS');

    const handleCopy = () => {
        navigator.clipboard.writeText('농협 351-0733-820813');
        setCopied(true);
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenKakao = () => {
        if (!privacyConsent) {
            alert('개인정보 수집·이용 동의가 필요합니다.');
            return;
        }

        // Trigger phone auth modal (passed from parent)
        if (onDetailedReport) {
            onDetailedReport(); // This triggers PhoneAuthModal in ChatInterface
        }
    };

    const getPrice = () => {
        switch (selectedTier) {
            case 'TRIAL': return '3,900원';
            case 'PASS': return '9,900원';
            case 'VIP': return '49,000원';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-xl border border-white/10 shadow-xl overflow-hidden my-2"
        >
            {/* Header */}
            <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-wide">🔐 프리미엄 이용권 구매</span>
            </div>

            <div className="p-5 flex flex-col gap-4">
                {/* Pricing Tiers */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Tier 1 */}
                    <div
                        onClick={() => setSelectedTier('TRIAL')}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTier === 'TRIAL' ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${selectedTier === 'TRIAL' ? 'text-indigo-300' : 'text-gray-300'}`}>💎 맛보기 (30분)</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400 text-xs line-through">10,000원</span>
                                <span className="text-red-400 text-xs font-bold">61% OFF</span>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-white">3,900<span className="text-sm font-normal">원</span></span>
                    </div>

                    {/* Tier 2 (Highlighted) */}
                    <div
                        onClick={() => setSelectedTier('PASS')}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all relative ${selectedTier === 'PASS' ? 'bg-indigo-900/40 border-indigo-500 shadow-lg' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="absolute top-0 right-0 bg-indigo-500 text-[9px] text-white px-2 py-0.5 rounded-bl-md font-bold">Best</div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${selectedTier === 'PASS' ? 'text-indigo-200' : 'text-gray-400'}`}>⚡ 데이 패스 (24시간)</span>
                            <div className="flex items-center gap-1">
                                <span className="text-indigo-300/60 text-xs line-through">30,000원</span>
                                <span className="text-red-400 text-xs font-bold">67% OFF</span>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-white">9,900<span className="text-sm font-normal">원</span></span>
                    </div>

                    {/* Tier 3 */}
                    <div
                        onClick={() => setSelectedTier('VIP')}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTier === 'VIP' ? 'bg-primary-gold/20 border-primary-gold ring-1 ring-primary-gold' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${selectedTier === 'VIP' ? 'text-primary-gold' : 'text-primary-gold/60'}`}>👑 VIP (7일)</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400 text-xs line-through">150,000원</span>
                                <span className="text-red-400 text-xs font-bold">67% OFF</span>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-white">49,000<span className="text-sm font-normal">원</span></span>
                    </div>
                </div>

                {/* Security & Patent Info */}
                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3 text-xs text-gray-300 space-y-1">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold">
                        <Shield className="w-3 h-3" />
                        <span>안전한 개인정보 처리</span>
                    </div>
                    <div className="space-y-0.5 text-gray-400 pl-5">
                        <div>✅ 이름, 이메일, 주민번호 수집 안 함</div>
                        <div>✅ 전화번호 SHA-256 암호화 저장</div>
                        <div>✅ 특허출원 10-2025-0166877 기술 적용</div>
                    </div>
                </div>

                {/* Privacy Consent */}
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-indigo-500"
                    />
                    <span className="text-xs text-gray-400 leading-relaxed">
                        <span className="font-bold text-gray-300 block mb-1">[필수] 개인정보 수집 및 이용 동의</span>
                        <div className="pl-1 space-y-0.5 opacity-80">
                            <div>• 수집 항목: 휴대전화번호, 입금자명</div>
                            <div>• 수집 목적: 서비스 이용권 제공 및 본인 확인</div>
                            <div>• 보유 기간: 회원 탈퇴 시까지 (법령 별도 보관)</div>
                        </div>
                    </span>
                </label>

                {/* Conditional Account Info */}
                {privacyConsent ? (
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between group">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 mb-0.5">입금 계좌 (농협)</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-200 font-mono tracking-wide">351-0733-820813</span>
                                    <span className="text-xs text-gray-400">이경윤</span>
                                </div>
                            </div>
                            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-md">
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="text-[10px] text-gray-500 space-y-0.5">
                            <div>⏰ 입금 확인: 평일 10분 이내</div>
                            <div>📞 비상 연락: 오픈카톡으로 연락 요망</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/5 text-center text-gray-500 text-sm">
                        개인정보 동의 후 계좌번호가 표시됩니다
                    </div>
                )}

                {/* Action Buttons */}
                <button
                    onClick={handleOpenKakao}
                    disabled={!privacyConsent}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>{getPrice()} 입금 및 전화번호 등록</span>
                </button>

                {/* [Pulse Check] Open Kakao Link for Manual Confirm */}
                <button
                    onClick={() => window.open('https://open.kakao.com/o/spgWFR8h', '_blank')}
                    className="w-full py-3 bg-[#FAE300] hover:bg-[#F9D500] text-black font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors mt-2"
                >
                    <span className="text-lg">💬</span>
                    <span>관리자와 1:1 대화 (입금 확인)</span>
                </button>
            </div>
        </motion.div>
    );
}

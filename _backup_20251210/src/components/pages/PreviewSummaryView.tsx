'use client';

import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';

export default function PreviewSummaryView() {
    return (
        <div className="h-full pt-4 pb-12 overflow-y-auto">
            {/* Top Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <span className="inline-block px-3 py-1 rounded-full border border-primary-olive/30 text-primary-olive text-[10px] tracking-widest font-sans mb-3">
                    PREVIEW
                </span>
                <h1 className="text-3xl font-serif text-white leading-tight mb-2">
                    당신만을 위한 &apos;인생 지도&apos;<br />
                    PDF 리포트 미리보기
                </h1>
                <p className="text-sm text-gray-400 font-sans mt-3">
                    단순한 운세풀이가 아닙니다.<br />
                    나를 이해하고 성장시키는 구체적인 가이드입니다.
                </p>
            </motion.div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary-slate/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden shadow-2xl"
            >
                {/* Profile Section */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-olive/20 flex items-center justify-center border border-primary-olive/30">
                        <User className="w-6 h-6 text-primary-olive" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg font-sans">
                            재능은 많지만 마무리가 안 되는 &apos;N잡러&apos; 김지수 님
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 font-sans">
                            &quot;이것도 재밌고 저것도 재밌는데, 막상 시작하면 금방 질려요. 제가 끈기가 없는 걸까요?&quot;
                        </p>
                    </div>
                </div>

                {/* 4-Grid Section */}
                <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5 text-left">
                    {/* Box 1 */}
                    <div className="p-5 border-b border-white/5">
                        <h4 className="text-primary-olive text-xs font-bold mb-2 flex items-center gap-1 font-sans">
                            <span className="w-4 h-4 rounded border border-current flex items-center justify-center text-[10px]">S</span> 사주 진단
                        </h4>
                        <div className="text-lg font-bold text-white mb-2 font-serif">&quot;왜 그럴까?&quot;</div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">
                            <span className="text-white font-bold">상관(傷官) + 편재(偏財)</span> 발달<br /><br />
                            호기심이 왕성하고 아이디어가 쏟아지는 &apos;창의적인 개척자&apos; 유형입니다.<br />
                            하지만 불(火) 기운이 과도하여...
                        </p>
                    </div>

                    {/* Box 2 */}
                    <div className="p-5 border-b border-white/5">
                        <h4 className="text-primary-olive text-xs font-bold mb-2 flex items-center gap-1 font-sans">
                            <span className="w-4 h-4 rounded border border-current flex items-center justify-center text-[10px]">C</span> 심리 번역
                        </h4>
                        <div className="text-lg font-bold text-white mb-2 font-serif">&quot;무슨 일이?&quot;</div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans mb-3">
                            지수 님은 게으른 게 아니라 &apos;새로움 추구&apos; 성향이 강할 뿐입니다.
                        </p>
                        <div className="bg-black/30 p-2 rounded text-[10px] text-gray-400 font-sans border border-white/5">
                            <span className="text-orange-400">⚠️ 인지적 오류</span><br />
                            &quot;처음부터 완벽하게 재미있어야 해.&quot;
                        </div>
                    </div>

                    {/* Box 3 */}
                    <div className="p-5">
                        <h4 className="text-primary-olive text-xs font-bold mb-2 flex items-center gap-1 font-sans">
                            <span className="w-4 h-4 rounded border border-current flex items-center justify-center text-[10px]">A</span> 행동 처방
                        </h4>
                        <div className="text-lg font-bold text-white mb-2 font-serif">&quot;어떻게?&quot;</div>
                        <ul className="text-xs text-gray-300 space-y-2 font-sans list-disc pl-3">
                            <li>가치 나침반: 단순 재미가 아닌 &apos;영향력&apos;으로 목표 재정의</li>
                            <li>5분 버티기: 그만두고 싶을 때 딱 5분만 관찰하기</li>
                            <li>뽀모도로: 25분 몰입 + 5분 휴식</li>
                        </ul>
                    </div>

                    {/* Box 4 */}
                    <div className="p-5">
                        <h4 className="text-primary-olive text-xs font-bold mb-2 flex items-center gap-1 font-sans">
                            <span className="w-4 h-4 rounded border border-current flex items-center justify-center text-[10px]">R</span> 변화 확인
                        </h4>
                        <div className="text-lg font-bold text-white mb-2 font-serif">&quot;결과는?&quot;</div>
                        <p className="text-xs text-gray-300 italic mb-3 font-sans">
                            &quot;이제 제 변덕을 탓하지 않아요. 폭발적인 에너지를 짧게 끊어 쓰는 법을 배웠거든요.&quot;
                        </p>
                        <div className="text-xs text-primary-olive font-bold flex items-center gap-1 font-sans">
                            <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">✓</span> 3개월 만에 프로젝트 2개 런칭
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CTA Button */}
            <div className="mt-10 text-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-olive text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-[#557539] transition-colors flex items-center gap-2 mx-auto"
                >
                    내 사주 속 &apos;심리적 허들&apos; 확인하기
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
                <p className="text-[10px] text-gray-600 mt-3 font-sans">* 무료 샘플 리포트는 준비 중입니다.</p>
            </div>
        </div>
    );
}

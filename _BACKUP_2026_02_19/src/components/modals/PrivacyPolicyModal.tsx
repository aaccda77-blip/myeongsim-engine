// src/components/modals/PrivacyPolicyModal.tsx
'use client';

import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-primary-gold" />
                        <h2 className="text-xl font-bold text-white">개인정보 처리방침</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] text-slate-300 space-y-6 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-white font-bold mb-2">1. 개인정보의 수집 및 이용 목적</h3>
                        <p>명심코칭(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>회원 가입 및 관리 (본인 확인, 중복 가입 방지)</li>
                            <li>서비스 제공 (사주 분석, AI 코칭, 맞춤형 콘텐츠 제공)</li>
                            <li>이용권 관리 및 결제 처리</li>
                            <li>고객 문의 응대 및 민원 처리</li>
                            <li>서비스 개선 및 통계 분석 (익명화 처리)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">2. 수집하는 개인정보 항목</h3>
                        <div className="space-y-2">
                            <p><strong className="text-primary-gold">필수 항목:</strong></p>
                            <ul className="list-disc list-inside ml-4">
                                <li>휴대폰 번호 (암호화 저장)</li>
                                <li>생년월일, 출생 시간 (사주 분석용)</li>
                                <li>서비스 이용 기록 (접속 로그, IP 주소)</li>
                            </ul>
                            <p className="mt-3"><strong className="text-primary-gold">선택 항목:</strong></p>
                            <ul className="list-disc list-inside ml-4">
                                <li>닉네임 (미입력 시 자동 생성)</li>
                                <li>생체 데이터 (Apple Watch 연동 시, 별도 동의)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">3. 개인정보의 보유 및 이용 기간</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관련 법령에 따라 일부 정보는 최대 5년간 보관)</li>
                            <li><strong>결제 기록:</strong> 전자상거래법에 따라 5년간 보관</li>
                            <li><strong>서비스 이용 기록:</strong> 통신비밀보호법에 따라 3개월간 보관</li>
                            <li><strong>휴면 계정:</strong> 1년간 미접속 시 별도 분리 보관 (파기 30일 전 사전 통지)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">4. 개인정보의 제3자 제공</h3>
                        <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우 예외로 합니다:</p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>이용자가 사전에 동의한 경우</li>
                            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
                            <li><strong>결제 대행:</strong> 토스페이먼츠 (결제 처리 목적, 5년간 보관)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">5. 개인정보 처리 위탁</h3>
                        <p>회사는 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다:</p>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><strong>Vercel (미국):</strong> 웹 호스팅 및 서버 관리</li>
                            <li><strong>Supabase (미국):</strong> 데이터베이스 관리 (암호화 저장)</li>
                            <li><strong>Google Cloud (미국):</strong> AI 분석 처리 (익명화 처리)</li>
                        </ul>
                        <p className="mt-2 text-xs text-slate-400">※ 위탁 업체 변경 시 본 방침을 통해 고지합니다.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">6. 정보주체의 권리·의무 및 행사 방법</h3>
                        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>개인정보 열람 요구</li>
                            <li>개인정보 정정·삭제 요구</li>
                            <li>개인정보 처리 정지 요구</li>
                            <li>회원 탈퇴 (즉시 처리)</li>
                        </ul>
                        <p className="mt-2">권리 행사는 앱 내 "설정 &gt; 개인정보 관리" 또는 이메일(privacy@myeongsim.com)로 가능합니다.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">7. 개인정보의 파기 절차 및 방법</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>파기 절차:</strong> 보유 기간 만료 시 지체 없이 파기 (단, 법령에 따라 보관 필요 시 별도 분리 보관)</li>
                            <li><strong>파기 방법:</strong> 전자 파일은 복구 불가능한 방법으로 영구 삭제, 종이 문서는 분쇄 또는 소각</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">8. 개인정보 보호책임자</h3>
                        <div className="bg-slate-800 p-4 rounded-lg mt-2">
                            <p><strong>개인정보 보호책임자:</strong> 홍길동</p>
                            <p><strong>이메일:</strong> privacy@myeongsim.com</p>
                            <p><strong>전화:</strong> 02-1234-5678</p>
                            <p className="mt-2 text-xs text-slate-400">개인정보 침해 신고: 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-white font-bold mb-2">9. 개인정보 처리방침 변경</h3>
                        <p>본 방침은 2025년 1월 1일부터 적용되며, 변경 사항이 있을 경우 앱 공지사항을 통해 최소 7일 전 고지합니다.</p>
                    </section>

                    <section className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                        <p className="text-blue-300 text-xs">
                            <strong>📌 중요:</strong> 본 개인정보 처리방침은 개인정보보호법, 정보통신망법 등 관련 법령을 준수하여 작성되었습니다.
                            서비스 이용 시 본 방침에 동의한 것으로 간주됩니다.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary-gold text-white font-bold rounded-xl hover:bg-primary-gold/90 transition-colors"
                    >
                        확인했습니다
                    </button>
                </div>
            </div>
        </div>
    );
};

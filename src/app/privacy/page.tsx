'use client';

import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070A12] text-gray-200 font-sans flex flex-col justify-between">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto px-5 py-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
          className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 mb-6 cursor-pointer shadow-lg shadow-amber-500/5"
        >
          <ArrowLeft size={16} />
          <span>명심코칭 메인으로 돌아가기</span>
        </a>

        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 tracking-wider">PRIVACY POLICY</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">명심코칭 개인정보처리방침</h1>
        <p className="text-xs text-gray-400 border-b border-white/10 pb-4 mb-6">
          시행일자: 2026년 7월 22일 | 운영사: 마인드플로우랩 (MindFlow Lab)
        </p>

        {/* Content Body */}
        <div className="space-y-6 text-xs leading-relaxed text-gray-300">
          
          {/* 총칙 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">1. 개요 및 개인정보의 수집·이용 목적</h2>
            <p className="text-[11px] text-gray-300 leading-normal">
              마인드플로우랩(이하 &apos;회사&apos;)은 「개인정보보호법」 제30조에 따라 서비스 이용자의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보 처리방침을 수립하고 이를 준수하고 있습니다.
            </p>
            <div className="text-[11px] text-gray-400 pt-1 space-y-1">
              <p>• <strong>회원가입 및 관리:</strong> 본인 식별·인증, 부정 가입 방지, 회원 자격 유지, 서비스 관련 통지</p>
              <p>• <strong>서비스 제공:</strong> 본인확인, 주역의식지도 및 AI 멘탈 코칭 리포트 생성, 대금 결제, 취소·환불 처리</p>
              <p>• <strong>이벤트 및 혜택 관리:</strong> 100% 환급 쿠폰 및 VIP 페이백 혜택 제공, 이벤트 응모 및 안내</p>
              <p>• <strong>마케팅 및 고객지원:</strong> AI 맞춤형 멘탈 가이드 제공, 민원 처리, 고지사항 전달, 서비스 품질 향상</p>
            </div>
          </section>

          {/* 수집 항목 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">2. 수집하는 개인정보 항목</h2>
            <div className="text-[11px] text-gray-300 space-y-2">
              <div>
                <strong className="text-white">① 회원가입 및 기질/멘탈 리포트 생성 시:</strong>
                <p className="text-gray-400 pl-2">
                  - 필수: 이메일 주소, 이름(닉네임), 암호화된 본인식별정보<br />
                  - 선택: 생년월일시(양력/음력), 성별, 일상 감정 상태 스코어
                </p>
              </div>
              <div>
                <strong className="text-white">② 서비스 이용 중 자동 수집:</strong>
                <p className="text-gray-400 pl-2">
                  - IP 주소, 쿠키(Cookie), 방문 일시, 서비스 이용 기록, 기기 식별 정보, 3초 자각 체크인 데이터
                </p>
              </div>
              <div>
                <strong className="text-white">③ 유료 서비스 결제 시:</strong>
                <p className="text-gray-400 pl-2">
                  - 승인번호, 결제 일시, 결제 금액, 카드사명 (※ 신용카드 번호 등 결제 정보는 PG사 및 토스페이먼츠/카카오페이에서 안전하게 암호화 처리되며 회사는 직접 저장하지 않습니다)
                </p>
              </div>
            </div>
          </section>

          {/* 보유 및 이용 기간 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              회사는 이용자로부터 개인정보 수집 시 동의받은 보유·이용기간 또는 법령에 따른 보유·이용기간 내에서 개인정보를 처리합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] pl-1 pt-1">
              <li>회원가입 정보: 회원 탈퇴 시까지 (탈퇴 즉시 영구 파기)</li>
              <li>전자상거래 관련 결제 및 환불 기록: 「전자상거래법」에 의거 5년 보관</li>
              <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 보관</li>
              <li>웹사이트 방문 기록 (로그): 「통신비밀보호법」에 의거 3개월 보관</li>
            </ul>
          </section>

          {/* 제3자 제공 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">4. 개인정보의 제3자 제공</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령의 규정에 의거하거나 수사 목적으로 적법한 절차와 방법에 따라 수사기관의 요청이 있는 경우 예외로 합니다.
            </p>
          </section>

          {/* 위탁 및 국외 이전 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">5. 데이터 처리 위탁 및 국외 이전</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              회사는 안정적인 인프라 구축 및 서비스 품질 향상을 위해 아래와 같이 데이터 처리를 외부 전문 시스템에 위탁 및 보관하고 있습니다.
            </p>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5 text-[11px] text-gray-300 space-y-1 mt-1 font-mono">
              <p>• <strong>수탁 업체:</strong> Supabase Inc., Google LLC (Gemini API, GCP), Vercel Inc.</p>
              <p>• <strong>이전 국가:</strong> 미국 (USA)</p>
              <p>• <strong>이전 항목:</strong> 암호화된 회원 데이터, 서비스 이용 로그, AI 코칭 프롬프트 데이터</p>
              <p>• <strong>이전 목적:</strong> 데이터베이스 백업, 글로벌 CDN 배포, AI 분석 엔진 구동</p>
              <p>• <strong>보유 및 이용 기간:</strong> 회원 탈퇴 시 또는 서비스 종료 시까지</p>
            </div>
          </section>

          {/* 파기 절차 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">6. 개인정보의 파기 절차 및 방법</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] pl-1">
              <li><strong>전자적 파일 형태:</strong> 복구 및 재생이 불가능한 기술적 방법(데이터베이스 덮어쓰기 및 삭제)으로 영구 삭제</li>
              <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각 처리</li>
            </ul>
          </section>

          {/* 이용자의 권리 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">7. 이용자 및 법정대리인의 권리와 행사 방법</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              이용자는 언제든지 자신의 개인정보 열람·정정·삭제·처리정지 요청 등의 권리를 행사할 수 있습니다. 고객센터 이메일을 통해 요청하시면 회사는 지체 없이 조치합니다.
            </p>
          </section>

          {/* 개인정보 보호책임자 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">8. 개인정보 보호책임자 및 문의처</h2>
            <p className="text-[11px] text-gray-400 leading-normal">
              회사는 이용자의 개인정보 관련 문의 및 불만 처리를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5 text-[11px] space-y-1 text-gray-300 mt-1">
              <p>• <strong>개인정보 보호책임자:</strong> 이경윤 대표</p>
              <p>• <strong>전자우편 문의:</strong> <span className="font-mono text-amber-300">support@myeongsimcoaching.com</span></p>
              <p className="text-[10px] text-gray-500 pt-1">※ 전화 상담은 운영하지 않으며, 이메일 및 서비스 내 고객 문의 게시판을 통해 24시간 내 신속하게 응대해 드립니다.</p>
            </div>
          </section>

          {/* 부칙 */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-[11px] text-amber-300 font-mono">
            <strong>부칙</strong><br />
            본 개인정보처리방침은 2026년 7월 22일부터 시행됩니다.
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

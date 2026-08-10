'use client';

import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 tracking-wider">LEGAL POLICY</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">명심코칭 서비스 이용약관</h1>
        <p className="text-xs text-gray-400 border-b border-white/10 pb-4 mb-6">
          시행일자: 2026년 7월 22일 | 운영사: 마인드플로우랩 (MindFlow Lab)
        </p>

        {/* Content Body */}
        <div className="space-y-6 text-xs leading-relaxed text-gray-300">
          
          {/* 제 1 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 1 조 (목적)</h2>
            <p>
              본 약관은 <strong>마인드플로우랩</strong>(이하 &apos;회사&apos;)이 제공하는 <strong>명심코칭</strong> 웹/앱 서비스(이하 &apos;서비스&apos;)의 이용과 관련하여 회사와 회원의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            <p className="text-gray-400 text-[11px]">
              1. 홈페이지(<a href="https://myeongsimcoaching.com" className="text-amber-400 underline">https://myeongsimcoaching.com</a>)란 유/무선 기기를 이용하여 회사가 제공하는 동양학·심리 과학 융합 의식지도 및 멘탈 코칭 콘텐츠를 회원이 이용·구입할 수 있도록 설정한 가상의 공간입니다.<br />
              2. &apos;회원&apos;이란 본 약관에 동의하고 개인정보를 제공하여 회원 등록을 한 자로서, 서비스를 이용할 수 있는 자를 말합니다.<br />
              3. &apos;콘텐츠&apos;란 회사가 유/무상으로 제공하는 명심 코드 해독, 십성 멘탈 분석, CBT/ACT 인지 코칭 텍스트 등 생성형 AI 기술로 생성되는 모든 정보 및 서비스를 말합니다.
            </p>
          </section>

          {/* 제 2 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 2 조 (회사 정보의 게시)</h2>
            <p>회사는 다음 사항을 회원이 알아보기 쉽도록 서비스 하단 및 관련 화면에 상시 표시합니다:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] pl-1">
              <li>상호명: 마인드플로우랩 (MindFlow Lab)</li>
              <li>대표자: 이경윤</li>
              <li>사업자등록번호: 838-03-03892</li>
              <li>고객센터 전자우편: support@myeongsimcoaching.com</li>
              <li>개인정보처리방침 및 서비스 이용약관</li>
            </ul>
          </section>

          {/* 제 3 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 3 조 (약관의 효력 및 개정)</h2>
            <p className="text-[11px] leading-normal space-y-1">
              1. 이 약관은 홈페이지 및 서비스 내 공지됨으로써 효력이 발생합니다.<br />
              2. 회사는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.<br />
              3. 약관 개정 시 적용일자 및 개정 사유를 명시하여 적용일 7일 전부터 서비스 내에 공지합니다.<br />
              4. 회원은 개정 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있으며, 계속 이용 시 개정 약관에 동의한 것으로 간주됩니다.
            </p>
          </section>

          {/* 제 4 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 4 조 (서비스의 제공 및 변경)</h2>
            <p className="text-[11px] leading-normal">
              1. 회사는 AI 기반 명심 주역코드 해독, Daily Scan 멘탈 자각 체크인, 890원 핀포인트 가이드전 및 30일 무제한 코칭 패스 등 유/무상 콘텐츠를 제공합니다.<br />
              2. 회사는 기술적 사양 변경, AI 엔진 업데이트 또는 사업 정책 전환에 따라 제공할 서비스의 내용을 변경할 수 있으며, 이 경우 즉시 변경 내용을 게시합니다.
            </p>
          </section>

          {/* 제 5 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 5 조 (서비스의 중단)</h2>
            <p className="text-[11px] leading-normal">
              1. 시스템 점검, 서버 유지보수, 통신 장애, 생성형 AI API 장애 등 불가피한 사유 발생 시 서비스 제공이 일시 중단될 수 있습니다.<br />
              2. 이로 인해 발생한 회원 손해에 대해 회사는 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.<br />
              3. 경영상 사유로 완전 종료 시 최소 30일 전 서비스 내 공지하며, 일부 무료 서비스 종료에 따른 손해배상의 의무는 없습니다.
            </p>
          </section>

          {/* 제 6 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 6 조 (구매 및 대금 결제)</h2>
            <p className="text-[11px] leading-normal">
              1. 회원은 서비스 내에서 콘텐츠 선택 → 정보 입력 → 구매 신청 → 전자 결제(신용카드, 카카오페이, 토스페이, 휴대폰 소액결제 등) 절차로 구매를 진행합니다.<br />
              2. 외화 결제 시 환율 변동 및 카드사 수수료로 인해 실제 청구 금액이 차이 날 수 있으며, 이에 대해 회사는 책임지지 않습니다.
            </p>
          </section>

          {/* 제 7 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 7 조 (청약철회 및 환불 정책)</h2>
            <p className="text-[11px] leading-normal">
              1. 디지털 콘텐츠의 특성상, 구매 후 해설 열람 및 AI 코칭 생성이 개시된 경우 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 청약철회가 제한됩니다.<br />
              2. 유료 결제 후 7일 이내에 단 한 번도 콘텐츠 해설을 열람하지 않거나 미사용한 유료 패스/포인트 건에 대해서만 100% 환불 신청이 가능합니다.<br />
              3. 이벤트로 무상 지급된 페이백 쿠폰 및 무료 패스는 환불 대상에서 제외됩니다.
            </p>
          </section>

          {/* 제 8 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 8 조 (유료 쿠폰 및 패스 유효기간)</h2>
            <p className="text-[11px] leading-normal">
              1. 결제 시 지급된 페이백 쿠폰 및 890원 환급 할인권은 발급 시점 기준으로 24시간 동안 유효합니다.<br />
              2. 유효기간이 경과한 미사용 쿠폰은 자동 소멸하며 이월되지 않습니다.<br />
              3. 본 조항은 2026년 7월 22일 이후 결제한 건부터 적용됩니다.
            </p>
          </section>

          {/* 제 9 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 9 조 (생성형 AI 기술 특성 및 한계 면책)</h2>
            <p className="text-[11px] leading-normal">
              1. 본 서비스가 제공하는 명심 코드 해독, 십성 멘탈 분석, CBT/ACT/MBCT/DBT/MBSR 인지 코칭 텍스트는 64 괘 파동 주파수 및 생성형 AI(Generative AI) 엔진을 기반으로 자동 생성되는 안내 참고용 정보입니다.<br />
              2. 회사는 알고리즘의 정밀도를 극대화하기 위해 최선의 노력을 다하나, 인공지능 기술의 특성상 제공되는 결과물의 100% 절대적 완벽성이나 무오류성을 보장하지 않습니다.<br />
              3. 제공되는 모든 정보는 비의료 자기계발 및 코칭 목적으로만 사용되어야 하며, 회원의 주관적 선택 및 현실 삶의 판단에 따른 최종 결과와 책임은 회원 본인에게 있습니다.
            </p>
          </section>

          {/* 제 10 조 */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-300">제 10 조 (손해배상 및 분쟁 해결)</h2>
            <p className="text-[11px] leading-normal">
              1. 회사는 천재지변, 서버 유지를 위한 정기 점검, 외부 AI API 통신 장애 등 불가항력적 사유로 인한 서비스 중단 시 고의 또는 중과실이 없는 한 손해배상 책임을 지지 않습니다.<br />
              2. 서비스 이용 중 회원과 회사 간에 발생한 분쟁에 관하여는 대한민국 법을 적용하며, 회사의 본사 소재지 관할 법원을 전속 관할 법원으로 합니다.
            </p>
          </section>

          {/* 부칙 */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-[11px] text-amber-300 font-mono">
            <strong>부칙</strong><br />
            본 약관은 2026년 7월 22일부터 시행됩니다.
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

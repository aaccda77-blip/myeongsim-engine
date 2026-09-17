import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '명심코칭 안드로이드 공식 앱 다운로드 | Myeongsim Coaching',
  description: '동양 명리학과 인지과학의 융합 웰니스, 명심코칭 안드로이드 공식 앱 및 스토어 제출 파일 다운로드 센터',
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full mb-3 tracking-widest uppercase">
            OFFICIAL ANDROID RELEASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">
            명심코칭 안드로이드 앱
          </h1>
          <p className="text-slate-400 text-sm">
            사주 심리 분석 & 3S 마음챙김 코칭을 스마트폰에서 만나보세요.
          </p>
        </div>

        {/* Primary Download: APK */}
        <div className="space-y-4 mb-8">
          <a
            href="/download/myeongsim-release.apk"
            download="myeongsim-release.apk"
            className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">📱</span>
              <div className="text-left">
                <div className="text-base font-extrabold">내 폰에 바로 설치 (APK 다운로드)</div>
                <div className="text-xs text-amber-950/80 font-medium">정식 릴리즈 서명 완료 • 약 8.3 MB</div>
              </div>
            </div>
            <span className="text-xl">➔</span>
          </a>

          {/* Secondary Download: AAB for Store */}
          <a
            href="/download/myeongsim-release.aab"
            download="myeongsim-release.aab"
            className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-200 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">📦</span>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-100">구글 플레이 스토어 제출용 (AAB 번들)</div>
                <div className="text-xs text-slate-400">Google Play Console 업로드 전용 • 약 7.6 MB</div>
              </div>
            </div>
            <span className="text-sm text-slate-400">다운로드</span>
          </a>

          {/* Assets ZIP & Individual Assets */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300">🖼️ 스토어 등록용 이미지 파일들</span>
              <a
                href="/download/google_play_assets.zip"
                download="google_play_assets.zip"
                className="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg font-bold"
              >
                ZIP 전체받기
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="/download/app_icon_512.png"
                download="app_icon_512.png"
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/80 rounded-xl flex items-center justify-between border border-slate-700 text-slate-200"
              >
                <span>앱 아이콘 (512x512)</span>
                <span className="text-amber-400 font-bold">받기 ➔</span>
              </a>
              <a
                href="/download/feature_graphic_1024x500.png"
                download="feature_graphic_1024x500.png"
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/80 rounded-xl flex items-center justify-between border border-slate-700 text-slate-200"
              >
                <span>그래픽 배너 (1024x500)</span>
                <span className="text-amber-400 font-bold">받기 ➔</span>
              </a>
              <a
                href="/download/screenshot_1.png"
                download="screenshot_1.png"
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/80 rounded-xl flex items-center justify-between border border-slate-700 text-slate-200"
              >
                <span>스크린샷 1 (리포트)</span>
                <span className="text-amber-400 font-bold">받기 ➔</span>
              </a>
              <a
                href="/download/screenshot_2.png"
                download="screenshot_2.png"
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/80 rounded-xl flex items-center justify-between border border-slate-700 text-slate-200"
              >
                <span>스크린샷 2 (사운드)</span>
                <span className="text-amber-400 font-bold">받기 ➔</span>
              </a>
              <a
                href="/download/screenshot_3.png"
                download="screenshot_3.png"
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/80 rounded-xl flex items-center justify-between border border-slate-700 text-slate-200 sm:col-span-2"
              >
                <span>스크린샷 3 (코칭)</span>
                <span className="text-amber-400 font-bold">받기 ➔</span>
              </a>
            </div>
          </div>
        </div>

        {/* Installation Tip */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <span>💡</span> 스마트폰 설치 안내
          </div>
          <p>
            1. <strong>[내 폰에 바로 설치]</strong> 버튼을 누르면 다운로드가 시작됩니다.
          </p>
          <p>
            2. 다운로드 완료 후 파일을 열었을 때 &apos;출처를 알 수 없는 앱&apos; 안내창이 뜨면 <strong>[무시하고 설치]</strong> 또는 <strong>[설치 허용]</strong>을 누르시면 정상 설치됩니다.
          </p>
          <p>
            3. 앱 실행 시 하단 광고와 함께 <strong>[₩3,300 광고 제거]</strong> 기능이 정상 작동합니다.
          </p>
        </div>

        {/* Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
          >
            <span>←</span> 명심코칭 웹 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

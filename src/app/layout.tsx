import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import SafetyDisclaimerModal from "@/components/modals/SafetyDisclaimerModal";

// 1. 폰트 변수 선언
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import PushTestButton from "@/components/debug/PushTestButton";

// 2. 메타데이터 (중복 제거 및 명심코칭 설정 확정)
export const metadata: Metadata = {
    title: "명심코칭 (Myeongsim Coaching)",
    description: "당신의 운명을 읽고 마음을 치유합니다.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // 3. HTML 태그 통합 (한국어 설정, 번역 방지)
        <html lang="ko" translate="no">
            <head>
                <meta name="google" content="notranslate" />
            </head>
            {/* 4. Body 클래스 통합 (폰트 + 안티앨리어싱 + 번역방지) */}
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased notranslate`}
            >
                <SafetyDisclaimerModal />
                <PushTestButton />
                <AuthGuard>
                    {children}
                </AuthGuard>
            </body>
        </html>
    );
}

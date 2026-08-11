import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SafetyDisclaimerModal from "@/components/modals/SafetyDisclaimerModal";
import GoogleAuthSync from "@/components/auth/GoogleAuthSync";
import VisitorTracker from "@/components/analytics/VisitorTracker";
import { LanguageProvider } from "@/contexts/LanguageContext";

// 1. 폰트 변수 선언
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// 2. 메타데이터 및 뷰포트 설정 (모바일 핀치 줌 확대 완전 허용)
export const metadata: Metadata = {
    title: "명심코칭 (Myeongsim Coaching)",
    description: "당신의 운명을 읽고 마음을 치유합니다.",
    icons: {
        icon: "/myeongsim_logo.png",
        apple: "/myeongsim_logo.png",
    },
    openGraph: {
        title: "명심코칭 (Myeongsim Coaching)",
        description: "당신의 운명을 읽고 마음을 치유합니다.",
        images: ["/myeongsim_logo.png"],
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
                {/* [Fix] Google Fonts for Health Q&A UI */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            {/* 4. Body 클래스 통합 (폰트 + 안티앨리어싱 + 번역방지) */}
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased notranslate`}
            >
                <LanguageProvider>
                    <SafetyDisclaimerModal />
                    {/* <PushTestButton /> - Debug Only */}
                    <GoogleAuthSync />
        <VisitorTracker />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}

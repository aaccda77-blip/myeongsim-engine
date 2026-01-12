import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Myeongsim Coaching (Safe Mode)",
    description: "System Recovery Mode",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>
                {children}
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Startup Fortune - 기업 컨설팅 대시보드',
    description: 'Enterprise Solution for Startups',
};

export default function StartupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className="dark">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700;800&family=Manrope:wght@700;800&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}

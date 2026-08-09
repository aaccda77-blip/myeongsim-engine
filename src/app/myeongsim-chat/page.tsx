import MyeongsimChatWrapper from '@/components/chat/MyeongsimChatWrapper';
import Footer from '@/components/Footer';

export const metadata = {
    title: '나만의 명심코칭 AI',
    description: '제미나이 기반 맞춤형 코칭',
};

export default function MyeongsimChatPage() {
    return (
        <main className="min-h-screen bg-[#0d131a] flex flex-col items-center justify-start p-4 py-8 overflow-y-auto">
            {/* MyeongsimChatWrapper: 실제 로그인 userId 자동 주입 */}
            <MyeongsimChatWrapper />
            
            {/* 하단 푸터 (회사 정보 및 고객센터) */}
            <div className="w-full max-w-2xl mt-8 pb-12">
                <Footer />
            </div>
        </main>
    );
}



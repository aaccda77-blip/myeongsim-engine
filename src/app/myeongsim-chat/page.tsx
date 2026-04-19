// Server Component — metadata는 서버 컴포넌트에서만 export 가능
// 클라이언트 로직(userId 주입)은 MyeongsimChatWrapper에 위임
import MyeongsimChatWrapper from '@/components/chat/MyeongsimChatWrapper';

export const metadata = {
    title: '나만의 명심코칭 AI',
    description: '제미나이 기반 맞춤형 코칭',
};

export default function MyeongsimChatPage() {
    return (
        <main className="min-h-screen bg-[#0d131a] flex flex-col items-center justify-center p-4">
            {/* MyeongsimChatWrapper: 실제 로그인 userId 자동 주입 (기존 MyeongsimChat 변경 없음) */}
            <MyeongsimChatWrapper />
        </main>
    );
}


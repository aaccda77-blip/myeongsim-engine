import MyeongsimChat from '@/components/chat/MyeongsimChat';

export const metadata = {
    title: '나만의 명심코칭 AI',
    description: '제미나이 기반 맞춤형 코칭',
};

export default function MyeongsimChatPage() {
    return (
        <main className="min-h-screen bg-[#0d131a] flex flex-col items-center justify-center p-4">
            <MyeongsimChat userId="test-user-id" />
        </main>
    );
}

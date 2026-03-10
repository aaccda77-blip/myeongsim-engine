'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function TestDBPage() {
    const [status, setStatus] = useState<string>('테스트 준비 완료');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runTest = async () => {
        setStatus('테스트 진행 중...');
        setLogs([]);
        addLog('Supabase 연결 테스트를 시작합니다...');

        try {
            // 1. Check Configuration
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!url || !key) {
                throw new Error('환경 변수가 누락되었습니다. .env.local 파일을 확인해주세요.');
            }
            addLog('✅ 환경 변수 확인 완료.');

            // 2. Test Connection (Auth check - usually always works if key is valid)
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            if (authError) throw authError;
            addLog('✅ Supabase 인증 클라이언트 초기화 성공.');

            // 3. Test Table Access (Users)
            addLog('"users" 테이블 접근 권한 확인 중...');
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('count')
                .limit(1);

            if (userError) {
                addLog(`❌ "users" 테이블 접근 실패: ${userError.message}`);
                addLog('힌트: Supabase SQL Editor에서 schema.sql 스크립트를 실행하셨나요?');
            } else {
                addLog('✅ "users" 테이블 접근 성공.');
            }

            // 4. Test Table Access (Chat Logs)
            addLog('"chat_logs" 테이블 접근 권한 확인 중...');
            const { error: chatError } = await supabase
                .from('chat_logs')
                .select('count')
                .limit(1);

            if (chatError) {
                addLog(`❌ "chat_logs" 테이블 접근 실패: ${chatError.message}`);
            } else {
                addLog('✅ "chat_logs" 테이블 접근 성공.');
            }

            setStatus('테스트 완료');

        } catch (err: any) {
            addLog(`❌ 치명적인 오류 발생: ${err.message}`);
            setStatus('테스트 실패');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
            <h1 className="text-2xl font-bold mb-6 text-green-400">Supabase 연결 진단 도구</h1>

            <div className="mb-8">
                <button
                    onClick={runTest}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
                >
                    진단 시작하기 (Run Diagnostics)
                </button>
                <span className="ml-4 text-gray-400">{status}</span>
            </div>

            <div className="bg-black/50 p-6 rounded-xl border border-gray-700 min-h-[300px]">
                {logs.length === 0 ? (
                    <p className="text-gray-500 italic">여기에 로그가 표시됩니다...</p>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className={`mb-2 ${log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-300' : 'text-gray-300'}`}>
                            {log}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 text-sm text-gray-500">
                <p>사용 가이드:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>프로젝트 루트에 `.env.local` 파일을 생성하세요.</li>
                    <li>`NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 입력하세요.</li>
                    <li>`npm run dev` 실행 후 이 페이지를 새로고침하세요.</li>
                </ol>
            </div>
        </div>
    );
}

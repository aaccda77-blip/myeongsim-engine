'use client';

import React, { useState } from 'react';
import { Copy, Key, Shield, Clock } from 'lucide-react';

export default function AdminKeysPage() {
    const [adminKey, setAdminKey] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [durationText, setDurationText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (type: '30m' | '24h') => {
        if (!adminKey) {
            alert('관리자 마스터 키를 입력하세요.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/generate-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminKey, type })
            });
            const data = await res.json();

            if (data.success) {
                setGeneratedKey(data.key);
                setDurationText(type === '30m' ? '30분 이용권' : '24시간 이용권');
            } else {
                alert(data.message || '실패했습니다.');
            }
        } catch (e) {
            alert('오류 발생');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            alert('복사되었습니다!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold">입장권 발급기</h1>
                    <p className="text-gray-400 text-sm mt-2">관리자 전용 페이지입니다.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">관리자 인증</label>
                        <input
                            type="password"
                            placeholder="Master Key 입력"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleGenerate('30m')}
                            disabled={isLoading}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Clock className="w-6 h-6 text-green-400" />
                            <span className="font-bold">30분권 생성</span>
                            <span className="text-xs text-gray-400">3,000원</span>
                        </button>
                        <button
                            onClick={() => handleGenerate('24h')}
                            disabled={isLoading}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="font-bold">24시간권 생성</span>
                            <span className="text-xs text-gray-400">10,000원</span>
                        </button>
                    </div>

                    {generatedKey && (
                        <div className="mt-8 bg-black/50 rounded-xl p-6 border border-green-500/30 animate-pulse-once">
                            <p className="text-xs text-green-400 font-bold mb-2 text-center uppercase tracking-wider">{durationText} 발급 완료</p>
                            <div
                                onClick={copyToClipboard}
                                className="text-3xl font-mono font-bold text-center tracking-widest text-white cursor-pointer hover:scale-105 transition-transform flex items-center justify-center gap-3"
                            >
                                {generatedKey}
                                <Copy className="w-5 h-5 text-gray-500" />
                            </div>
                            <p className="text-[10px] text-gray-500 text-center mt-3">클릭하여 복사 후 고객에게 전달하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

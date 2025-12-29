import React from 'react';

export default function LevelUpModal({ level, onClose }: { level: number, onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            {/* 카드 본체 */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-1 rounded-2xl shadow-2xl w-80 transform transition-all animate-bounce-in">
                <div className="bg-gray-900 rounded-xl p-6 text-center border border-yellow-500/30">

                    {/* 상단 뱃지 */}
                    <div className="inline-block px-3 py-1 bg-yellow-500 text-black font-bold rounded-full text-xs mb-4">
                        LEVEL UP!
                    </div>

                    {/* 물상 이미지 (플레이스홀더) */}
                    <div className="w-full h-40 bg-indigo-950 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
                        {/* 실제로는 여기에 생성된 AI 이미지를 넣습니다 */}
                        <span className="text-4xl">🌱 + ✂️</span>
                        <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* 칭호와 설명 */}
                    <h2 className="text-2xl font-bold text-white mb-2">씨앗을 심는 정원사</h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        "당신의 예리한 직관(辛金)이<br />가능성의 씨앗(乙未)을 심었습니다."
                    </p>

                    {/* 닫기 버튼 */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                    >
                        멋져요! (보관함에 저장)
                    </button>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Lock, Settings, Smartphone } from 'lucide-react';

interface MicPermissionGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MicPermissionGuideModal({ isOpen, onClose }: MicPermissionGuideModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#1A1F2B] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="p-5 flex justify-between items-center border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 text-red-400">
                            <Mic className="w-5 h-5" />
                            <h3 className="font-bold text-lg text-white">마이크 권한이 필요합니다</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            브라우저 보안 설정으로 인해 마이크가 차단되었습니다.<br />
                            아래 방법으로 <span className="text-primary-gold font-bold">권한을 허용</span>해주세요.
                        </p>

                        {/* Guide Tabs (Visual) */}
                        <div className="space-y-4">
                            {/* Android / Chrome */}
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-green-400 font-bold text-sm">
                                    <Smartphone size={16} />
                                    <span>안드로이드 (Chrome / 삼성인터넷)</span>
                                </div>
                                <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 ml-1">
                                    <li>주소창 왼쪽의 <Lock size={12} className="inline mx-1" /> <strong>자물쇠 아이콘</strong> 터치</li>
                                    <li><strong>권한 (Permissions)</strong> 또는 <strong>사이트 설정</strong> 선택</li>
                                    <li><strong>마이크</strong>를 찾아 <strong>허용</strong>으로 변경</li>
                                    <li>새로고침 하세요.</li>
                                </ol>
                            </div>

                            {/* iOS / Safari */}
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                                    <Settings size={16} />
                                    <span>아이폰 (Safari)</span>
                                </div>
                                <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 ml-1">
                                    <li>주소창 왼쪽의 <strong>'한한' (가가) 아이콘</strong> 터치</li>
                                    <li><strong>웹사이트 설정</strong> 선택</li>
                                    <li><strong>마이크</strong>를 <strong>허용</strong>으로 변경</li>
                                </ol>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("링크가 복사되었습니다. 크롬(Chrome)이나 삼성인터넷 주소창에 붙여넣어주세요.");
                                }}
                                className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                🔗 링크 복사
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 py-3 bg-primary-gold text-black font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
                            >
                                설정 완료 (새로고침)
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 mt-2 bg-white/5 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-colors text-sm"
                        >
                            ⌨️ 마이크 포기하고 텍스트로 입력하기
                        </button>

                        {/* Debug Info */}
                        <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-600 font-mono text-center">
                            DEBUG: {typeof window !== 'undefined' ? (window.navigator.userAgent.includes('KAKAOTALK') ? 'KAKAO-WEBVIEW' : 'BROWSER') : 'SERVER'} /
                            API: {typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition) ? 'OK' : 'MISSING'}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

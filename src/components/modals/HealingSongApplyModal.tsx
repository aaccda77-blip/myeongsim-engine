'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Sparkles, CheckCircle2, X, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HealingSongApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultName?: string;
    defaultOrder?: string;
}

const HEALING_SONG_I18N = {
    kr: {
        badge: '독자 1위 특전',
        title: '1:1 맞춤 헌정 힐링송 무료 작곡',
        intro: '🎵 책 2p·308p 수록 혜택: 독자님의 사주 오행 기질과 주파수를 정밀 분석하여, 세상에 단 하나뿐인 전용 치유 음원을 작곡하여 선물해 드립니다.',
        nameLabel: '신청자 성함',
        namePlaceholder: '성함 입력',
        emailLabel: '이메일 주소 (MP3 수령용)',
        elementLabel: '내 사주 중심 오행',
        elements: [
            { value: '금(金)', label: '금(金) - 다이아몬드/결단' },
            { value: '목(木)', label: '목(木) - 숲/성장/창의' },
            { value: '화(火)', label: '화(火) - 태양/열정/확장' },
            { value: '토(土)', label: '토(土) - 대지/포용/안정' },
            { value: '수(水)', label: '수(水) - 깊은 바다/지혜/유연' },
        ],
        frequencyLabel: '희망 치유 주파수',
        frequencies: [
            { value: '432Hz', label: '432Hz (우주 맥박, 깊은 이완)' },
            { value: '528Hz', label: '528Hz (기적의 주파수, DNA 복원)' },
        ],
        themeLabel: '희망 힐링 테마',
        themes: [
            { id: '수면/휴식', label: '🌙 깊은 수면 & 번아웃 회복' },
            { id: '초집중/영감', label: '💡 초집중 & 영감 발현' },
            { id: '감정정화', label: '🧘 불안/분노/조급함 정화' },
            { id: '풍요/확장', label: '💎 풍요 & 자기 확신 증폭' },
        ],
        messageLabel: '작가 및 사운드 팀에 전할 이야기 (선택)',
        messagePlaceholder: '현재 겪고 계신 마음의 고민이나 바라는 변화를 편하게 적어주세요.',
        submitBtn: '1:1 헌정 힐링송 작곡 무료 신청 접수',
        submitting: '신청서 서버 접수 중...',
        successTitle: '신청이 성공적으로 접수되었습니다!',
        receiptLabel: '접수 번호:',
        successDesc: (name: string, el: string, freq: string) => `${name}님의 ${el} 기질 기반 ${freq} 음원 작업 착수`,
        successEmailNotice: (email: string) => `입력해 주신 이메일(${email})로 2~3일 내에 고음질 마스터링 MP3 파일과 사주 주파수 해설서가 안전하게 발송됩니다.`,
        closeBtn: '확인 및 닫기',
        serverError: '서버 연결 중 오류가 발생했습니다. 다시 시도해 주세요.'
    },
    en: {
        badge: '#1 Reader Perk',
        title: 'Free 1:1 Custom Dedicated Healing Song',
        intro: '🎵 Benefit on pp. 2 & 308: We analyze your natural energetic disposition and frequency to compose a one-of-a-kind dedicated healing soundtrack.',
        nameLabel: 'Applicant Name',
        namePlaceholder: 'Enter your name',
        emailLabel: 'Email Address (For MP3 Delivery)',
        elementLabel: 'Primary Energy Element',
        elements: [
            { value: '금(金)', label: 'Metal (金) - Diamond / Decision' },
            { value: '목(木)', label: 'Wood (木) - Forest / Growth / Creativity' },
            { value: '화(火)', label: 'Fire (火) - Sun / Passion / Expansion' },
            { value: '토(土)', label: 'Earth (土) - Ground / Embrace / Stability' },
            { value: '수(水)', label: 'Water (水) - Deep Ocean / Wisdom / Fluidity' },
        ],
        frequencyLabel: 'Target Healing Frequency',
        frequencies: [
            { value: '432Hz', label: '432Hz (Cosmic Pulse, Deep Relaxation)' },
            { value: '528Hz', label: '528Hz (Miracle Tone, Cellular Restoration)' },
        ],
        themeLabel: 'Desired Healing Theme',
        themes: [
            { id: '수면/휴식', label: '🌙 Deep Sleep & Burnout Recovery' },
            { id: '초집중/영감', label: '💡 Deep Focus & Creative Flow' },
            { id: '감정정화', label: '🧘 Anxiety & Stress Release' },
            { id: '풍요/확장', label: '💎 Abundance & Self-Confidence' },
        ],
        messageLabel: 'Message to the Author & Sound Team (Optional)',
        messagePlaceholder: 'Share any emotional challenges or changes you wish to experience.',
        submitBtn: 'Submit Free 1:1 Healing Song Request',
        submitting: 'Submitting request to server...',
        successTitle: 'Your Request Was Successfully Received!',
        receiptLabel: 'Receipt Number:',
        successDesc: (name: string, el: string, freq: string) => `Composition initiated for ${name} based on ${el} energy & ${freq}`,
        successEmailNotice: (email: string) => `A high-res mastered MP3 file and frequency guide will be securely delivered to your email (${email}) within 2-3 days.`,
        closeBtn: 'Confirm & Close',
        serverError: 'An error occurred while connecting to the server. Please try again.'
    },
    jp: {
        badge: '読者第1位特典',
        title: '1:1 献呈ヒーリングソング無料作曲',
        intro: '🎵 本書2p・308p収録特典：読者様のエネルギー気質と周波数を精密分析し、世界に一つだけの専用癒やし音源を作曲してプレゼントします。',
        nameLabel: 'お申込者氏名',
        namePlaceholder: 'お名前を入力',
        emailLabel: 'メールアドレス (MP3受取用)',
        elementLabel: '五行気質 (エレメント)',
        elements: [
            { value: '금(金)', label: '金 (Metal) - 決断 / ダイヤモンド' },
            { value: '목(木)', label: '木 (Wood) - 森林 / 成長 / 創造' },
            { value: '화(火)', label: '火 (Fire) - 太陽 / 情熱 / 拡張' },
            { value: '토(土)', label: '土 (Earth) - 大地 / 包容 / 安定' },
            { value: '수(水)', label: '水 (Water) - 深海 / 知恵 / 柔軟' },
        ],
        frequencyLabel: '希望治癒周波数',
        frequencies: [
            { value: '432Hz', label: '432Hz (宇宙の脈拍、深い弛緩)' },
            { value: '528Hz', label: '528Hz (奇跡の周波数、再生)' },
        ],
        themeLabel: '希望ヒーリングテーマ',
        themes: [
            { id: '수면/휴식', label: '🌙 深い睡眠＆バーンアウト回復' },
            { id: '초집중/영감', label: '💡 超集中＆インスピレーション' },
            { id: '감정정화', label: '🧘 不安・怒り・焦りの浄化' },
            { id: '풍요/확장', label: '💎 豊かさ＆自己確信の増幅' },
        ],
        messageLabel: '著者および制作チームへのメッセージ (任意)',
        messagePlaceholder: '現在のお悩みや望む変化をご自由にご記入ください。',
        submitBtn: '1:1 献呈ヒーリングソング無料作曲を申し込む',
        submitting: '送信中...',
        successTitle: 'お申し込みを受け付けました！',
        receiptLabel: '受付番号:',
        successDesc: (name: string, el: string, freq: string) => `${name}様の${el}気質に基づく${freq}音源の制作を開始しました`,
        successEmailNotice: (email: string) => `ご登録いただいたメールアドレス(${email})へ2〜3日以内に高音質MP3と解説書をお送りします。`,
        closeBtn: '確認して閉じる',
        serverError: 'サーバー通信中にエラーが発生しました。再度お試しください。'
    },
    cn: {
        badge: '读者TOP 1特权',
        title: '1:1 专属献礼疗愈曲免费定制',
        intro: '🎵 图书第2页与第308页特权：精准分析读者的能量特质与共振频率，专为您打造独一无二的心灵疗愈专属音频。',
        nameLabel: '申请人姓名',
        namePlaceholder: '请输入姓名',
        emailLabel: '电子邮箱 (用于接收MP3文件)',
        elementLabel: '核心能量五行',
        elements: [
            { value: '금(金)', label: '金 - 钻石 / 决断' },
            { value: '목(木)', label: '木 - 森林 / 生长 / 创造' },
            { value: '화(火)', label: '火 - 太阳 / 热情 / 绽放' },
            { value: '토(土)', label: '土 - 大地 / 包容 / 稳重' },
            { value: '수(水)', label: '水 - 深海 / 智慧 / 灵动' },
        ],
        frequencyLabel: '目标疗愈频率',
        frequencies: [
            { value: '432Hz', label: '432Hz (宇宙脉搏，深度放松)' },
            { value: '528Hz', label: '528Hz (奇迹频率，身心修复)' },
        ],
        themeLabel: '期望疗愈主题',
        themes: [
            { id: '수면/휴식', label: '🌙 深度睡眠与精力复原' },
            { id: '초집중/영감', label: '💡 深度专注与灵感迸发' },
            { id: '감정정화', label: '🧘 焦虑不安与浮躁净化' },
            { id: '풍요/확장', label: '💎 富足心境与自信建立' },
        ],
        messageLabel: '给作者与音频制作团队的留言 (可选)',
        messagePlaceholder: '请简述您目前的心理困惑或所期望的转变。',
        submitBtn: '提交 1:1 专属疗愈歌曲免费定制申请',
        submitting: '正在向服务器提交申请...',
        successTitle: '您的申请已成功提交！',
        receiptLabel: '受理单号:',
        successDesc: (name: string, el: string, freq: string) => `已启动为 ${name} 定制的基于 ${el} 特质与 ${freq} 频率的音频创作`,
        successEmailNotice: (email: string) => `高保真母带MP3音频及频率解读手册将于2~3天内发送至您的邮箱(${email})。`,
        closeBtn: '确认并关闭',
        serverError: '连接服务器时出现异常，请稍后重试。'
    }
};

export default function HealingSongApplyModal({
    isOpen,
    onClose,
    defaultName = '',
    defaultOrder = ''
}: HealingSongApplyModalProps) {
    const [name, setName] = useState(defaultName || '');
    const [email, setEmail] = useState('');
    const [element, setElement] = useState('금(金)');
    const [frequency, setFrequency] = useState('432Hz');
    const [theme, setTheme] = useState('수면/휴식');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [receiptCode, setReceiptCode] = useState('');

    useEffect(() => {
        if (defaultName) setName(defaultName);
        if (typeof window !== 'undefined') {
            const savedReceipt = localStorage.getItem('myeongsim_healing_song_receipt');
            if (savedReceipt) {
                setReceiptCode(savedReceipt);
            }
        }
    }, [defaultName]);

    const { language } = useLanguage();
    const t = HEALING_SONG_I18N[language as keyof typeof HEALING_SONG_I18N] || HEALING_SONG_I18N.kr;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/library/apply-healing-song', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone: '',
                    element,
                    frequency,
                    theme,
                    message,
                    orderNumber: defaultOrder
                })
            });
            const data = await res.json();
            if (data.success) {
                const code = data.receiptCode;
                setReceiptCode(code);
                setIsSubmitted(true);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_healing_song_applied', 'true');
                    localStorage.setItem('myeongsim_healing_song_receipt', code);
                    localStorage.setItem('myeongsim_healing_song_data', JSON.stringify({
                        name,
                        email,
                        element,
                        frequency,
                        theme,
                        message,
                        receiptCode: code,
                        appliedAt: new Date().toISOString()
                    }));
                }
            } else {
                setSubmitError(data.message || t.serverError);
            }
        } catch (err) {
            setSubmitError(t.serverError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-[#111C2F] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-5 overflow-hidden relative"
            >
                {/* 상단 장식 빛 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* 헤더 */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                            <Music size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-400/20">
                                {t.badge}
                            </span>
                            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                                {t.title}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                        <p className="text-[11px] text-gray-300 leading-relaxed bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl font-medium">
                            {t.intro}
                        </p>

                        {/* 이름 & 연락처 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">{t.nameLabel}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t.namePlaceholder}
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">{t.emailLabel}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* 사주 일간 & 주파수 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">{t.elementLabel}</label>
                                <select
                                    value={element}
                                    onChange={(e) => setElement(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium cursor-pointer"
                                >
                                    {t.elements.map((el) => (
                                        <option key={el.value} value={el.value}>{el.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">{t.frequencyLabel}</label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium cursor-pointer"
                                >
                                    {t.frequencies.map((fq) => (
                                        <option key={fq.value} value={fq.value}>{fq.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 치유 테마 */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-300">{t.themeLabel}</label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {t.themes.map((th) => (
                                    <button
                                        key={th.id}
                                        type="button"
                                        onClick={() => setTheme(th.id)}
                                        className={`p-2 rounded-xl text-[11px] font-bold transition-all text-left border cursor-pointer ${
                                            theme === th.id
                                                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm'
                                                : 'bg-[#0a111c] border-white/10 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {th.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 추가 요청 사항 */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-300">{t.messageLabel}</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t.messagePlaceholder}
                                rows={2}
                                className="w-full p-2.5 rounded-xl bg-[#0a111c] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs resize-none"
                            />
                        </div>

                        {submitError && (
                            <p className="text-red-400 text-xs text-center font-bold bg-red-950/30 p-2 rounded-lg border border-red-500/20">
                                ⚠️ {submitError}
                            </p>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
                        >
                            <Send size={14} className={isSubmitting ? "animate-spin" : ""} />
                            <span>{isSubmitting ? t.submitting : t.submitBtn}</span>
                        </button>
                    </form>
                ) : (
                    /* 접수 완료 화면 */
                    <div className="py-6 space-y-4 text-center">
                        <div className="size-16 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 animate-bounce">
                            <Sparkles size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white">
                                {t.successTitle}
                            </h3>
                            <p className="text-xs text-gray-300">
                                {t.receiptLabel} <span className="font-mono text-purple-300 font-bold">{receiptCode}</span>
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-gray-300 space-y-2">
                            <p className="font-bold text-white flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                <span>{t.successDesc(name, element, frequency)}</span>
                            </p>
                            <p className="text-[11px] leading-relaxed text-gray-400">
                                {t.successEmailNotice(email)}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                            {t.closeBtn}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

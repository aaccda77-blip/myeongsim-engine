'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, ZoomIn, ZoomOut, Volume2, VolumeX, Pause, Play, Square,
    Type, AlignLeft, AlignJustify, List, Moon, Sun, Bookmark, Check,
    Maximize2, Minimize2, Sparkles, ChevronLeft, ChevronRight, Settings2, RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { markTextbookRead } from '@/lib/questUnlockManager';

interface Chapter {
    id: string;
    title: string;
    page: string;
    content: string;
}

interface RefinedEBookReaderProps {
    chapters: Chapter[];
    buyerName: string;
    orderNumber: string;
    serialKey: string;
    purchaseDate: string;
    onReportSecurityAlert: (msg: string) => void;
}

// 🎨 5대 시력보호 명품 테마 프리셋
export const READER_THEMES = [
    {
        id: 'dark',
        name: '미드나잇 다크',
        icon: '🌙',
        bg: '#0c121e',
        cardBg: '#111a2c',
        text: '#e2e8f0',
        subText: '#94a3b8',
        border: 'rgba(255,255,255,0.08)',
        accent: '#f59e0b',
        watermark: 'rgba(255, 255, 255, 0.035)', // 독자 배려 3.5% 극저조도
        barBg: 'rgba(15, 23, 42, 0.95)'
    },
    {
        id: 'cream',
        name: '페이퍼 크림',
        icon: '📜',
        bg: '#F8F4EC',
        cardBg: '#FAF6EE',
        text: '#2c251d',
        subText: '#685e52',
        border: 'rgba(92, 70, 44, 0.12)',
        accent: '#b45309',
        watermark: 'rgba(92, 70, 44, 0.028)', // 2.8% 은은한 종이 질감
        barBg: 'rgba(248, 244, 236, 0.95)'
    },
    {
        id: 'sepia',
        name: '클래식 세피아',
        icon: '🍂',
        bg: '#EDE4D3',
        cardBg: '#F2EADB',
        text: '#362d22',
        subText: '#6b5c4b',
        border: 'rgba(84, 60, 32, 0.14)',
        accent: '#92400e',
        watermark: 'rgba(84, 60, 32, 0.03)', // 3%
        barBg: 'rgba(237, 228, 211, 0.95)'
    },
    {
        id: 'green',
        name: '올리브 말차',
        icon: '🍃',
        bg: '#EAF0E8',
        cardBg: '#EFF5ED',
        text: '#1f2e24',
        subText: '#4d6354',
        border: 'rgba(34, 74, 48, 0.12)',
        accent: '#15803d',
        watermark: 'rgba(34, 74, 48, 0.028)', // 2.8%
        barBg: 'rgba(234, 240, 232, 0.95)'
    },
    {
        id: 'black',
        name: 'OLED 트루블랙',
        icon: '⬛',
        bg: '#000000',
        cardBg: '#080808',
        text: '#cbd5e1',
        subText: '#64748b',
        border: 'rgba(255,255,255,0.12)',
        accent: '#38bdf8',
        watermark: 'rgba(255, 255, 255, 0.025)', // 2.5%
        barBg: 'rgba(0, 0, 0, 0.95)'
    }
];

// 🌐 4개 국어 리더기 다국어 사전
const READER_I18N = {
    kr: {
        toc: '목차',
        tocTooltip: '전체 목차 열람',
        bookmarkTooltip: '이 페이지 책갈피',
        chapterLabel: '챕터',
        ttsListen: '듣기',
        ttsReading: '낭독중',
        ttsResume: '이어듣기',
        ttsTooltipPlay: 'AI 오디오북 음성 낭독',
        ttsTooltipPause: '오디오북 일시정지',
        ttsTooltipStop: '오디오북 정지',
        ttsUnsupported: '이 브라우저는 오디오북 음성 낭독 기능을 지원하지 않습니다.',
        settingsTooltip: '독서 설정 (테마, 글꼴, 크기)',
        themeTitle: '🎨 시력 보호 테마 선택 (밀리의 서재 / 교보 스타일)',
        fontLabel: '서체',
        fontSerif: '명조체',
        fontSans: '고딕체',
        fontSizeLabel: '글자 크기',
        lineHeightLabel: '줄간격',
        lineTight: '좁게',
        lineNormal: '보통',
        lineWide: '넓게',
        bookBy: '《ZERO POINT》 by 이경윤 (청류)',
        copyAlert: '⚠️ 복사 불가: 본 도서는 저작권법 제136조에 의해 무단 전재가 엄격히 차단됩니다.',
        prevChapter: '이전 챕터',
        nextChapter: '다음 챕터',
        tocModalTitle: '전체 도서 목차 (총 309p)',
        closeBtn: '✕ 닫기',
        themes: {
            dark: '다크',
            cream: '크림',
            sepia: '세피아',
            green: '말차',
            black: '블랙'
        }
    },
    en: {
        toc: 'TOC',
        tocTooltip: 'View Table of Contents',
        bookmarkTooltip: 'Bookmark this page',
        chapterLabel: 'Chapter',
        ttsListen: 'Listen',
        ttsReading: 'Reading',
        ttsResume: 'Resume',
        ttsTooltipPlay: 'AI Audiobook Speech',
        ttsTooltipPause: 'Pause Audiobook',
        ttsTooltipStop: 'Stop Audiobook',
        ttsUnsupported: 'Your browser does not support audio speech synthesis.',
        settingsTooltip: 'Reading Settings (Theme, Font, Size)',
        themeTitle: '🎨 Eye-Care Themes Preset',
        fontLabel: 'Font',
        fontSerif: 'Serif',
        fontSans: 'Sans',
        fontSizeLabel: 'Font Size',
        lineHeightLabel: 'Line Height',
        lineTight: 'Tight',
        lineNormal: 'Normal',
        lineWide: 'Wide',
        bookBy: '《ZERO POINT》 by Kyeong-Yoon Lee (Cheongryu)',
        copyAlert: '⚠️ Copy Restricted: Unauthorized reproduction is strictly prohibited under Copyright Law.',
        prevChapter: 'Previous',
        nextChapter: 'Next',
        tocModalTitle: 'Table of Contents (309p)',
        closeBtn: '✕ Close',
        themes: {
            dark: 'Dark',
            cream: 'Cream',
            sepia: 'Sepia',
            green: 'Matcha',
            black: 'Black'
        }
    },
    jp: {
        toc: '目次',
        tocTooltip: '全目次を表示',
        bookmarkTooltip: 'このページにしおりを挟む',
        chapterLabel: '章',
        ttsListen: '朗読',
        ttsReading: '朗読中',
        ttsResume: '再開',
        ttsTooltipPlay: 'AIオーディオブック音声朗読',
        ttsTooltipPause: 'オーディオブック一時停止',
        ttsTooltipStop: 'オーディオブック停止',
        ttsUnsupported: 'お使いのブラウザは音声朗読に対応していません。',
        settingsTooltip: '読書設定 (テーマ、フォント、サイズ)',
        themeTitle: '🎨 視力保護テーマ選択',
        fontLabel: '書体',
        fontSerif: '明朝体',
        fontSans: 'ゴシック体',
        fontSizeLabel: '文字サイズ',
        lineHeightLabel: '行間',
        lineTight: '狭い',
        lineNormal: '普通',
        lineWide: '広い',
        bookBy: '《ZERO POINT》 李京潤 (晴流)',
        copyAlert: '⚠️ コピー不可: 著作権法に基づき無断転載は厳格に禁止されています。',
        prevChapter: '前の章',
        nextChapter: '次の章',
        tocModalTitle: '図書目次 (全309p)',
        closeBtn: '✕ 閉じる',
        themes: {
            dark: 'ダーク',
            cream: 'クリーム',
            sepia: 'セピア',
            green: '抹茶',
            black: 'ブラック'
        }
    },
    cn: {
        toc: '目录',
        tocTooltip: '查看完整目录',
        bookmarkTooltip: '书签此页',
        chapterLabel: '章',
        ttsListen: '朗读',
        ttsReading: '朗读中',
        ttsResume: '继续',
        ttsTooltipPlay: 'AI有声书语音朗读',
        ttsTooltipPause: '暂停朗读',
        ttsTooltipStop: '停止朗读',
        ttsUnsupported: '该浏览器不支持语音朗读功能。',
        settingsTooltip: '阅读设置 (主题、字体、字号)',
        themeTitle: '🎨 护眼阅读主题选择',
        fontLabel: '字体',
        fontSerif: '宋体',
        fontSans: '黑体',
        fontSizeLabel: '字号大小',
        lineHeightLabel: '行间距',
        lineTight: '紧凑',
        lineNormal: '标准',
        lineWide: '宽松',
        bookBy: '《ZERO POINT》 李京润 (晴流)',
        copyAlert: '⚠️ 禁止复制: 根据版权法严禁未经授权擅自转载与复制。',
        prevChapter: '上一章',
        nextChapter: '下一章',
        tocModalTitle: '图书完整目录 (共309页)',
        closeBtn: '✕ 关闭',
        themes: {
            dark: '暗黑',
            cream: '米黄',
            sepia: '复古',
            green: '抹茶',
            black: '纯黑'
        }
    }
};

export default function RefinedEBookReader({
    chapters,
    buyerName,
    orderNumber,
    serialKey,
    purchaseDate,
    onReportSecurityAlert
}: RefinedEBookReaderProps) {
    const { language } = useLanguage();
    const t = READER_I18N[language as keyof typeof READER_I18N] || READER_I18N.kr;

    // 1. 독서 뷰어 상태
    const [themeId, setThemeId] = useState<'dark' | 'cream' | 'sepia' | 'green' | 'black'>('dark');
    const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
    const [fontSize, setFontSize] = useState<number>(16);
    const [lineHeight, setLineHeight] = useState<number>(2.0);
    const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
    const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
    const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);

    // 2. 챕터 및 북마크
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
    const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);

    // 3. AI 오디오북 (TTS) 상태
    const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);
    const [isTtsPaused, setIsTtsPaused] = useState<boolean>(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

    const currentTheme = READER_THEMES.find(t => t.id === themeId) || READER_THEMES[0];
    const currentChapter = chapters[currentChapterIndex] || chapters[0];

    // 로컬 스토리지에서 최근 읽던 위치 복원
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedChapterId = localStorage.getItem('myeongsim_reader_last_chapter');
            if (savedChapterId) {
                const foundIdx = chapters.findIndex(c => c.id === savedChapterId);
                if (foundIdx !== -1) setCurrentChapterIndex(foundIdx);
            }
            const savedTheme = localStorage.getItem('myeongsim_reader_theme') as any;
            if (savedTheme) setThemeId(savedTheme);
            const savedFont = localStorage.getItem('myeongsim_reader_font') as any;
            if (savedFont) setFontFamily(savedFont);
            const savedSize = localStorage.getItem('myeongsim_reader_fontsize');
            if (savedSize) setFontSize(Number(savedSize));
        }
    }, [chapters]);

    // 챕터 변경 시 읽던 위치 자동 저장
    const handleChapterChange = (index: number) => {
        if (index < 0 || index >= chapters.length) return;
        stopTts();
        setCurrentChapterIndex(index);
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_reader_last_chapter', chapters[index].id);
        }
        setShowTocDrawer(false);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // 테마 변경 저장
    const handleThemeSelect = (id: typeof themeId) => {
        setThemeId(id);
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_reader_theme', id);
        }
    };

    // 글자 크기 변경 저장
    const handleFontSizeChange = (delta: number) => {
        setFontSize(prev => {
            const next = Math.max(13, Math.min(24, prev + delta));
            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_reader_fontsize', String(next));
            }
            return next;
        });
    };

    // ── 4. AI 오디오북 (Web Speech TTS) ──
    const startTts = () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert(t.ttsUnsupported);
            return;
        }

        window.speechSynthesis.cancel();
        const textToRead = `${currentChapter.title}. ${currentChapter.content}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'en' ? 'en-US' : language === 'jp' ? 'ja-JP' : language === 'cn' ? 'zh-CN' : 'ko-KR';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            setIsTtsPlaying(false);
            setIsTtsPaused(false);
        };
        utterance.onerror = () => {
            setIsTtsPlaying(false);
            setIsTtsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
        synthRef.current = window.speechSynthesis;
        utterRef.current = utterance;
        setIsTtsPlaying(true);
        setIsTtsPaused(false);
    };

    const pauseTts = () => {
        if (window.speechSynthesis && isTtsPlaying) {
            window.speechSynthesis.pause();
            setIsTtsPaused(true);
        }
    };

    const resumeTts = () => {
        if (window.speechSynthesis && isTtsPaused) {
            window.speechSynthesis.resume();
            setIsTtsPaused(false);
        }
    };

    const stopTts = () => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsTtsPlaying(false);
        setIsTtsPaused(false);
    };

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // 북마크 토글
    const toggleBookmark = () => {
        setBookmarkedChapters(prev => 
            prev.includes(currentChapter.id) 
                ? prev.filter(id => id !== currentChapter.id)
                : [...prev, currentChapter.id]
        );
    };

    return (
        <div 
            className="w-full rounded-3xl transition-colors duration-300 relative overflow-hidden shadow-2xl border text-left"
            style={{ 
                backgroundColor: currentTheme.bg, 
                borderColor: currentTheme.border,
                color: currentTheme.text 
            }}
        >
            {/* ── 1. 리더기 상단 퀵 컨트롤 툴바 (밀리의 서재 / 교보 스타일) ── */}
            <div 
                className="sticky top-0 z-30 px-3.5 py-2.5 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-300"
                style={{ 
                    backgroundColor: currentTheme.barBg, 
                    borderColor: currentTheme.border 
                }}
            >
                {/* 좌측: 목차 열기 & 북마크 */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setShowTocDrawer(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: currentTheme.cardBg, 
                            borderColor: currentTheme.border,
                            color: currentTheme.text 
                        }}
                        title={t.tocTooltip}
                    >
                        <List size={14} style={{ color: currentTheme.accent }} />
                        <span className="text-[11px]">{t.toc}</span>
                    </button>

                    <button
                        onClick={toggleBookmark}
                        className="p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: currentTheme.cardBg, 
                            borderColor: currentTheme.border,
                            color: bookmarkedChapters.includes(currentChapter.id) ? currentTheme.accent : currentTheme.subText
                        }}
                        title={t.bookmarkTooltip}
                    >
                        <Bookmark size={14} fill={bookmarkedChapters.includes(currentChapter.id) ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* 중앙: 챕터 및 진행률 인디케이터 */}
                <div className="text-center px-2 flex-1 min-w-0">
                    <span className="text-[11px] font-bold truncate block" style={{ color: currentTheme.text }}>
                        {currentChapter.title}
                    </span>
                    <span className="text-[9px] font-mono block" style={{ color: currentTheme.subText }}>
                        {currentChapterIndex + 1} / {chapters.length} {t.chapterLabel} ({currentChapter.page})
                    </span>
                </div>

                {/* 우측: TTS 오디오북 & 뷰어 설정 버튼 */}
                <div className="flex items-center gap-1.5">
                    {/* TTS 오디오북 컨트롤 버튼 */}
                    <button
                        onClick={isTtsPlaying ? (isTtsPaused ? resumeTts : pauseTts) : startTts}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: isTtsPlaying ? currentTheme.accent : currentTheme.cardBg, 
                            borderColor: currentTheme.border,
                            color: isTtsPlaying ? '#ffffff' : currentTheme.text 
                        }}
                        title={isTtsPlaying ? t.ttsTooltipPause : t.ttsTooltipPlay}
                    >
                        {isTtsPlaying ? (
                            isTtsPaused ? <Play size={13} /> : <Pause size={13} />
                        ) : (
                            <Volume2 size={13} style={{ color: currentTheme.accent }} />
                        )}
                        <span className="text-[10px] font-bold">
                            {isTtsPlaying ? (isTtsPaused ? t.ttsResume : t.ttsReading) : t.ttsListen}
                        </span>
                    </button>

                    {isTtsPlaying && (
                        <button
                            onClick={stopTts}
                            className="p-1.5 rounded-xl text-xs border cursor-pointer"
                            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border, color: currentTheme.subText }}
                            title={t.ttsTooltipStop}
                        >
                            <Square size={11} />
                        </button>
                    )}

                    {/* 설정 드로어 토글 */}
                    <button
                        onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                        className="p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: currentTheme.cardBg, 
                            borderColor: currentTheme.border,
                            color: showSettingsDrawer ? currentTheme.accent : currentTheme.text 
                        }}
                        title={t.settingsTooltip}
                    >
                        <Settings2 size={14} />
                    </button>
                </div>
            </div>

            {/* ── 2. 설정 바 (테마/폰트/크기 드로어) ── */}
            <AnimatePresence>
                {showSettingsDrawer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b px-4 py-3 space-y-3 transition-colors duration-300 text-xs"
                        style={{ 
                            backgroundColor: currentTheme.cardBg, 
                            borderColor: currentTheme.border 
                        }}
                    >
                        {/* 테마 색상 5종 셀렉터 */}
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: currentTheme.subText }}>
                                <span>{t.themeTitle}</span>
                            </span>
                            <div className="grid grid-cols-5 gap-1.5">
                                {READER_THEMES.map((th) => (
                                    <button
                                        key={th.id}
                                        onClick={() => handleThemeSelect(th.id as any)}
                                        className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 border transition-all cursor-pointer ${
                                            themeId === th.id ? 'ring-2 ring-offset-1' : ''
                                        }`}
                                        style={{ 
                                            backgroundColor: th.bg, 
                                            color: th.text, 
                                            borderColor: th.border,
                                            boxShadow: themeId === th.id ? `0 0 10px ${th.accent}40` : 'none'
                                        }}
                                    >
                                        <span>{th.icon}</span>
                                        <span className="text-[9px] truncate">{t.themes[th.id as keyof typeof t.themes] || th.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 서체 & 줄간격 & 글자크기 */}
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: currentTheme.border }}>
                            {/* 서체 토글 (명조 vs 고딕) */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold" style={{ color: currentTheme.subText }}>{t.fontLabel}</span>
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        onClick={() => setFontFamily('serif')}
                                        className={`py-1.5 rounded-lg text-xs font-serif font-bold border transition-all cursor-pointer ${
                                            fontFamily === 'serif' ? 'font-black' : ''
                                        }`}
                                        style={{ 
                                            backgroundColor: currentTheme.bg, 
                                            color: fontFamily === 'serif' ? currentTheme.accent : currentTheme.text,
                                            borderColor: fontFamily === 'serif' ? currentTheme.accent : currentTheme.border 
                                        }}
                                    >
                                        {t.fontSerif}
                                    </button>
                                    <button
                                        onClick={() => setFontFamily('sans')}
                                        className={`py-1.5 rounded-lg text-xs font-sans font-bold border transition-all cursor-pointer ${
                                            fontFamily === 'sans' ? 'font-black' : ''
                                        }`}
                                        style={{ 
                                            backgroundColor: currentTheme.bg, 
                                            color: fontFamily === 'sans' ? currentTheme.accent : currentTheme.text,
                                            borderColor: fontFamily === 'sans' ? currentTheme.accent : currentTheme.border 
                                        }}
                                    >
                                        {t.fontSans}
                                    </button>
                                </div>
                            </div>

                            {/* 글자 크기 조절 */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold" style={{ color: currentTheme.subText }}>{t.fontSizeLabel}</span>
                                <div className="flex items-center justify-between p-1 rounded-lg border" style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}>
                                    <button
                                        onClick={() => handleFontSizeChange(-1)}
                                        className="size-6 rounded flex items-center justify-center font-bold text-xs"
                                        style={{ color: currentTheme.text }}
                                    >
                                        <ZoomOut size={12} />
                                    </button>
                                    <span className="text-xs font-mono font-bold" style={{ color: currentTheme.accent }}>
                                        {fontSize}px
                                    </span>
                                    <button
                                        onClick={() => handleFontSizeChange(1)}
                                        className="size-6 rounded flex items-center justify-center font-bold text-xs"
                                        style={{ color: currentTheme.text }}
                                    >
                                        <ZoomIn size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* 줄간격 토글 */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold" style={{ color: currentTheme.subText }}>{t.lineHeightLabel}</span>
                                <div className="grid grid-cols-3 gap-0.5">
                                    {[1.7, 2.0, 2.3].map((lh) => (
                                        <button
                                            key={lh}
                                            onClick={() => setLineHeight(lh)}
                                            className={`py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer`}
                                            style={{ 
                                                backgroundColor: currentTheme.bg, 
                                                color: lineHeight === lh ? currentTheme.accent : currentTheme.subText,
                                                borderColor: lineHeight === lh ? currentTheme.accent : currentTheme.border 
                                            }}
                                        >
                                            {lh === 1.7 ? t.lineTight : lh === 2.0 ? t.lineNormal : t.lineWide}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── 3. 전자책 본문 컨테이너 (정밀 워터마크 레이어) ── */}
            <div className="relative p-6 sm:p-8 space-y-6 select-none transition-colors duration-300">
                {/* 독자 배려형 초은은한 대각선 포렌식 워터마크 */}
                <div 
                    className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-around select-none text-[9.5px] font-mono tracking-widest overflow-hidden opacity-90"
                    style={{ 
                        transform: 'rotate(-16deg) scale(1.1)',
                        color: currentTheme.watermark
                    }}
                >
                    {[1, 2, 3, 4].map((row) => (
                        <div key={row} className="whitespace-nowrap flex justify-around opacity-80">
                            <span>CHEONGRYU DRM • {buyerName || 'VIP'} • {orderNumber || 'LICENSED'}</span>
                            <span className="hidden sm:inline">PROTECTED EDITION • {serialKey || 'CR-DRM'}</span>
                        </div>
                    ))}
                </div>

                {/* 챕터 타이틀 & 페이지 배지 */}
                <div className="border-b pb-4 relative z-20 space-y-2" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center justify-between">
                        <span 
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                            style={{ 
                                backgroundColor: currentTheme.cardBg, 
                                color: currentTheme.accent,
                                borderColor: currentTheme.border 
                            }}
                        >
                            {currentChapter.page}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: currentTheme.subText }}>
                            {t.bookBy}
                        </span>
                    </div>
                    <h2 
                        className={`text-lg sm:text-xl font-black leading-snug tracking-tight ${
                            fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                        }`}
                        style={{ color: currentTheme.text }}
                    >
                        {currentChapter.title}
                    </h2>
                </div>

                {/* 본문 텍스트 (명조/고딕, 줄간격, 글자크기 실시간 반영) */}
                <article 
                    className={`whitespace-pre-line relative z-20 select-none transition-all duration-200 ${
                        fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                    } ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}
                    style={{ 
                        fontSize: `${fontSize}px`, 
                        lineHeight: lineHeight,
                        color: currentTheme.text,
                        userSelect: 'none', 
                        WebkitUserSelect: 'none' 
                    }}
                    onCopy={(e) => {
                        e.preventDefault();
                        onReportSecurityAlert(t.copyAlert);
                    }}
                >
                    {currentChapter.content}
                </article>

                {/* ── 4. 하단 네비게이션 & 이전/다음 챕터 버튼 ── */}
                <div className="pt-6 border-t flex items-center justify-between gap-3 relative z-20" style={{ borderColor: currentTheme.border }}>
                    <button
                        onClick={() => handleChapterChange(currentChapterIndex - 1)}
                        disabled={currentChapterIndex === 0}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: currentTheme.cardBg, 
                            borderColor: currentTheme.border,
                            color: currentTheme.text 
                        }}
                    >
                        <ChevronLeft size={16} />
                        <span>{t.prevChapter}</span>
                    </button>

                    <span className="text-xs font-mono font-bold" style={{ color: currentTheme.subText }}>
                        {currentChapterIndex + 1} / {chapters.length}
                    </span>

                    <button
                        onClick={() => handleChapterChange(currentChapterIndex + 1)}
                        disabled={currentChapterIndex === chapters.length - 1}
                        className="px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                        style={{ 
                            backgroundColor: currentTheme.accent, 
                            color: themeId === 'cream' || themeId === 'sepia' ? '#ffffff' : '#0a0f1d' 
                        }}
                    >
                        <span>{t.nextChapter}</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* ── 5. 목차(TOC) 퀵 네비게이션 드로어 ── */}
            <AnimatePresence>
                {showTocDrawer && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        onClick={() => setShowTocDrawer(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-3xl p-5 border shadow-2xl space-y-4 max-h-[80vh] flex flex-col text-left"
                            style={{ 
                                backgroundColor: currentTheme.cardBg, 
                                borderColor: currentTheme.border,
                                color: currentTheme.text 
                            }}
                        >
                            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.border }}>
                                <div className="flex items-center gap-2">
                                    <List size={18} style={{ color: currentTheme.accent }} />
                                    <h3 className="text-base font-black">{t.tocModalTitle}</h3>
                                </div>
                                <button
                                    onClick={() => setShowTocDrawer(false)}
                                    className="p-1 rounded-lg hover:opacity-80 text-xs font-bold"
                                >
                                    {t.closeBtn}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                {chapters.map((ch, idx) => {
                                    const isCurrent = idx === currentChapterIndex;
                                    return (
                                        <div
                                            key={ch.id}
                                            onClick={() => handleChapterChange(idx)}
                                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                                isCurrent ? 'ring-1' : 'hover:opacity-80'
                                            }`}
                                            style={{ 
                                                backgroundColor: isCurrent ? currentTheme.bg : 'transparent',
                                                borderColor: isCurrent ? currentTheme.accent : currentTheme.border,
                                                color: isCurrent ? currentTheme.accent : currentTheme.text 
                                            }}
                                        >
                                            <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                                                <p className="font-bold truncate">{ch.title}</p>
                                                <span className="text-[10px] font-mono" style={{ color: currentTheme.subText }}>{ch.page}</span>
                                            </div>
                                            {isCurrent && <Check size={14} style={{ color: currentTheme.accent }} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

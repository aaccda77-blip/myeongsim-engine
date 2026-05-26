'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FileText, ChevronLeft, ChevronRight, X, Heart, Sparkles, BookOpen, Menu, Search } from 'lucide-react';
import { saju108Matrix } from '@/data/saju108Matrix';
import { useReportStore } from '@/store/useReportStore';

interface Healing108CoachingReportProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
}

export default function Healing108CoachingReport({
    isOpen,
    onClose,
    userProfile
}: Healing108CoachingReportProps) {
    const { reportData } = useReportStore();
    const activeSaju = userProfile?.saju || reportData?.saju;

    // --- 108페이지 내비게이션 상태 ---
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); // [초고도화] 모바일 우선 대응을 위해 기본 false로 설정

    // 화면 너비 감지하여 PC에서는 기본적으로 사이드바를 열어주도록 조율
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            }
        }
    }, [isOpen]);

    // --- 오디오 (528Hz BGM) 상태 ---
    const [isPlayingBgm, setIsPlayingBgm] = useState(false);
    const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

    // --- 심호흡 가이드 (들숨/날숨/멈춤) 상태 ---
    const [isBreathingActive, setIsBreathingActive] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathingTimer, setBreathingTimer] = useState(5);
    const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 심호흡 단계별 음성 오디오 Ref
    const audioInhaleRef = useRef<HTMLAudioElement | null>(null);
    const audioHoldRef = useRef<HTMLAudioElement | null>(null);
    const audioExhaleRef = useRef<HTMLAudioElement | null>(null);

    // --- 인터랙티브 Socratic 답변 상태 & 진행도 ---
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recursiveConfirmed, setRecursiveConfirmed] = useState<Record<string, boolean>>({});

    // [NEW] 실시간 AI 개인화 생성형 백서 관련 상태
    const [aiPageContent, setAiPageContent] = useState<Record<string, { title: string; desc: string; socratic: string; recursive: string }>>({});
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // 108페이지 키 배열
    const pageKeys = Object.keys(saju108Matrix).sort();
    const currentPageKey = pageKeys[currentPageIndex];
    const currentPageData = saju108Matrix[currentPageKey];



    // 사용자별 고유 캐시 키 정의 (생년월일, 시간, 이름, 사주 글자 등을 결합하여 완벽한 격리 보장)
    const userKey = reportData?.birthDate 
        ? `${reportData.userName || 'user'}_${reportData.birthDate.replace(/[^0-9]/g, '')}_${(reportData.birthTime || '').replace(/[^0-9]/g, '')}` 
        : activeSaju
        ? `${activeSaju.dayMaster || 'guest'}_${activeSaju.tenGods?.self || 0}${activeSaju.tenGods?.output || 0}${activeSaju.tenGods?.wealth || 0}${activeSaju.tenGods?.power || 0}${activeSaju.tenGods?.resource || 0}`
        : 'guest';
    const answersKey = `ms_108_answers_${userKey}`;
    const confirmedKey = `ms_108_confirmed_${userKey}`;
    const aiContentKey = `ms_108_ai_content_${userKey}`; // AI 치유 본문 격리 캐시 키

    // --- 로컬스토리지 답변 및 AI 생성 데이터 로딩 & 자동 캐싱 ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cachedAnswers = localStorage.getItem(answersKey);
            const cachedConfirmed = localStorage.getItem(confirmedKey);
            const cachedAiContent = localStorage.getItem(aiContentKey);

            if (cachedAnswers) {
                setAnswers(JSON.parse(cachedAnswers));
            } else {
                setAnswers({}); // 다른 사용자로 전환 시 이전 답변이 묻어나는 현상 완벽 방지
            }
            if (cachedConfirmed) {
                setRecursiveConfirmed(JSON.parse(cachedConfirmed));
            } else {
                setRecursiveConfirmed({}); // 다른 사용자로 전환 시 자각 승인 초기화 및 갱신
            }
            if (cachedAiContent) {
                setAiPageContent(JSON.parse(cachedAiContent));
            } else {
                setAiPageContent({}); // 새로운 사용자 전환 시 AI 백서 생성 데이터 초기화 및 갱신
            }
        }
    }, [userKey]); // [초고도화] 사용자가 바뀌면 실시간으로 데이터를 분리 스위칭합니다.

    // [NEW] 페이지 진입 및 인덱스 변경 시, Gemini API와 온디맨드로 실시간 1대1 치유 콘텐츠를 작성하는 이펙트
    useEffect(() => {
        const triggerAiGeneration = async () => {
            if (!isOpen) return;

            // 1. 이미 캐시된 사용자 맞춤형 AI 콘텐츠가 있다면 즉시 로딩 없이 패스
            if (aiPageContent[currentPageKey]) return;

            // 2. 사주 데이터가 온전치 않은 비회원/체험 상태라면 무리한 서버 부하 방지를 위해 즉시 폴백
            if (!activeSaju) return;

            setIsGeneratingAi(true);

            try {
                const response = await fetch('/api/coaching/generate-108', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageKey: currentPageKey,
                        sajuData: activeSaju,
                        originalPage: currentPageData
                    })
                });

                if (!response.ok) throw new Error('108 AI Generation Failed');
                const data = await response.json();

                if (data.success && data.pageData) {
                    const updatedContent = {
                        ...aiPageContent,
                        [currentPageKey]: data.pageData
                    };
                    setAiPageContent(updatedContent);
                    localStorage.setItem(aiContentKey, JSON.stringify(updatedContent));
                }
            } catch (err) {
                console.warn('❌ [Gemini 108 API] 생성 오류로 인해 정적 템플릿 Fallback으로 우아하게 자동 대체합니다:', err);
            } finally {
                setIsGeneratingAi(false);
            }
        };

        triggerAiGeneration();
    }, [currentPageIndex, userKey, isOpen]);

    const handleAnswerChange = (pageKey: string, text: string) => {
        const updated = { ...answers, [pageKey]: text };
        setAnswers(updated);
        localStorage.setItem(answersKey, JSON.stringify(updated));
    };

    const handleConfirmRecursive = (pageKey: string) => {
        const updated = { ...recursiveConfirmed, [pageKey]: !recursiveConfirmed[pageKey] };
        setRecursiveConfirmed(updated);
        localStorage.setItem(confirmedKey, JSON.stringify(updated));

        // 햅틱 진동 피드백
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // --- 528Hz 평온 BGM 제어 ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/sounds/528hz_healing_bgm.mp3');
            audio.loop = true;
            audio.volume = 0.5;
            bgmAudioRef.current = audio;

            // 심호흡 음성 객체들
            audioInhaleRef.current = new Audio('/sounds/voice_inhale.mp3');
            audioHoldRef.current = new Audio('/sounds/voice_hold.mp3');
            audioExhaleRef.current = new Audio('/sounds/voice_exhale.mp3');
        }

        return () => {
            if (bgmAudioRef.current) {
                bgmAudioRef.current.pause();
                bgmAudioRef.current = null;
            }
            stopBreathing();
        };
    }, []);

    // 모달 켜지고 꺼질 때 BGM 페이드 제어
    useEffect(() => {
        if (isOpen) {
            if (bgmAudioRef.current && isPlayingBgm) {
                bgmAudioRef.current.play().catch(e => console.log('Audio autoplays blocked:', e));
            }
        } else {
            if (bgmAudioRef.current) {
                bgmAudioRef.current.pause();
            }
            stopBreathing();
        }
    }, [isOpen]);

    const toggleBgm = () => {
        if (!bgmAudioRef.current) return;
        if (isPlayingBgm) {
            bgmAudioRef.current.pause();
            setIsPlayingBgm(false);
        } else {
            bgmAudioRef.current.play().catch(e => console.log(e));
            setIsPlayingBgm(true);
        }
    };

    // --- 동기화 심호흡 가이드 로직 ---
    const startBreathing = () => {
        setIsBreathingActive(true);
        setBreathingPhase('inhale');
        setBreathingTimer(5);

        // 들숨 음성 첫 재생
        if (audioInhaleRef.current) {
            audioInhaleRef.current.play().catch(() => {});
        }
    };

    const stopBreathing = () => {
        setIsBreathingActive(false);
        if (breathingTimerRef.current) {
            clearInterval(breathingTimerRef.current);
            breathingTimerRef.current = null;
        }
    };

    const toggleBreathing = () => {
        if (isBreathingActive) {
            stopBreathing();
        } else {
            startBreathing();
        }
    };

    // 심호흡 페이즈 타이머 스레드
    useEffect(() => {
        if (!isBreathingActive) return;

        breathingTimerRef.current = setInterval(() => {
            setBreathingTimer(prev => {
                if (prev <= 1) {
                    // 페이즈 전환 로직
                    setBreathingPhase(currentPhase => {
                        let nextPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
                        if (currentPhase === 'inhale') {
                            nextPhase = 'hold';
                            if (audioHoldRef.current) audioHoldRef.current.play().catch(() => {});
                        } else if (currentPhase === 'hold') {
                            nextPhase = 'exhale';
                            if (audioExhaleRef.current) audioExhaleRef.current.play().catch(() => {});
                        } else {
                            nextPhase = 'inhale';
                            if (audioInhaleRef.current) audioInhaleRef.current.play().catch(() => {});
                        }
                        return nextPhase;
                    });
                    return 5; // 다시 5초 세팅
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (breathingTimerRef.current) {
                clearInterval(breathingTimerRef.current);
                breathingTimerRef.current = null;
            }
        };
    }, [isBreathingActive, breathingPhase]);

    // --- 기질데이터 실시간 템플릿 치환기 (resolveDynamicText) ---
    const getResolvedText = (text: string | undefined): string => {
        if (!text) return '';

        // 기본값(Fallback) 매핑 정의 - 사주 정보가 없거나 불완전할 때 사용
        const defaultValues = {
            SAJU_GANJI: '庚申년 癸未월 辛巳일 乙未시',
            DAY_MASTER_CHAR: '辛金',
            DAY_MASTER_ANALOGY: '눈부시게 맑고 예리한 은색 다이아몬드(辛金)',
            DAY_MASTER_SHORT_ANALOGY: '은빛 다이아몬드',
            KILLER_ELEMENT: '巳火',
            KILLER_ANALOGY: '내 머릿속의 가혹한 24시간 감시 카메라',
            KILLER_NAME: '정관',
            EXPRESSION_ELEMENT: '癸水',
            EXPRESSION_ANALOGY: '마음을 촉촉하게 식혀주는 맑은 은하수 오아시스',
            EXPRESSION_SHORT_ANALOGY: '맑은 은하수',
            EXPRESSION_NAME: '식신',
            DRYER_ELEMENT: '未土',
            DRYER_ANALOGY: '오아시스를 바짝 말려버리는 마음의 사막 모래바람',
            COMPETITOR_ELEMENT: '庚申',
            COMPETITOR_ANALOGY: '나를 끝없이 채찍질하는 경쟁의 그림자',
            COMPETITOR_NAME: '겁재',
            ASSET_ELEMENT: '乙木',
            ASSET_ANALOGY: '세상을 향해 싱그럽게 피어날 푸른 새싹의 꿈',
            ASSET_SHORT_ANALOGY: '푸른 새싹',
            ASSET_NAME: '편재',
            PRIMARY_CLASH: '乙辛沖(을신충)',
            CURRENT_DAEWOON_GANJI: '丁亥',
            CURRENT_DAEWOON_ANALOGY: '무한 은하수 파이프라인',
            YEAR_2025: '2025년 乙巳년',
            YEAR_2026: '2026년 丙午년',
            YEAR_2027: '2027년 丁未년',
            YEAR_2029: '2029년 己酉년'
        };

        if (!activeSaju) {
            // 사주 정보가 없을 경우, 태그들을 자연스러운 디폴트 텍스트로 치환
            let resolved = text;
            Object.entries(defaultValues).forEach(([key, val]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                resolved = resolved.replace(regex, val);
            });
            // 기존 레거시 태그 대응
            resolved = resolved.replace(/\{\{YEAR_PILLAR\}\}/g, '년주 기둥')
                               .replace(/\{\{MONTH_PILLAR\}\}/g, '월주 기둥')
                               .replace(/\{\{HOUR_PILLAR\}\}/g, '시주 기둥')
                               .replace(/\{\{DAY_MASTER\}\}/g, '나의 본질(일간)')
                               .replace(/\{\{WEAK_ELEMENT\}\}/g, '나를 보완해 주는 기운')
                               .replace(/\{\{GONGMANG\}\}/g, '공망 격리실')
                               .replace(/\{\{CURRENT_DAEWOON\}\}/g, '인생의 황금 대운')
                               .replace(/\{\{CURRENT_YEAR_GANJI\}\}/g, '올해의 천기 흐름');
            return resolved;
        }

        const saju = activeSaju;

        // --- 1. 일간(Day Master) 동적 매핑 ---
        const dmCharRaw = saju.dayMaster || '辛';
        const dmKey = dmCharRaw.charAt(0);

        const DAY_MASTER_MAP: Record<string, { full: string; short: string; char: string; color: string }> = {
            '甲': { full: '푸르고 곧게 뻗어가는 아름다운 소나무(甲木)', short: '소나무', char: '甲木', color: '초록빛' },
            '갑': { full: '푸르고 곧게 뻗어가는 아름다운 소나무(甲木)', short: '소나무', char: '甲木', color: '초록빛' },
            '乙': { full: '싱그럽고 유연하게 싹터 오르는 푸른 새싹(乙木)', short: '푸른 새싹', char: '乙木', color: '연두빛' },
            '을': { full: '싱그럽고 유연하게 싹터 오르는 푸른 새싹(乙木)', short: '푸른 새싹', char: '乙木', color: '연두빛' },
            '丙': { full: '만물을 따뜻하게 비추는 이글거리는 태양(丙火)', short: '뜨거운 태양', char: '丙火', color: '붉은빛' },
            '병': { full: '만물을 따뜻하게 비추는 이글거리는 태양(丙火)', short: '뜨거운 태양', char: '丙火', color: '붉은빛' },
            '丁': { full: '어둠 속을 고요하고 은은하게 밝히는 등대불(丁火)', short: '은은한 등대불', char: '丁火', color: '정화불빛' },
            '정': { full: '어둠 속을 고요하고 은은하게 밝히는 등대불(丁火)', short: '은은한 등대불', char: '丁火', color: '정화불빛' },
            '戊': { full: '우뚝 솟아 세상을 든든하게 지켜주는 광활한 태산(戊土)', short: '든든한 태산', char: '戊土', color: '황토빛' },
            '무': { full: '우뚝 솟아 세상을 든든하게 지켜주는 광활한 태산(戊土)', short: '든든한 태산', char: '戊土', color: '황토빛' },
            '己': { full: '풍요로운 씨앗을 품어 키워내는 따뜻한 텃밭(己土)', short: '부드러운 텃밭', char: '己土', color: '따스한 흙빛' },
            '기': { full: '풍요로운 씨앗을 품어 키워내는 따뜻한 텃밭(己土)', short: '부드러운 텃밭', char: '己土', color: '따스한 흙빛' },
            '庚': { full: '아직 다듬어지지 않은 단단하고 웅장한 원석(庚金)', short: '단단한 원석', char: '庚金', color: '금빛' },
            '경': { full: '아직 다듬어지지 않은 단단하고 웅장한 원석(庚金)', short: '단단한 원석', char: '庚金', color: '금빛' },
            '辛': { full: '눈부시게 맑고 예리한 은색 다이아몬드(辛金)', short: '은빛 다이아몬드', char: '辛金', color: '은빛' },
            '신': { full: '눈부시게 맑고 예리한 은색 다이아몬드(辛金)', short: '은빛 다이아몬드', char: '辛金', color: '은빛' },
            '壬': { full: '모든 것을 깊이 있게 품어내는 넓고 신비로운 바다(壬水)', short: '깊은 바다', char: '壬水', color: '물빛' },
            '임': { full: '모든 것을 깊이 있게 품어내는 넓고 신비로운 바다(壬水)', short: '깊은 바다', char: '壬水', color: '물빛' },
            '癸': { full: '하늘에서 내리는 맑고 시원한 은하수 오아시스(癸水)', short: '맑은 은하수', char: '癸水', color: '푸른 물빛' },
            '계': { full: '하늘에서 내리는 맑고 시원한 은하수 오아시스(癸水)', short: '맑은 은하수', char: '癸水', color: '푸른 물빛' }
        };

        const dmInfo = DAY_MASTER_MAP[dmKey] || DAY_MASTER_MAP['辛'];

        // --- 2. 사주 4기둥 간지 추출 로직 ---
        const getPillar = (type: 'year' | 'month' | 'day' | 'time') => {
            const flatKey = `${type}Pillar` as keyof typeof saju;
            if (saju[flatKey]) return saju[flatKey];
            if (saju.fourPillars && saju.fourPillars[type]) return saju.fourPillars[type];
            if (saju[type]) return saju[type];
            return null;
        };

        const p = {
            year: getPillar('year'),
            month: getPillar('month'),
            day: getPillar('day'),
            time: getPillar('time')
        };

        const getChar = (obj: any, part: 'stem' | 'branch') => {
            if (!obj) return '';
            if (typeof obj === 'string') return obj.charAt(0);

            if (part === 'stem') {
                if (typeof obj.gan === 'string') return obj.gan;
                if (typeof obj.ganKor === 'string') return obj.ganKor;
                if (typeof obj.stem === 'string') return obj.stem;
                if (obj.gan && typeof obj.gan === 'object' && obj.gan.char) return obj.gan.char;
            }
            if (part === 'branch') {
                if (typeof obj.ji === 'string') return obj.ji;
                if (typeof obj.jiKor === 'string') return obj.jiKor;
                if (typeof obj.branch === 'string') return obj.branch;
                if (obj.ji && typeof obj.ji === 'object' && obj.ji.char) return obj.ji.char;
            }
            return '';
        };

        const Ganji = {
            year: `${getChar(p.year, 'stem')}${getChar(p.year, 'branch')}`,
            month: `${getChar(p.month, 'stem')}${getChar(p.month, 'branch')}`,
            day: `${getChar(p.day, 'stem')}${getChar(p.day, 'branch')}`,
            hour: `${getChar(p.time, 'stem')}${getChar(p.time, 'branch')}`,
        };

        const sajuGanjiText = `${Ganji.year || '년'}년 ${Ganji.month || '월'}월 ${Ganji.day || '일'}일 ${Ganji.hour || '시'}시`;

        // --- 3. 오행별 대표 십신 및 은유 도출 알고리즘 ---
        const ElemOfStem: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
            '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water',
            '갑': 'wood', '을': 'wood', '병': 'fire', '정': 'fire', '무': 'earth', '기': 'earth', '경': 'metal', '신': 'metal', '임': 'water', '계': 'water'
        };

        const ElemOfBranch: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
            '寅': 'wood', '卯': 'wood', '巳': 'fire', '午': 'fire', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth', '申': 'metal', '酉': 'metal', '亥': 'water', '子': 'water',
            '인': 'wood', '묘': 'wood', '사': 'fire', '오': 'fire', '진': 'earth', '술': 'earth', '축': 'earth', '미': 'earth', '신': 'metal', '유': 'metal', '해': 'water', '자': 'water'
        };

        const dmElem = ElemOfStem[dmKey] || 'metal';

        const OhaengOrder = ['wood', 'fire', 'earth', 'metal', 'water'];
        const getTenGodElem = (relation: 'self' | 'output' | 'wealth' | 'power' | 'resource') => {
            const baseIdx = OhaengOrder.indexOf(dmElem);
            let offset = 0;
            if (relation === 'self') offset = 0;
            if (relation === 'output') offset = 1;
            if (relation === 'wealth') offset = 2;
            if (relation === 'power') offset = 3;
            if (relation === 'resource') offset = 4;
            return OhaengOrder[(baseIdx + offset) % 5];
        };

        const findElementInPillars = (targetOhaeng: string): string => {
            const list = [p.day, p.month, p.year, p.time];
            for (const item of list) {
                if (!item) continue;
                const stemChar = getChar(item, 'stem');
                const branchChar = getChar(item, 'branch');
                
                if (stemChar && ElemOfStem[stemChar.charAt(0)] === targetOhaeng) {
                    const char = stemChar.charAt(0);
                    const suffix = ElemOfStem[char] === 'metal' ? '金' : ElemOfStem[char] === 'wood' ? '木' : ElemOfStem[char] === 'fire' ? '火' : ElemOfStem[char] === 'earth' ? '土' : '水';
                    return char + suffix;
                }
                if (branchChar && ElemOfBranch[branchChar.charAt(0)] === targetOhaeng) {
                    const char = branchChar.charAt(0);
                    const suffix = ElemOfBranch[char] === 'metal' ? '金' : ElemOfBranch[char] === 'wood' ? '木' : ElemOfBranch[char] === 'fire' ? '火' : ElemOfBranch[char] === 'earth' ? '土' : '水';
                    return char + suffix;
                }
            }
            const ohaengToGanji: Record<string, string> = {
                wood: '乙木', fire: '巳火', earth: '未土', metal: '庚金', water: '癸水'
            };
            return ohaengToGanji[targetOhaeng] || '오행';
        };

        // (1) 관성 (power)
        const powerElem = getTenGodElem('power');
        const killerElement = findElementInPillars(powerElem);
        const killerName = saju.tenGods?.power > 1 ? '편관' : '정관';
        
        const KILLER_ANALOGY_MAP: Record<string, string> = {
            wood: '나를 옥죄며 자라나는 가시나무 족쇄',
            fire: '내 머릿속의 가혹한 24시간 감시 카메라',
            earth: '나를 무겁게 짓누르는 거대한 대지 압박 장벽',
            metal: '나를 매섭게 겨냥하는 서리 내린 날카로운 작두칼',
            water: '내 마음을 차갑게 누르는 끝없는 심연의 검열관'
        };
        const killerAnalogy = KILLER_ANALOGY_MAP[powerElem] || KILLER_ANALOGY_MAP['fire'];

        // (2) 식상 (output)
        const outputElem = getTenGodElem('output');
        const expressionElement = findElementInPillars(outputElem);
        const expressionName = saju.tenGods?.output > 1 ? '상관' : '식신';

        const EXPRESSION_ANALOGY_MAP: Record<string, { full: string; short: string }> = {
            wood: { full: '가슴 속에 싱그럽게 피어나는 생명의 푸른 숲', short: '푸른 숲' },
            fire: { full: '어두운 밤하늘을 화려하게 장식하는 찬란한 불꽃놀이', short: '찬란한 불꽃' },
            earth: { full: '만물을 품어 기름지게 일구는 따뜻한 대지 어머니', short: '따뜻한 대지' },
            metal: { full: '사방으로 청아하게 울려 퍼지는 정교한 황금 종소리', short: '정교한 종소리' },
            water: { full: '마음을 촉촉하게 식혀주는 맑은 은하수 오아시스', short: '맑은 은하수' }
        };
        const expressionInfo = EXPRESSION_ANALOGY_MAP[outputElem] || EXPRESSION_ANALOGY_MAP['water'];

        // (3) 조열/방해 (dryer)
        let dryerElement = '未土';
        let dryerAnalogy = '오아시스를 바짝 말려버리는 마음의 사막 모래바람';
        const branches = [getChar(p.day, 'branch'), getChar(p.month, 'branch'), getChar(p.year, 'branch'), getChar(p.time, 'branch')];
        if (branches.includes('未') || branches.includes('戌')) {
            dryerElement = branches.includes('未') ? '未土' : '戌土';
            dryerAnalogy = '오아시스를 바짝 말려버리는 마음의 사막 모래바람';
        } else if (branches.includes('辰') || branches.includes('丑')) {
            dryerElement = branches.includes('辰') ? '辰土' : '丑土';
            dryerAnalogy = '발걸음을 무겁게 옭아매는 무기력의 끈적한 진흙구덩이';
        } else {
            const resourceElem = getTenGodElem('resource');
            dryerElement = findElementInPillars(resourceElem);
            dryerAnalogy = '마음의 메인보드를 뜨겁게 달구는 엔진의 과열 스파크';
        }

        // (4) 비겁 (self)
        const competitorElement = findElementInPillars(dmElem);
        const competitorName = saju.tenGods?.self > 1 ? '겁재' : '비견';
        const competitorAnalogy = '나를 끝없이 채찍질하는 경쟁의 그림자';

        // (5) 재성 (wealth)
        const wealthElem = getTenGodElem('wealth');
        const assetElement = findElementInPillars(wealthElem);
        const assetName = saju.tenGods?.wealth > 1 ? '편재' : '정재';

        const ASSET_ANALOGY_MAP: Record<string, { full: string; short: string }> = {
            wood: { full: '세상을 향해 싱그럽게 피어날 푸른 새싹의 꿈', short: '푸른 새싹' },
            fire: { full: '세상을 환하게 물들일 찬란한 등불의 대기획', short: '찬란한 등불' },
            earth: { full: '풍요로운 성과를 풍성하게 수확해 낼 거대한 지식 영토', short: '지식 영토' },
            metal: { full: '한 치의 오차도 없이 완성도 높게 깎아낼 황금 조각품', short: '황금 조각품' },
            water: { full: '온 누리를 적시며 널리 유통될 마르지 않는 지혜의 젖줄', short: '지혜의 젖줄' }
        };
        const assetInfo = ASSET_ANALOGY_MAP[wealthElem] || ASSET_ANALOGY_MAP['wood'];

        // --- 4. 충/형 감지 ---
        let primaryClash = '자기 검열과 억압의 沖(충) 작용';
        const branchString = branches.filter(Boolean).join('');
        if (branchString.includes('子') && branchString.includes('午')) primaryClash = '子午沖(자오충)';
        else if (branchString.includes('丑') && branchString.includes('未')) primaryClash = '丑未沖(축미충)';
        else if (branchString.includes('寅') && branchString.includes('申')) primaryClash = '寅申沖(인신충)';
        else if (branchString.includes('卯') && branchString.includes('酉')) primaryClash = '卯酉沖(묘유충)';
        else if (branchString.includes('辰') && branchString.includes('戌')) primaryClash = '辰戌沖(진술충)';
        else if (branchString.includes('巳') && branchString.includes('亥')) primaryClash = '巳亥沖(사해충)';
        else if (branchString.includes('巳') && branchString.includes('申')) primaryClash = '巳申형 갈등';
        else if (branchString.includes('寅') && branchString.includes('巳') && branchString.includes('申')) primaryClash = '삼형살(三刑殺) 스파크';

        // --- 5. 대운 / 세운 계산 ---
        const currentDaewoonGanji = saju.currentDaewoon || '대운';
        const currentDaewoonAnalogy = `${expressionInfo.short} 쿨다운 대폭포수`;

        // 템플릿 변수 매핑 객체 구축
        const resolvedValues: Record<string, string> = {
            SAJU_GANJI: sajuGanjiText,
            DAY_MASTER_CHAR: dmInfo.char,
            DAY_MASTER_ANALOGY: dmInfo.full,
            DAY_MASTER_SHORT_ANALOGY: dmInfo.short,
            KILLER_ELEMENT: killerElement,
            KILLER_ANALOGY: killerAnalogy,
            KILLER_NAME: killerName,
            EXPRESSION_ELEMENT: expressionElement,
            EXPRESSION_ANALOGY: expressionInfo.full,
            EXPRESSION_SHORT_ANALOGY: expressionInfo.short,
            EXPRESSION_NAME: expressionName,
            DRYER_ELEMENT: dryerElement,
            DRYER_ANALOGY: dryerAnalogy,
            COMPETITOR_ELEMENT: competitorElement,
            COMPETITOR_ANALOGY: competitorAnalogy,
            COMPETITOR_NAME: competitorName,
            ASSET_ELEMENT: assetElement,
            ASSET_ANALOGY: assetInfo.full,
            ASSET_SHORT_ANALOGY: assetInfo.short,
            ASSET_NAME: assetName,
            PRIMARY_CLASH: primaryClash,
            CURRENT_DAEWOON_GANJI: currentDaewoonGanji,
            CURRENT_DAEWOON_ANALOGY: currentDaewoonAnalogy, // typo 방지용 안전 장치
            YEAR_2025: '2025년 乙巳년',
            YEAR_2026: '2026년 丙午년',
            YEAR_2027: '2027년 丁未년',
            YEAR_2029: '2029년 己酉년'
        };

        // CURRENT_DAEWOON_ANALOGY 철자 매칭 보강
        resolvedValues['CURRENT_DAEWOON_ANALOGY'] = currentDaewoonAnalogy;

        // 템플릿 치환 수행
        let resolved = text;
        Object.entries(resolvedValues).forEach(([key, val]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            resolved = resolved.replace(regex, val);
        });

        // 레거시 태그 대응 및 호환성 치환
        resolved = resolved.replace(/\{\{SAJU_GANJI\}\}/g, sajuGanjiText);
        resolved = resolved.replace(/\{\{DAY_MASTER\}\}/g, `${dmInfo.char}(${dmInfo.color})`);
        resolved = resolved.replace(/\{\{YEAR_PILLAR\}\}/g, Ganji.year || '년주');
        resolved = resolved.replace(/\{\{MONTH_PILLAR\}\}/g, Ganji.month || '월주');
        resolved = resolved.replace(/\{\{HOUR_PILLAR\}\}/g, Ganji.hour || '시주');
        resolved = resolved.replace(/\{\{WEAK_ELEMENT\}\}/g, '부족함을 극복할 나만의 황금 원소');
        resolved = resolved.replace(/\{\{GONGMANG\}\}/g, '액막이 안전 공망');
        resolved = resolved.replace(/\{\{CURRENT_DAEWOON\}\}/g, '인생의 커다란 파도(대운)');
        resolved = resolved.replace(/\{\{CURRENT_YEAR_GANJI\}\}/g, '올해의 조율 기류');

        return resolved;
    };

    const hasAiContent = !!aiPageContent[currentPageKey];
    const displayTitle = hasAiContent 
        ? aiPageContent[currentPageKey].title 
        : getResolvedText(currentPageData?.title);
    const displayDesc = hasAiContent 
        ? aiPageContent[currentPageKey].desc 
        : getResolvedText(currentPageData?.desc);
    const displaySocratic = hasAiContent 
        ? aiPageContent[currentPageKey].socratic 
        : getResolvedText(currentPageData?.socratic);
    const displayRecursive = hasAiContent 
        ? aiPageContent[currentPageKey].recursive 
        : getResolvedText(currentPageData?.recursive);

    // --- 페이지 검색 및 필터링 ---
    const filteredPageKeys = pageKeys.filter(key => {
        const page = saju108Matrix[key];
        const hasAi = !!aiPageContent[key];
        const resolvedTitle = hasAi ? aiPageContent[key].title : getResolvedText(page.title);
        const resolvedDesc = hasAi ? aiPageContent[key].desc : getResolvedText(page.desc);
        return (
            key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resolvedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resolvedDesc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // --- 전체 출력/PDF 인쇄 인스턴스 (triggerFullPrint) ---
    const triggerFullPrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let printHtml = `
            <html>
            <head>
                <title>명심코칭 108 자각 힐링 백서</title>
                <style>
                    body {
                        font-family: 'Outfit', 'Inter', 'Noto Sans KR', sans-serif;
                        background: #fff;
                        color: #111;
                        padding: 40px;
                        line-height: 1.6;
                    }
                    .page-break {
                        page-break-after: always;
                        border-bottom: 2px dashed #eee;
                        padding-bottom: 30px;
                        margin-bottom: 40px;
                    }
                    h1 { color: #f472b6; border-bottom: 2px solid #f472b6; padding-bottom: 8px; font-size: 24px; }
                    .meta { font-size: 13px; color: #666; margin-bottom: 20px; font-weight: bold; }
                    .content-box { background: #f9f9f9; padding: 20px; border-left: 4px solid #f472b6; margin-bottom: 20px; border-radius: 4px; }
                    .section-title { font-weight: bold; color: #ec4899; margin-top: 15px; font-size: 16px; }
                    .text { font-size: 14px; margin-bottom: 10px; }
                    .answer { background: #fff; border: 1px solid #ddd; padding: 12px; font-style: italic; color: #333; margin-top: 5px; border-radius: 4px; }
                </style>
            </head>
            <body>
                <h1 style="text-align: center; font-size: 28px; margin-bottom: 10px;">🌌 108 자각 힐링 백서 기록집</h1>
                <p style="text-align: center; color: #555; margin-bottom: 40px;">당신의 영혼 아키텍처를 치유하는 108개의 우주 기질 설계서</p>
        `;

        pageKeys.forEach((key, index) => {
            const page = saju108Matrix[key];
            const ans = answers[key] || '(작성된 자각 기록이 없습니다.)';
            const isConfirmed = recursiveConfirmed[key] ? '승인 및 자각 완료' : '미확정 상태';

            const hasAi = !!aiPageContent[key];
            const title = hasAi ? aiPageContent[key].title : getResolvedText(page.title);
            const desc = hasAi ? aiPageContent[key].desc : getResolvedText(page.desc);
            const socratic = hasAi ? aiPageContent[key].socratic : getResolvedText(page.socratic);
            const recursive = hasAi ? aiPageContent[key].recursive : getResolvedText(page.recursive);

            printHtml += `
                <div class="page-break">
                    <div class="meta">PAGE ${index + 1} // CODE: ${key} ${hasAi ? '(AI 초개인화 맞춤집필)' : ''}</div>
                    <h1>${title}</h1>
                    <div class="content-box">
                        <div class="section-title">💡 우주 기질 디버깅 조언</div>
                        <div class="text">${desc}</div>
                    </div>
                    <div class="section-title">❓ 소크라테스식 치유 자각 질문</div>
                    <div class="text">${socratic}</div>
                    <div class="section-title">📝 나의 내면 성찰 기록</div>
                    <div class="answer">${ans}</div>
                    <div class="section-title">🔄 순환식 참나 무한 수용 확약 (${isConfirmed})</div>
                    <div class="text" style="font-weight: bold; color: #4b5563;">"${recursive}"</div>
                </div>
            `;
        });

        printHtml += `
            </body>
            </html>
        `;

        printWindow.document.write(printHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 800);
    };

    const totalProgress = Math.round(
        ((Object.keys(answers).filter(k => answers[k]?.trim() !== '').length +
        Object.keys(recursiveConfirmed).filter(k => recursiveConfirmed[k]).length) / (pageKeys.length * 2)) * 100
    );

    // PC/모바일 화면 크기 실시간 감지
    const [isLargeScreen, setIsLargeScreen] = React.useState(false);
    useEffect(() => {
        const checkSize = () => setIsLargeScreen(window.innerWidth >= 1024);
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // createPortal 대상 (SSR 안전 처리)
    const [portalContainer, setPortalContainer] = React.useState<Element | null>(null);
    useEffect(() => {
        setPortalContainer(document.body);
    }, []);

    if (!isOpen || !portalContainer) return null;

    // PC에서 사이드바: 항상 relative DOM 요소 / 모바일: fixed overlay
    const sidebarStyle: React.CSSProperties = isLargeScreen
        ? {
            position: 'relative',
            width: sidebarOpen ? '300px' : '0px',
            minWidth: sidebarOpen ? '300px' : '0px',
            overflow: 'hidden',
            height: '100dvh',
            flexShrink: 0,
            transition: 'width 0.3s ease, min-width 0.3s ease',
            zIndex: 10,
        }
        : {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            height: '100dvh',
            zIndex: 30,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
        };

    return createPortal(
        <div
            className="fixed top-0 left-0 z-[1020] bg-[#06080F]/95 backdrop-blur-xl font-sans text-gray-200"
            style={{ width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
        >
            {/* 배경 그라데이션 오라 효과 */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

            {/* 모바일용 오버레이 배경 */}
            {!isLargeScreen && sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== 사이드바 (PC: relative flex, 모바일: fixed overlay) ===== */}
            <div style={sidebarStyle} className="bg-gray-950 border-r border-white/5 flex flex-col backdrop-blur-md">
                <div style={{ width: isLargeScreen ? '300px' : '280px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* 사이드바 헤더 */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="text-pink-400" size={18} />
                                <span className="font-bold text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">108 자각 설계 인덱스</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* 사이드바 검색창 */}
                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="자각 코드 / 키워드 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/5 rounded-lg border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-gray-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* 사이드바 리스트 스크롤 영역 */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {filteredPageKeys.map((key) => {
                                const idx = pageKeys.indexOf(key);
                                const page = saju108Matrix[key];
                                const isCurrent = idx === currentPageIndex;
                                const isAnswered = answers[key]?.trim() !== '';
                                const isConfirmed = recursiveConfirmed[key];
                                const hasAi = !!aiPageContent[key];
                                const resolvedTitle = hasAi ? aiPageContent[key].title : getResolvedText(page.title);

                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setCurrentPageIndex(idx);
                                            if (window.innerWidth < 1024) setSidebarOpen(false); // 모바일 시 자동 닫기
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2.5 border ${
                                            isCurrent
                                                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/10 border-pink-500/40 shadow-[0_4px_12px_rgba(236,72,153,0.15)] text-pink-100'
                                                : 'bg-white/2 border-transparent hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                            isCurrent ? 'bg-pink-500/30 text-pink-300' : 'bg-white/5 text-gray-400'
                                        }`}>
                                            {String(idx + 1).padStart(3, '0')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                                                <span>CODE: {key}</span>
                                                {isAnswered && <span className="text-blue-400">● 기록</span>}
                                                {isConfirmed && <span className="text-pink-400">● 자각</span>}
                                                {hasAi && <span className="text-pink-500/80 font-black">★ AI</span>}
                                            </div>
                                            <div className="text-xs truncate font-medium mt-0.5">
                                                {resolvedTitle}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                </div>
            </div>

            {/* ===== 메인 콘텐츠 영역 ===== */}
            <div style={{ flex: 1, minWidth: 0, height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                {/* 1. 고정 헤더 영역 */}
                <header className="h-14 sm:h-16 border-b border-white/5 bg-gray-950/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {/* 햄버거 토글 메뉴 버튼 (사이드바 제어) */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 p-2 rounded-xl transition-all"
                            title="메뉴 열기/닫기"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white tracking-widest hidden xs:inline">SAJU OS v4.0</span>
                            <span className="bg-pink-500/10 border border-pink-500/30 text-[9px] sm:text-[10px] font-bold text-pink-400 px-2 py-0.5 rounded-full">108 자각 백서</span>
                        </div>
                    </div>

                    {/* 이완 사운드 & 심호흡 컨트롤 */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleBgm}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                                isPlayingBgm
                                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            {isPlayingBgm ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            <span className="text-[9px] font-bold tracking-wider hidden md:inline">528Hz BGM</span>
                        </button>

                        <button
                            onClick={toggleBreathing}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                                isBreathingActive
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            <Heart size={16} className={isBreathingActive ? 'animate-pulse' : ''} />
                            <span className="text-[9px] font-bold tracking-wider hidden md:inline">이완 심호흡</span>
                        </button>

                        <button
                            onClick={triggerFullPrint}
                            className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 hover:text-white p-2 rounded-xl transition-all"
                            title="전체 기록 PDF 저장"
                        >
                            <FileText size={16} />
                        </button>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/30 text-gray-400 hover:text-pink-400 flex items-center justify-center transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </header>

                {/* 2. 스크롤 영역 (inline style로 완벽한 flex overflow 제어) */}
                <div className="custom-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    {/* 진행률 게이지 배너 */}
                    <div className="w-full max-w-3xl bg-white/2 border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider">나의 내면 디버깅 진행도</h4>
                                <p className="text-[8px] sm:text-[9px] text-gray-500">108 자각 설계 중 총 {Object.keys(answers).filter(k => answers[k]?.trim() !== '').length}개 성찰 완료</p>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalProgress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 w-8 text-right">{totalProgress}%</span>
                        </div>
                    </div>

                    {/* 심호흡 위젯 활성화 시 노출 */}
                    <AnimatePresence>
                        {isBreathingActive && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="w-full max-w-3xl overflow-hidden shrink-0"
                            >
                                <div className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border border-blue-500/20 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center space-y-3 backdrop-blur-md relative">
                                    <div className="absolute top-2.5 right-2.5">
                                        <button
                                            onClick={stopBreathing}
                                            className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-md"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-[10px] sm:text-xs font-bold text-blue-400 tracking-widest uppercase">
                                            {breathingPhase === 'inhale' && '🌬️ 들숨 (Inhale) — 마음의 은하수 흡입'}
                                            {breathingPhase === 'hold' && '⏳ 멈춤 (Hold) — 맑은 부교감 냉각수 순환'}
                                            {breathingPhase === 'exhale' && '💨 날숨 (Exhale) — 묵은 후회와 아픔 방출'}
                                        </div>
                                    </div>

                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                scale: breathingPhase === 'inhale' ? 1.35 : breathingPhase === 'hold' ? 1.35 : 0.95,
                                                opacity: breathingPhase === 'hold' ? 0.8 : 0.4,
                                            }}
                                            transition={{ duration: 5, ease: 'easeInOut' }}
                                            className="absolute inset-0 rounded-full border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.25)] pointer-events-none"
                                        />

                                        <motion.div
                                            animate={{
                                                scale: breathingPhase === 'inhale' ? 1.15 : breathingPhase === 'hold' ? 1.15 : 0.9,
                                                backgroundColor:
                                                    breathingPhase === 'inhale'
                                                        ? 'rgba(59, 130, 246, 0.2)'
                                                        : breathingPhase === 'hold'
                                                        ? 'rgba(139, 92, 246, 0.25)'
                                                        : 'rgba(236, 72, 153, 0.2)',
                                                borderColor:
                                                    breathingPhase === 'inhale'
                                                        ? '#3b82f6'
                                                        : breathingPhase === 'hold'
                                                        ? '#8b5cf6'
                                                        : '#ec4899',
                                            }}
                                            transition={{ duration: 5, ease: 'easeInOut' }}
                                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center shadow-inner relative"
                                        >
                                            <span className="text-xl sm:text-2xl font-black text-white">{breathingTimer}</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 메인 성찰 카드 영역 */}
                    <main className="w-full max-w-3xl flex flex-col space-y-4 sm:space-y-6 pb-16 lg:pb-24">
                        {/* 성찰 카드 */}
                        <div className="bg-gray-900/40 border border-white/5 hover:border-pink-500/10 shadow-2xl rounded-3xl p-5 sm:p-7 backdrop-blur-md relative flex flex-col space-y-4 sm:space-y-5 transition-all duration-300 w-full">
                            {/* 데코 코드 */}
                            <div className="absolute top-3 right-4 text-[9px] sm:text-xs font-black font-mono tracking-widest text-pink-500/30">
                                {currentPageKey}
                            </div>

                            {isGeneratingAi ? (
                                <div className="flex flex-col items-center justify-center py-16 sm:py-24 space-y-6">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                                        {/* 네온 그라데이션 회전 아우라 */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-65 blur-md"
                                        />
                                        {/* 안쪽 회전 마스크 서클 */}
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                            className="absolute w-[90%] h-[90%] rounded-full bg-gray-950/90 border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(236,72,153,0.25)]"
                                        >
                                            <Sparkles className="text-pink-400 animate-pulse" size={24} />
                                        </motion.div>
                                    </div>
                                    <div className="text-center space-y-2.5 px-4 max-w-md">
                                        <span className="text-[9px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 uppercase animate-pulse">AI Synthesis Channeling</span>
                                        <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-relaxed">
                                            Gemini AI가 당신의 기질 주파수를 감지하여<br className="hidden sm:inline" /> 백서를 실시간 집필하는 중입니다...
                                        </p>
                                        <div className="flex items-center justify-center gap-1.5 pt-1">
                                            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* 카드 제목 */}
                                    <div className="space-y-0.5 sm:space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] sm:text-[9px] font-black text-pink-400 tracking-widest uppercase">
                                                PAGE {currentPageIndex + 1} // {hasAiContent ? '🌸 AI 초개인화 맞춤집필' : 'CHIMERA SECURE'}
                                            </span>
                                            {hasAiContent && (
                                                <span className="bg-pink-500/10 border border-pink-500/20 text-[8px] font-bold text-pink-400 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_8px_rgba(236,72,153,0.1)]">
                                                    <Sparkles size={8} className="animate-spin-slow" /> AI 맞춤 백서
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 leading-snug">
                                            {displayTitle}
                                        </h1>
                                    </div>

                                    {/* 본문 조언 (모바일 폰트 가독성 최적화) */}
                                    <div className="text-xs sm:text-sm text-gray-300/90 leading-relaxed font-normal bg-white/2 border border-white/5 rounded-2xl p-3.5 sm:p-5 max-h-[220px] sm:max-h-[300px] lg:max-h-[400px] xl:max-h-[480px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                                        {displayDesc}
                                    </div>

                                    {/* Socratic 성찰 질문 */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-pink-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                                            <span>❓ 소크라테스식 치유 자각 질문</span>
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-gray-400 italic pl-1 leading-relaxed whitespace-pre-wrap">
                                            "{displaySocratic}"
                                        </div>
                                        <textarea
                                            value={answers[currentPageKey] || ''}
                                            onChange={(e) => handleAnswerChange(currentPageKey, e.target.value)}
                                            placeholder="마음의 대답을 다정하게 기록해 봅니다..."
                                            className="w-full h-16 sm:h-20 p-2.5 bg-gray-950/60 rounded-xl border border-white/5 focus:outline-none focus:border-pink-500/50 text-[11px] sm:text-xs text-white placeholder-gray-600 transition-all leading-relaxed resize-none"
                                        />
                                    </div>

                                    {/* 참나 확약 및 승인 버튼 */}
                                    <div className="bg-gradient-to-r from-pink-950/5 via-purple-950/5 to-transparent border border-pink-500/10 rounded-2xl p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                                        <div className="flex-1 space-y-0.5">
                                            <span className="text-[8px] font-bold text-pink-400 tracking-widest uppercase">🔄 참나 무한 수용 확약</span>
                                            <p className="text-[10px] sm:text-xs font-medium text-gray-300 leading-normal whitespace-pre-wrap">
                                                "{displayRecursive}"
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleConfirmRecursive(currentPageKey)}
                                            className={`w-full xs:w-auto px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                                                recursiveConfirmed[currentPageKey]
                                                    ? 'bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.25)] hover:bg-pink-600'
                                                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-pink-400 hover:text-white'
                                            }`}
                                        >
                                            <span>{recursiveConfirmed[currentPageKey] ? '🌸 온전히 자각함' : '자각 및 승인'}</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 페이징 내비게이터 */}
                        <div className="flex items-center justify-between px-1 w-full">
                            <button
                                onClick={() => {
                                    if (currentPageIndex > 0) {
                                        setCurrentPageIndex(prev => prev - 1);
                                        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                                    }
                                }}
                                disabled={currentPageIndex === 0}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-[10px] sm:text-xs font-bold text-gray-500 tracking-wider">
                                {currentPageIndex + 1} / {pageKeys.length} 페이지
                            </span>

                            <button
                                onClick={() => {
                                    if (currentPageIndex < pageKeys.length - 1) {
                                        setCurrentPageIndex(prev => prev + 1);
                                        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                                    }
                                }}
                                disabled={currentPageIndex === pageKeys.length - 1}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    , portalContainer!);
}

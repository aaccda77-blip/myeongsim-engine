'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FileText, ChevronLeft, ChevronRight, X, Heart, Sparkles, BookOpen, Menu, Search, RefreshCw } from 'lucide-react';
import { saju108Matrix } from '@/data/saju108Matrix';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';

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

    // [Hyper-Pass] Zustand Hydration 지연을 완벽 격파하기 위한 로컬 스토리지 동적 다이렉트 파싱 장치
    const getSajuFromLocalStorage = (): any => {
        if (typeof window === 'undefined') return null;
        try {
            const storageStr = localStorage.getItem('myeongsim-report-storage');
            if (storageStr) {
                const parsed = JSON.parse(storageStr);
                return parsed?.state?.reportData?.saju || null;
            }
        } catch (e) {
            console.warn('⚠️ [Hyper-Pass] myeongsim-report-storage 파싱 실패:', e);
        }
        return null;
    };

    // activeSaju를 리액티브 상태(State)로 선언하여 Hydration Lag를 즉시 탈출
    const [activeSaju, setActiveSaju] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            // [실시간 만세력 정밀 연산] Zustand 스토어 및 세션으로부터 진짜 실시간 생년월일 정보 실시간 획득
            const rawDate = reportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || userProfile?.user_metadata?.saju_data?.date || userProfile?.user_metadata?.birth_date;
            const rawTime = reportData?.birthTime || userProfile?.birthTime || userProfile?.birth_time || userProfile?.user_metadata?.saju_data?.time || '12:00';
            const gender = reportData?.gender || userProfile?.gender || userProfile?.user_metadata?.saju_data?.gender || 'male';
            const calendarType = reportData?.meta?.calendarType || userProfile?.calendar_type || userProfile?.user_metadata?.saju_data?.calendar_type || 'solar';

            let finalSaju = null;

            // [로컬 캐시 무효화 및 즉석 계산] 생년월일 원본이 존재한다면, 낡은 로컬 캐시 정합성 버그를 원천 파괴하기 위해 즉석에서 100% 실시간 만세력 계산 기동!
            if (rawDate) {
                try {
                    // [Bug Fix] 하드코딩된 'solar' 대신 사용자가 선택한 calendarType('lunar'/'solar')를 동적으로 확실히 주입
                    const result = calculateSaju(rawDate, rawTime, calendarType, gender);
                    if (result && result.success) {
                        const stats = calculateSajuStats(result.fourPillars, result.dayMasterChar);
                        finalSaju = {
                            dayMaster: result.dayMaster,
                            fourPillars: result.fourPillars,
                            elements: stats.ohaeng,
                            tenGods: stats.tenGods,
                            currentDaewoon: result.currentDaewoon || null,
                            currentSeun: result.currentSeun || null
                        };
                        console.log('✅ [Healing108] 100% 무결한 실시간 즉석 만세력 계산 성공:', finalSaju.dayMaster, '대운:', finalSaju.currentDaewoon, '달력유형:', calendarType);
                    }
                } catch (e) {
                    console.warn('⚠️ [Healing108] 실시간 사주 계산 실패:', e);
                }
            }

            // 만약 즉석 계산이 동작하지 않았을 때만 스토어 백업이나 로컬스토리지 캐시를 최후의 폴백으로 탐색!
            if (!finalSaju) {
                const localSaju = getSajuFromLocalStorage();
                finalSaju = reportData?.saju || localSaju || userProfile?.saju;
            }

            // [최종 안전장치] 만약 모든 데이터가 비어있다면, 서버가 에러를 뱉지 않도록 기본 갑자일주(甲子) 목업 데이터를 채워줍니다.
            if (!finalSaju) {
                finalSaju = {
                    dayMaster: "갑목",
                    fourPillars: {
                        year: { gan: "甲", ji: "子" },
                        month: { gan: "甲", ji: "子" },
                        day: { gan: "甲", ji: "子", char: "甲" },
                        time: { gan: "甲", ji: "子" }
                    },
                    elements: { wood: 1, fire: 0, earth: 0, metal: 0, water: 0 },
                    tenGods: { self: 0, output: 0, wealth: 0, power: 0, resource: 0 }
                };
                console.warn('⚠️ [Healing108] 데이터가 완전히 비어있어 기본 갑자일주 데이터를 주입했습니다.');
            }
            setActiveSaju(finalSaju);
        }
    }, [isOpen, reportData, userProfile]);


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
    const [aiPageContent, setAiPageContent] = useState<Record<string, { title: string; desc?: string; darkCodeCbt?: string; metaCodeAct?: string; neuralCodeDbt?: string; socratic?: string; recursive?: string; sajuAnalysis?: string; socraticMbct?: string; relaxMbsr?: string; selfCompassionMsc?: string; coachingSolution?: string; mantra?: string }>>({});
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // [모듈 상세 모달] 클릭 시 AI가 상세 풀이해주는 카드 모달
    const [expandedModule, setExpandedModule] = useState<{ type: string; label: string; icon: string; color: string; shortContent: string } | null>(null);
    const [expandedDetail, setExpandedDetail] = useState<Record<string, string>>({});
    const [isExpandLoading, setIsExpandLoading] = useState(false);

    // 108페이지 키 배열
    const pageKeys = Object.keys(saju108Matrix).sort();
    const currentPageKey = pageKeys[currentPageIndex];
    const currentPageData = saju108Matrix[currentPageKey];



    // 사용자 사주 여덟 글자(팔자) 기하학적 완벽 고유 지문(Fingerprint) 추출 함수
    const getSajuFingerprint = (): string => {
        if (!activeSaju) return 'guest';

        const getPillarGanji = (pillar: any) => {
            if (!pillar) return '';
            const gan = typeof pillar.gan === 'object' ? pillar.gan.char : pillar.gan || pillar.ganKor || '';
            const ji = typeof pillar.ji === 'object' ? pillar.ji.char : pillar.ji || pillar.jiKor || '';
            return `${gan}${ji}`;
        };

        const year = getPillarGanji(activeSaju.fourPillars?.year || activeSaju.yearPillar || activeSaju.year);
        const month = getPillarGanji(activeSaju.fourPillars?.month || activeSaju.monthPillar || activeSaju.month);
        const day = getPillarGanji(activeSaju.fourPillars?.day || activeSaju.dayPillar || activeSaju.day);
        const hour = getPillarGanji(activeSaju.fourPillars?.time || activeSaju.timePillar || activeSaju.time);
        const dm = activeSaju.dayMaster || '';

        const rawFingerprint = `${dm}_${year}${month}${day}${hour}`;
        // 특수문자 제거 후 안전한 키 변환 (한글, 영어, 숫자, 한자 모두 허용)
        return rawFingerprint.replace(/[^ㄱ-ㅎ가-힣A-Za-z0-9一-龥]/g, '') || 'guest';
    };

    // 사용자별 고유 캐시 키 정의 (생년월일 및 시간을 포함하여 사주 지문으로 완벽 격리)
    const userKey = getSajuFingerprint();
    const answersKey = `ms_108_answers_${userKey}`;
    const confirmedKey = `ms_108_confirmed_${userKey}`;
    // [Bug Fix] 기존에 잘못 캐시된 데이터를 완전히 무효화하고 다크/뉴럴/메타코드 스키마를 고착하기 위해 캐시 키 버전(v12) 업그레이드
    const aiContentKey = `ms_108_ai_content_v12_${userKey}`; // v12: Gemini responseSchema 탑재 버전

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
    }, [userKey, aiContentKey, answersKey, confirmedKey]); // [초고도화] 사용자가 바뀌거나 캐시 버전이 바뀌면 실시간으로 데이터를 분리 스위칭합니다.
    // [초고도화] 스텔스 모드(Lazy Loading) AI 생성 큐 및 진행 상태
    // 로딩 UI를 띄우지 않고 백그라운드에서 조용히 생성합니다.
    const [generatingQueue, setGeneratingQueue] = useState<string[]>([]);
    
    // [초고도화] 현재 보고 있는 페이지 동기화
    useEffect(() => {
        if (!isOpen || !activeSaju) return; 

        const currentCacheStr = typeof window !== 'undefined' ? localStorage.getItem(aiContentKey) : null;
        const currentCache = currentCacheStr ? JSON.parse(currentCacheStr) : {};

        // 상태가 아직 동기화 안 됐다면 로컬에서 가져와서 동기화
        if (Object.keys(aiPageContent).length === 0 && Object.keys(currentCache).length > 0) {
            setAiPageContent(currentCache);
        }
        
        // [DB 연동] 유저 ID가 있으면 서버 DB에서 생성 내역을 불러옴
        if (userProfile?.id) {
            fetch(`/api/coaching/108-reports?userId=${userProfile.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.reports && Object.keys(data.reports).length > 0) {
                        setAiPageContent(prev => {
                            const merged = { ...prev, ...data.reports };
                            localStorage.setItem(aiContentKey, JSON.stringify(merged));
                            return merged;
                        });
                    }
                })
                .catch(err => console.warn('DB에서 AI 리포트를 불러오는데 실패했습니다.', err));
        }
        
        // 자동 생성(요금 폭탄 유발) 기능 삭제됨: 오직 수동 생성만 허용
    }, [currentPageIndex, isOpen, activeSaju, aiContentKey, userProfile?.id]);

    // [초고도화] 큐에 들어온 페이지들을 하나씩 백그라운드에서 스텔스로 생성
    useEffect(() => {
        if (generatingQueue.length === 0 || isGeneratingAi) return;

        const processNextInQueue = async () => {
            const targetKey = generatingQueue[0];
            const pageData = saju108Matrix[targetKey];
            if (!pageData) {
                setGeneratingQueue(prev => prev.slice(1));
                return;
            }

            const isCurrentPage = targetKey === currentPageKey;
            if (isCurrentPage) {
                setIsGeneratingAi(true);
            }

            try {
                const resolvedOriginalPage = {
                    title: getResolvedText(pageData.title, activeSaju),
                    desc: getResolvedText(pageData.desc, activeSaju),
                    socratic: getResolvedText(pageData.socratic, activeSaju),
                    recursive: getResolvedText(pageData.recursive, activeSaju),
                };


                // [진단 로그] 서버로 보내는 데이터 확인
                const profile = buildSajuProfile();
                console.log('🔍 [Healing108] API로 보내는 sajuProfile:', JSON.stringify(profile).substring(0, 300));
                console.log('🔍 [Healing108] activeSaju.dayMaster:', activeSaju?.dayMaster);
                console.log('🔍 [Healing108] activeSaju.fourPillars:', JSON.stringify(activeSaju?.fourPillars));

                const response = await fetch('/api/coaching/generate-108', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageKey: targetKey,
                        sajuData: activeSaju,
                        sajuProfile: profile,
                        originalPage: resolvedOriginalPage
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.pageData) {
                        setAiPageContent(prev => {
                            const updated = { ...prev, [targetKey]: data.pageData };
                            localStorage.setItem(aiContentKey, JSON.stringify(updated));
                            return updated;
                        });
                    }
                }
            } catch (err) {
                console.warn(`❌ [Gemini 108 API] ${targetKey} 스텔스 생성 오류 (폴백 대체):`, err);
            } finally {
                setIsGeneratingAi(false);
                setGeneratingQueue(prev => prev.slice(1)); // 완료된 건 큐에서 제거
            }
        };

        processNextInQueue();
    }, [generatingQueue, isGeneratingAi, activeSaju, aiContentKey, currentPageKey]);


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

    // [모듈 상세 모달] 카드 클릭 → AI 상세 풀이 생성
    const handleExpandModule = async (type: string, label: string, icon: string, color: string, shortContent: string) => {
        setExpandedModule({ type, label, icon, color, shortContent });
        const cacheKey = `${currentPageKey}_${type}`;

        // 이미 캐시된 상세 내용이 있으면 재사용 (요금 절약!)
        if (expandedDetail[cacheKey]) return;

        setIsExpandLoading(true);
        try {
            const sp = activeSaju ? {
                dayMasterChar: activeSaju.dayMaster,
                dayMasterAnalogy: activeSaju.dayMasterAnalogy || '',
            } : {};

            const res = await fetch('/api/coaching/expand-module', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleType: type,
                    shortContent,
                    pageTitle: displayTitle,
                    sajuProfile: sp
                })
            });

            const data = await res.json();
            if (data.success && data.detail) {
                setExpandedDetail(prev => ({ ...prev, [cacheKey]: data.detail }));
            }
        } catch (e) {
            console.error('모듈 상세 생성 실패:', e);
        } finally {
            setIsExpandLoading(false);
        }
    };

    const forceRegenerateCurrentPage = async () => {
        // [Zustand 실시간 최신 사주 강제 확보] 실시간 만세력 재연산된 activeSaju를 1순위로 삼아 락인 완벽 방지
        const latestStoreSaju = useReportStore.getState().reportData?.saju;
        const finalTargetSaju = activeSaju || latestStoreSaju;

        if (!finalTargetSaju || userKey === 'guest' || isGeneratingAi) return;

        setIsGeneratingAi(true);
        try {
            const pageData = saju108Matrix[currentPageKey];
            if (!pageData) return;

            // [로컬 캐시 즉시 제거] 수동 재생성 요청 시 해당 페이지의 예전 AI 캐시를 강제 파괴
            setAiPageContent(prev => {
                const updated = { ...prev };
                delete updated[currentPageKey];
                localStorage.setItem(aiContentKey, JSON.stringify(updated));
                return updated;
            });

            const resolvedOriginalPage = {
                title: getResolvedText(pageData.title, finalTargetSaju),
                desc: getResolvedText(pageData.desc, finalTargetSaju),
                socratic: getResolvedText(pageData.socratic, finalTargetSaju),
                recursive: getResolvedText(pageData.recursive, finalTargetSaju),
            };

            const profile = buildSajuProfile(finalTargetSaju);

            const response = await fetch('/api/coaching/generate-108', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageKey: currentPageKey,
                    sajuData: finalTargetSaju,
                    sajuProfile: profile,
                    originalPage: resolvedOriginalPage
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.pageData) {
                    setAiPageContent(prev => {
                        const updated = { ...prev, [currentPageKey]: data.pageData };
                        localStorage.setItem(aiContentKey, JSON.stringify(updated));
                        return updated;
                    });
                    
                    // [DB 연동] DB에 저장하여 영구 보존
                    if (userProfile?.id) {
                        fetch('/api/coaching/108-reports', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: userProfile.id,
                                pageKey: currentPageKey,
                                generatedContent: data.pageData
                            })
                        }).catch(err => console.warn('DB 저장 실패:', err));
                    }
                } else {
                    alert("AI 응답에 오류가 있습니다 (데이터 불일치). 다시 시도해 주세요.");
                }
            } else {
                const errData = await response.json().catch(() => ({}));
                alert(`서버 오류가 발생했습니다. 상태 코드: ${response.status}\n잠시 후 다시 시도해 주세요.`);
            }
        } catch (err: any) {
            console.warn(`🚨 [Gemini 108 API] 수동 재생성 오류:`, err);
            alert(`네트워크 오류가 발생했습니다: ${err.message}`);
        } finally {
            setIsGeneratingAi(false);
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

    // --- 기질데이터 풍부한 사주 프로파일 빌더 (API 전달용) ---
    const buildSajuProfile = (targetSaju?: any): Record<string, string> => {
        const finalSaju = targetSaju !== undefined ? targetSaju : activeSaju;
        if (!finalSaju) return {};
        // getResolvedText 내부에서 쓰는 동일한 로직으로 프로파일 생성
        const dummyText = [
            '{{DAY_MASTER_CHAR}}', '{{DAY_MASTER_ANALOGY}}', '{{DAY_MASTER_SHORT_ANALOGY}}',
            '{{KILLER_ELEMENT}}', '{{KILLER_ANALOGY}}', '{{KILLER_NAME}}',
            '{{EXPRESSION_ELEMENT}}', '{{EXPRESSION_ANALOGY}}', '{{EXPRESSION_SHORT_ANALOGY}}', '{{EXPRESSION_NAME}}',
            '{{DRYER_ELEMENT}}', '{{DRYER_ANALOGY}}',
            '{{COMPETITOR_ELEMENT}}', '{{COMPETITOR_ANALOGY}}', '{{COMPETITOR_NAME}}',
            '{{ASSET_ELEMENT}}', '{{ASSET_ANALOGY}}', '{{ASSET_SHORT_ANALOGY}}', '{{ASSET_NAME}}',
            '{{PRIMARY_CLASH}}', '{{CURRENT_DAEWOON_GANJI}}', '{{CURRENT_DAEWOON_ANALOGY}}',
            '{{SAJU_GANJI}}'
        ].join('|||');
        const resolved = getResolvedText(dummyText, finalSaju);
        const values = resolved.split('|||');
        const keys = [
            'dayMasterChar', 'dayMasterAnalogy', 'dayMasterShortAnalogy',
            'killerElement', 'killerAnalogy', 'killerName',
            'expressionElement', 'expressionAnalogy', 'expressionShortAnalogy', 'expressionName',
            'dryerElement', 'dryerAnalogy',
            'competitorElement', 'competitorAnalogy', 'competitorName',
            'assetElement', 'assetAnalogy', 'assetShortAnalogy', 'assetName',
            'primaryClash', 'currentDaewoonGanji', 'currentDaewoonAnalogy',
            'sajuGanji'
        ];
        const profile: Record<string, string> = {};
        keys.forEach((k, i) => { profile[k] = values[i] || ''; });
        return profile;
    };


    // --- 기질데이터 실시간 템플릿 치환기 (resolveDynamicText) ---
    const getResolvedText = (text: string | undefined, customSaju?: any): string => {
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

        const targetSaju = customSaju !== undefined ? customSaju : activeSaju;

        if (!targetSaju) {
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

        const saju = targetSaju;

        try {
            // --- 2. 사주 4기둥 간지 추출 로직 (위로 이동) ---
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
            if (typeof obj === 'string') {
                if (part === 'stem') return obj.charAt(0);
                if (part === 'branch' && obj.length > 1) return obj.charAt(1);
                return obj.charAt(0);
            }

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

        const dmCharFromDay = getChar(p.day, 'stem');

        // --- 1. 일간(Day Master) 동적 매핑 ---
        // [Bug Fix] dayMaster 필드가 없더라도 일주 천간에서 추출하여 신금(辛)으로 하드 폴백되는 것 방지
        const dmCharRaw = saju.dayMaster || dmCharFromDay || '辛';
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
        } catch (error) {
            console.error('⚠️ [getResolvedText] 사주 치환 연산 중 에러 발생 (안전 폴백 적용):', error);
            let resolved = text;
            Object.entries(defaultValues).forEach(([key, val]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                resolved = resolved.replace(regex, val);
            });
            return resolved;
        }
    };

    const hasAiContent = !!aiPageContent[currentPageKey];
    const ai = aiPageContent[currentPageKey] || {} as any;
    const displayTitle = hasAiContent 
        ? ai.title 
        : getResolvedText(currentPageData?.title);
    // 10모듈 필드 추출 (하위호환: 기존 6필드 데이터도 정상 표시)
    const displaySajuAnalysis = ai.sajuAnalysis || null;
    const displayDarkCode = ai.darkCodeCbt || null;
    const displayMetaCode = ai.metaCodeAct || null;
    const displayNeuralCode = ai.neuralCodeDbt || null;
    const displaySocratic = ai.socraticMbct || ai.socratic || getResolvedText(currentPageData?.socratic);
    const displayRelaxMbsr = ai.relaxMbsr || null;
    const displaySelfCompassion = ai.selfCompassionMsc || null;
    const displayCoachingSolution = ai.coachingSolution || null;
    const displayMantra = ai.mantra || ai.recursive || getResolvedText(currentPageData?.recursive);
    const displayDesc = ai.desc || getResolvedText(currentPageData?.desc);

    // --- 페이지 검색 및 필터링 ---
    const filteredPageKeys = pageKeys.filter(key => {
        const page = saju108Matrix[key];
        const hasAi = !!aiPageContent[key];
        const resolvedTitle = hasAi ? aiPageContent[key].title : getResolvedText(page.title);
        const resolvedDesc = hasAi && aiPageContent[key].darkCodeCbt 
            ? aiPageContent[key].darkCodeCbt 
            : (hasAi && aiPageContent[key].desc ? aiPageContent[key].desc : getResolvedText(page.desc));
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
                <title>명심코칭 108 자각 힐링 백서 v11</title>
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
                <h1 style="text-align: center; font-size: 28px; margin-bottom: 10px;">🌌 108 자각 힐링 백서 v11</h1>
                <p style="text-align: center; color: #555; margin-bottom: 40px;">당신의 영혼 아키텍처를 치유하는 108개의 우주 기질 설계서</p>
        `;

        pageKeys.forEach((key, index) => {
            const page = saju108Matrix[key];
            const ans = answers[key] || '(작성된 자각 기록이 없습니다.)';
            const isConfirmed = recursiveConfirmed[key] ? '승인 및 자각 완료' : '미확정 상태';

            const hasAi = !!aiPageContent[key];
            const title = hasAi ? aiPageContent[key].title : getResolvedText(page.title);
            const desc = hasAi && aiPageContent[key].desc ? aiPageContent[key].desc : getResolvedText(page.desc);
            const darkCodeCbt = hasAi ? aiPageContent[key].darkCodeCbt : null;
            const metaCodeAct = hasAi ? aiPageContent[key].metaCodeAct : null;
            const neuralCodeDbt = hasAi ? aiPageContent[key].neuralCodeDbt : null;
            const socratic = hasAi ? aiPageContent[key].socratic : getResolvedText(page.socratic);
            const recursive = hasAi ? aiPageContent[key].recursive : getResolvedText(page.recursive);

            printHtml += `
                <div class="page-break">
                    <div class="meta">PAGE ${index + 1} // CODE: ${key} ${hasAi ? '(평생 통합 리포트 AI 적용)' : ''}</div>
                    <h1>${title}</h1>
                    ${darkCodeCbt ? `
                    <div class="content-box">
                        <div class="section-title">☁️ 마음의 그림자 걷어내기 (인지 치유)</div>
                        <div class="text">${darkCodeCbt}</div>
                        <div class="section-title" style="margin-top:20px;">🌟 나의 빛나는 본질 받아들이기 (수용과 전념)</div>
                        <div class="text">${metaCodeAct}</div>
                        <div class="section-title" style="margin-top:20px;">🌿 마음이 흔들릴 때, 나를 지키는 다정한 처방전 (행동 치유)</div>
                        <div class="text">${neuralCodeDbt}</div>
                    </div>
                    ` : `
                    <div class="content-box">
                        <div class="section-title">💎 영혼의 마스터 플랜</div>
                        <div class="text">${desc}</div>
                    </div>
                    `}
                    <div class="section-title">🕊️ 고요한 내면에게 건네는 따뜻한 질문 (마음챙김 질문)</div>
                    <div class="text">${socratic}</div>
                    <div class="section-title">✍️ 나의 내면 치유 기록</div>
                    <div class="answer">${ans}</div>
                    <div class="section-title">🌸 나를 온전히 사랑하기 위한 오늘의 확언 (만트라) (스트레스 감소) (${isConfirmed})</div>
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

    const completedAnswersCount = Object.keys(answers).filter(k => answers[k]?.trim() !== '').length;
    const confirmedCount = Object.keys(recursiveConfirmed).filter(k => recursiveConfirmed[k]).length;
    const totalCompletedCount = completedAnswersCount + confirmedCount;
    const totalProgress = Math.round((totalCompletedCount / (pageKeys.length * 2)) * 100);

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
            className="fixed top-0 left-0 z-[1020] bg-gradient-to-br from-indigo-50/90 via-white/90 to-peach-50/90 backdrop-blur-2xl font-sans text-slate-700"
            style={{ width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
        >
            {/* 배경 그라데이션 오라 효과 */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />

            {/* 모바일용 오버레이 배경 */}
            {!isLargeScreen && sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== 사이드바 (PC: relative flex, 모바일: fixed overlay) ===== */}
            <div style={sidebarStyle} className="bg-white/40 border-r border-white/40 shadow-sm flex flex-col backdrop-blur-md">
                <div style={{ width: isLargeScreen ? '300px' : '280px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* 사이드바 헤더 */}
                        <div className="p-4 border-b border-white/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="text-rose-500" size={18} />
                                <span className="font-bold text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">108 자각 설계 인덱스</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-white/40 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* 사이드바 검색창 */}
                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="자각 코드 / 키워드 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/40 rounded-lg border border-white/40 focus:outline-none focus:border-pink-500/50 text-xs text-slate-800 placeholder-slate-400 transition-colors"
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
                                                ? 'bg-gradient-to-r from-rose-100 to-indigo-100 border-rose-200 shadow-[0_4px_12px_rgba(236,72,153,0.15)] text-indigo-900'
                                                : 'bg-white/30 border-transparent hover:bg-white/40 text-slate-500 hover:text-indigo-600'
                                        }`}
                                    >
                                        <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                            isCurrent ? 'bg-rose-200 text-rose-700' : 'bg-white/40 text-slate-500'
                                        }`}>
                                            {String(idx + 1).padStart(3, '0')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                                <span>CODE: {key}</span>
                                                {isAnswered && <span className="text-teal-500">● 기록</span>}
                                                {isConfirmed && <span className="text-rose-500">● 자각</span>}
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
                <header className="h-14 sm:h-16 border-b border-white/40 bg-white/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {/* 햄버거 토글 메뉴 버튼 (사이드바 제어) */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="bg-white/40 border border-white/40 hover:bg-white/70 text-slate-600 p-2 rounded-xl transition-all"
                            title="메뉴 열기/닫기"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-widest hidden xs:inline">SAJU OS v4.0</span>
                            <span className="bg-rose-500/10 border border-pink-500/30 text-[9px] sm:text-[10px] font-bold text-rose-500 px-2 py-0.5 rounded-full">108 자각 백서</span>
                        </div>
                    </div>

                    {/* 이완 사운드 & 심호흡 컨트롤 */}
                    <div className="flex items-center gap-2">
                        {/* 새 기질로 다시 생성 버튼 */}
                        {activeSaju && userKey !== 'guest' && (
                            <button
                                onClick={forceRegenerateCurrentPage}
                                disabled={isGeneratingAi}
                                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-[9px] font-bold tracking-wider ${
                                    isGeneratingAi
                                        ? 'bg-rose-500/10 border-pink-500/30 text-pink-300 cursor-not-allowed shadow-[0_0_10px_rgba(236,72,153,0.1)]'
                                        : 'bg-white/40 border-white/40 hover:bg-white/70 text-slate-500 hover:text-rose-500 hover:border-pink-500/20'
                                }`}
                            >
                                <RefreshCw size={14} className={isGeneratingAi ? 'animate-spin text-rose-500' : ''} />
                                {isGeneratingAi ? '생성 중...' : '새 기질로 다시 생성 (AI)'}
                            </button>
                        )}

                        <button
                            onClick={toggleBgm}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                                isPlayingBgm
                                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                                    : 'bg-white/40 border-white/40 hover:bg-white/70 text-slate-500 hover:text-indigo-600'
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
                                    : 'bg-white/40 border-white/40 hover:bg-white/70 text-slate-500 hover:text-indigo-600'
                            }`}
                        >
                            <Heart size={16} className={isBreathingActive ? 'animate-pulse' : ''} />
                            <span className="text-[9px] font-bold tracking-wider hidden md:inline">이완 심호흡</span>
                        </button>

                        <button
                            onClick={triggerFullPrint}
                            className="bg-white/40 border border-white/40 hover:bg-white/70 text-slate-600 hover:text-slate-800 p-2 rounded-xl transition-all"
                            title="전체 기록 PDF 저장"
                        >
                            <FileText size={16} />
                        </button>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/40 hover:bg-rose-100 border border-white/40 hover:border-rose-300 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </header>

                {/* 2. 스크롤 영역 (inline style로 완벽한 flex overflow 제어) */}
                <div className="custom-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    {/* 진행률 게이지 배너 */}
                    <div className="w-full max-w-3xl bg-white/30 border border-white/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg transition-all duration-500">
                                {totalProgress < 25 ? (
                                    <span className="text-lg animate-pulse" title="알">🥚</span>
                                ) : totalProgress < 50 ? (
                                    <span className="text-lg drop-shadow-sm animate-bounce" title="부화">🐣</span>
                                ) : totalProgress < 75 ? (
                                    <span className="text-lg drop-shadow-md" title="아기 공룡">🦕</span>
                                ) : (
                                    <span className="text-xl drop-shadow-lg" title="어른 공룡">🦖</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider">나의 내면 디버깅 진행도</h4>
                                <p className="text-[8px] sm:text-[9px] text-slate-500">108 자각 설계 중 총 {totalCompletedCount}개 성찰 완료</p>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden border border-white/40 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalProgress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 w-8 text-right">{totalProgress}%</span>
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
                                <div className="bg-gradient-to-br from-teal-50/80 to-blue-50/80 border border-teal-200 shadow-lg rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center space-y-3 backdrop-blur-md relative">
                                    <div className="absolute top-2.5 right-2.5">
                                        <button
                                            onClick={stopBreathing}
                                            className="text-slate-500 hover:text-slate-800 p-1 hover:bg-white/40 rounded-md"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-[10px] sm:text-xs font-bold text-teal-500 tracking-widest uppercase">
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
                                            className="absolute inset-0 rounded-full border border-teal-300/50 shadow-[0_0_30px_rgba(45,212,191,0.3)] pointer-events-none"
                                        />

                                        <motion.div
                                            animate={{
                                                scale: breathingPhase === 'inhale' ? 1.15 : breathingPhase === 'hold' ? 1.15 : 0.9,
                                                backgroundColor:
                                                    breathingPhase === 'inhale'
                                                        ? 'rgba(45, 212, 191, 0.3)'
                                                        : breathingPhase === 'hold'
                                                        ? 'rgba(99, 102, 241, 0.3)'
                                                        : 'rgba(244, 63, 94, 0.3)',
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
                                            <span className="text-xl sm:text-2xl font-black text-slate-800">{breathingTimer}</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 메인 성찰 카드 영역 */}
                    <main className="w-full max-w-3xl flex flex-col space-y-4 sm:space-y-6 pb-16 lg:pb-24">
                        {/* 성찰 카드 */}
                        <div className="bg-white/60 border border-white/400 shadow-xl shadow-indigo-100/40 hover:border-pink-500/10 shadow-2xl rounded-3xl p-5 sm:p-7 backdrop-blur-md relative flex flex-col space-y-4 sm:space-y-5 transition-all duration-300 w-full">
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
                                            className="absolute w-[90%] h-[90%] rounded-full bg-white/80 border border-white/50 flex items-center justify-center shadow-[inset_0_0_20px_rgba(236,72,153,0.25)]"
                                        >
                                            <Sparkles className="text-rose-500 animate-pulse" size={24} />
                                        </motion.div>
                                    </div>
                                    <div className="text-center space-y-2.5 px-4 max-w-md">
                                        <span className="text-[9px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 uppercase animate-pulse">AI Synthesis Channeling</span>
                                        <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                                            명심AI 코치가 당신의 기질 주파수를 감지하여<br className="hidden sm:inline" /> 백서를 실시간 집필하는 중입니다...
                                        </p>
                                        <div className="flex items-center justify-center gap-1.5 pt-1">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
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
                                            <span className="text-[8px] sm:text-[9px] font-black text-rose-500 tracking-widest uppercase">
                                                PAGE {currentPageIndex + 1} // {hasAiContent ? '🌸 AI 초개인화 맞춤집필' : 'MIND REFRESH'}
                                            </span>
                                            {hasAiContent && (
                                                <span className="bg-rose-500/10 border border-pink-500/20 text-[8px] font-bold text-rose-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_8px_rgba(236,72,153,0.1)]">
                                                    <Sparkles size={8} className="animate-spin-slow" /> AI 맞춤 백서
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-base sm:text-xl font-extrabold text-slate-800 leading-snug">
                                            {displayTitle}
                                        </h1>
                                    </div>

                                    {/* ===== 10개 모듈 초고도화 시스템 ===== */}
                                    {hasAiContent && displayDarkCode ? (
                                        <div className="space-y-4">
                                            {/* 1. 사주 기질 분석 카드 */}
                                            {displaySajuAnalysis && (
                                            <div onClick={() => handleExpandModule('sajuAnalysis', '나의 사주 기질 분석', '🔮', 'slate', displaySajuAnalysis)} className="p-4 bg-gradient-to-r from-slate-50/80 to-indigo-50/60 border border-slate-200/60 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
                                                <h3 className="text-slate-700 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🔮 나의 사주 기질 분석 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">사주 해석</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displaySajuAnalysis}</p>
                                            </div>
                                            )}

                                            {/* 2. CBT 다크코드 */}
                                            <div onClick={() => handleExpandModule('darkCodeCbt', '다크코드 — 생각의 함정 걷어내기', '🌑', 'rose', displayDarkCode!)} className="p-4 bg-gradient-to-r from-rose-50/60 to-white/60 border border-rose-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-rose-300 transition-all duration-300 group">
                                                <h3 className="text-rose-600 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🌑 다크코드 — 생각의 함정 걷어내기 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">CBT 인지치유</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displayDarkCode}</p>
                                            </div>

                                            {/* 3. ACT 메타코드 */}
                                            <div onClick={() => handleExpandModule('metaCodeAct', '메타코드 — 빛나는 본질 받아들이기', '✨', 'indigo', displayMetaCode!)} className="p-4 bg-gradient-to-r from-indigo-50/60 to-white/60 border border-indigo-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group">
                                                <h3 className="text-indigo-600 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    ✨ 메타코드 — 빛나는 본질 받아들이기 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">ACT 수용전념</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displayMetaCode}</p>
                                            </div>

                                            {/* 4. DBT 뉴럴코드 */}
                                            <div onClick={() => handleExpandModule('neuralCodeDbt', '뉴럴코드 — 마음이 흔들릴 때 처방전', '🧬', 'teal', displayNeuralCode!)} className="p-4 bg-gradient-to-r from-teal-50/60 to-white/60 border border-teal-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-teal-300 transition-all duration-300 group">
                                                <h3 className="text-teal-600 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🧬 뉴럴코드 — 마음이 흔들릴 때 처방전 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">DBT 행동치유</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displayNeuralCode}</p>
                                            </div>

                                            {/* 5. MBCT 마음챙김 자각 */}
                                            <div onClick={() => handleExpandModule('socraticMbct', '마음챙김 자각 질문', '🕊️', 'amber', displaySocratic)} className="p-4 bg-gradient-to-r from-amber-50/60 to-white/60 border border-amber-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-amber-300 transition-all duration-300 group">
                                                <h3 className="text-amber-700 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🕊️ 마음챙김 자각 질문 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">MBCT 마음챙김</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displaySocratic}</p>
                                            </div>

                                            {/* 6. MBSR 스트레스 이완 */}
                                            {displayRelaxMbsr && (
                                            <div onClick={() => handleExpandModule('relaxMbsr', '스트레스 이완 안내', '🧘', 'cyan', displayRelaxMbsr)} className="p-4 bg-gradient-to-r from-cyan-50/60 to-white/60 border border-cyan-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-cyan-300 transition-all duration-300 group">
                                                <h3 className="text-cyan-700 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🧘 스트레스 이완 안내 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">MBSR 이완</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displayRelaxMbsr}</p>
                                            </div>
                                            )}

                                            {/* 7. MSC 자기연민 */}
                                            {displaySelfCompassion && (
                                            <div onClick={() => handleExpandModule('selfCompassionMsc', '자기연민 실천', '💛', 'purple', displaySelfCompassion)} className="p-4 bg-gradient-to-r from-purple-50/60 to-white/60 border border-purple-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all duration-300 group">
                                                <h3 className="text-purple-600 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    💛 자기연민 실천 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">MSC 자기연민</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displaySelfCompassion}</p>
                                            </div>
                                            )}

                                            {/* 8. 코칭 솔루션 */}
                                            {displayCoachingSolution && (
                                            <div onClick={() => handleExpandModule('coachingSolution', '오늘의 코칭 솔루션', '🎯', 'emerald', displayCoachingSolution)} className="p-4 bg-gradient-to-r from-emerald-50/60 to-white/60 border border-emerald-200/50 rounded-2xl backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group">
                                                <h3 className="text-emerald-600 font-bold mb-2 flex items-center gap-2 text-sm">
                                                    🎯 오늘의 코칭 솔루션 <span className="text-[10px] text-slate-400 font-normal bg-white/60 px-2 py-0.5 rounded-full">실천 과제</span>
                                                    <span className="ml-auto text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">클릭하면 자세히 →</span>
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">{displayCoachingSolution}</p>
                                            </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-5 md:p-6 bg-white/40 border border-white/50 rounded-2xl text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap shadow-inner relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500"></div>
                                            {displayDesc}
                                        </div>
                                    )}

                                    {/* MBCT 소크라테스식 자각 질문 (AI가 없을 때도 기본 데이터로 표시) */}
                                    {!hasAiContent && (
                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                            🕊️ 고요한 내면에게 건네는 따뜻한 질문
                                            <span className="text-xs text-slate-400 font-normal bg-white/40 px-2 py-0.5 rounded-full">마음챙김 질문</span>
                                        </h3>
                                        <div className="p-4 md:p-5 bg-rose-500/10 border border-pink-500/20 rounded-2xl text-indigo-900/90 leading-relaxed text-[15px] shadow-[0_4px_20px_rgba(236,72,153,0.05)]">
                                            {displaySocratic}
                                        </div>
                                    </div>
                                    )}

                                    {/* 자각 기록 textarea */}
                                    <div className="mt-4 space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            ✍️ 나의 자각 기록
                                        </h3>
                                        <textarea
                                            value={answers[currentPageKey] || ''}
                                            onChange={(e) => handleAnswerChange(currentPageKey, e.target.value)}
                                            placeholder="마음의 대답을 다정하게 기록해 봅니다..."
                                            className="w-full h-16 sm:h-20 p-2.5 bg-white/60 rounded-xl border border-white/40 focus:outline-none focus:border-pink-500/50 text-[11px] sm:text-xs text-slate-800 placeholder-gray-600 transition-all leading-relaxed resize-none"
                                        />
                                    </div>

                                    {/* 9. 만트라 확언 + 승인 버튼 */}
                                    <div className="bg-gradient-to-r from-rose-50/50 via-indigo-50/50 to-transparent border border-rose-100 rounded-2xl p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                                        <div className="flex-1 space-y-0.5">
                                            <span className="text-slate-800 text-sm font-semibold">🌸 만트라 — 나를 온전히 사랑하는 확언 <span className="text-xs text-slate-400 font-normal bg-slate-200/50 px-2 py-0.5 rounded-full ml-1">확언</span></span>
                                            <div className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                "{displayMantra}"
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleConfirmRecursive(currentPageKey)}
                                            className={`w-full xs:w-auto px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                                                recursiveConfirmed[currentPageKey]
                                                    ? 'bg-rose-500 text-slate-800 shadow-[0_4px_12px_rgba(236,72,153,0.25)] hover:bg-rose-600'
                                                    : 'bg-white/40 border border-white/50 hover:bg-white/70 text-rose-500 hover:text-slate-800'
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
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/40 hover:bg-white/70 border border-white/40 text-slate-500 hover:text-indigo-600 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider">
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
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/40 hover:bg-white/70 border border-white/40 text-slate-500 hover:text-indigo-600 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>

                {/* ===== 모듈 상세 풀이 모달 ===== */}
                <AnimatePresence>
                    {expandedModule && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                            onClick={() => setExpandedModule(null)}
                        >
                            {/* 백드롭 */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                            {/* 모달 카드 */}
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 sm:p-8 z-10"
                            >
                                {/* 닫기 버튼 */}
                                <button
                                    onClick={() => setExpandedModule(null)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
                                >
                                    <X size={16} />
                                </button>

                                {/* 아이콘 + 제목 */}
                                <div className="flex items-start gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-indigo-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                                        {expandedModule.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold text-slate-800 leading-snug">{expandedModule.label}</h2>
                                        <p className="text-[11px] text-slate-400 mt-0.5">AI가 당신의 기질에 맞춰 자세히 풀어드려요</p>
                                    </div>
                                </div>

                                {/* 요약 원문 */}
                                <div className="bg-gradient-to-r from-rose-50/60 to-indigo-50/40 border border-slate-200/50 rounded-2xl p-4 mb-5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">요약</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{expandedModule.shortContent}</p>
                                </div>

                                {/* 상세 풀이 */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles size={10} /> 상세 풀이
                                    </p>
                                    {isExpandLoading ? (
                                        <div className="flex flex-col items-center py-8 space-y-3">
                                            <div className="relative w-12 h-12">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 to-indigo-400 opacity-50 blur-sm"
                                                />
                                                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                                                    <Sparkles size={16} className="text-rose-500 animate-pulse" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500">AI 코치가 상세하게 풀어쓰는 중...</p>
                                        </div>
                                    ) : expandedDetail[`${currentPageKey}_${expandedModule.type}`] ? (
                                        <div className="text-[14px] text-slate-700 leading-[1.8] whitespace-pre-wrap">
                                            {expandedDetail[`${currentPageKey}_${expandedModule.type}`]}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">생성 중 오류가 발생했어요. 다시 클릭해 주세요.</p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
    , portalContainer!);
}

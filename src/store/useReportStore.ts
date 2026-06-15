import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // [Deep Tech] 영속성 모듈
import { ReportData } from '@/types/report';
import { mockReport } from '@/data/mockReport';

export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface EgoSyncMessage {
    role: 'user' | 'model';
    content: string;
    step?: number;
    egoPattern?: string;
    validation?: string;
    coachingQuestion?: string;
}

interface ReportStore {
    // 1. UI States
    currentStep: number;
    totalSteps: number;
    isLoading: boolean; // 로딩 상태 추가
    error: string | null; // 에러 상태 추가

    // 2. Data States
    reportData: ReportData | null;
    dailyChecklistAnswers: { q: string; a: string }[] | null;
    deepScanResult: string | null;

    // [NEW] Planner & Ego Sync States
    isPlannerApplied: boolean;
    isPlannerOpen: boolean;
    fptiResultType: ElementKey | null;
    fptiAnswers: Record<string, number> | null;
    fptiBirthOhaeng: Record<string, number> | null;
    fptiAvatarCode: string | null; // FPTI 유형 코드 (예: DMG 능숙한 기술자)
    egoSyncHistory: EgoSyncMessage[];
    egoSyncStep: number;
    egoSyncBlur: boolean;
    egoSyncSpeed: 'slow' | 'standard';

    // 3. Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    // 데이터 업데이트 (Partial 허용)
    setReportData: (data: ReportData) => void;
    updateUserData: (data: Partial<ReportData>) => void;
    setDailyChecklistAnswers: (answers: { q: string; a: string }[]) => void;
    setDeepScanResult: (result: string | null) => void;

    // [NEW] Planner & Ego Sync Actions
    setPlannerApplied: (applied: boolean) => void;
    setPlannerOpen: (open: boolean) => void;
    setFptiData: (
        resultType: ElementKey,
        answers: Record<string, number>,
        birthOhaeng: Record<string, number>,
        avatarCode: string
    ) => void;
    addEgoSyncMessage: (msg: EgoSyncMessage) => void;
    resetEgoSync: () => void;
    setEgoSyncUI: (blur: boolean, speed: 'slow' | 'standard', step: number) => void;

    // 초기화 (로그아웃 시 필요)
    reset: () => void;
}

export const useReportStore = create<ReportStore>()(
    persist(
        (set, get) => ({
            // Initial States
            currentStep: 1,
            totalSteps: 13,
            isLoading: false,
            error: null,
            reportData: null, // [Fix] Mock 사용 중단 (실제 데이터 우선)
            dailyChecklistAnswers: null,
            deepScanResult: null,

            // [NEW] Initial Planner & Ego Sync States
            isPlannerApplied: false,
            isPlannerOpen: false,
            fptiResultType: null,
            fptiAnswers: null,
            fptiBirthOhaeng: null,
            fptiAvatarCode: null,
            egoSyncHistory: [],
            egoSyncStep: 1,
            egoSyncBlur: false,
            egoSyncSpeed: 'standard',

            // Actions
            setStep: (step) => set({ currentStep: step }),

            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, state.totalSteps)
            })),

            prevStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 1)
            })),

            // [Fix] 전체 데이터 덮어쓰기 (API 로드 직후 사용)
            setReportData: (data) => set({ reportData: data, error: null }),

            // [Fix] 부분 업데이트 (Null Trap 해결)
            updateUserData: (data) => set((state) => ({
                reportData: state.reportData
                    ? { ...state.reportData, ...data }
                    : (data as ReportData) // 데이터가 없으면 새로 들어온 걸로 초기화
            })),

            setDailyChecklistAnswers: (answers) => set({ dailyChecklistAnswers: answers }),
            setDeepScanResult: (result) => set({ deepScanResult: result }),

            // [NEW] Planner & Ego Sync Actions
            setPlannerApplied: (applied) => set({ isPlannerApplied: applied }),
            setPlannerOpen: (open) => set({ isPlannerOpen: open }),
            setFptiData: (resultType, answers, birthOhaeng, avatarCode) => set({
                fptiResultType: resultType,
                fptiAnswers: answers,
                fptiBirthOhaeng: birthOhaeng,
                fptiAvatarCode: avatarCode,
                isPlannerApplied: true
            }),
            addEgoSyncMessage: (msg) => set((state) => ({
                egoSyncHistory: [...state.egoSyncHistory, msg]
            })),
            resetEgoSync: () => set({
                egoSyncHistory: [],
                egoSyncStep: 1,
                egoSyncBlur: false,
                egoSyncSpeed: 'standard'
            }),
            setEgoSyncUI: (blur, speed, step) => set({
                egoSyncBlur: blur,
                egoSyncSpeed: speed,
                egoSyncStep: step
            }),

            // [Deep Tech] 로그아웃 시 스토어 비우기
            reset: () => set({
                currentStep: 1,
                reportData: null,
                isLoading: false,
                error: null,
                isPlannerApplied: false,
                isPlannerOpen: false,
                fptiResultType: null,
                fptiAnswers: null,
                fptiBirthOhaeng: null,
                fptiAvatarCode: null,
                egoSyncHistory: [],
                egoSyncStep: 1,
                egoSyncBlur: false,
                egoSyncSpeed: 'standard',
            }),
        }),
        {
            name: 'myeongsim-report-storage', // LocalStorage Key Name
            storage: createJSONStorage(() => localStorage), // [Fix] localStorage로 변경 → 탭 간 데이터 공유 + 페이지 이동 후에도 유지
            version: 5, // [Fix] Version Bump to update schemas to FPTI
            partialize: (state) => ({
                // 저장하고 싶은 상태만 선택 (로딩 상태 같은 건 저장 안 함)
                currentStep: state.currentStep,
                reportData: state.reportData,
                dailyChecklistAnswers: state.dailyChecklistAnswers,
                deepScanResult: state.deepScanResult,
                isPlannerApplied: state.isPlannerApplied,
                fptiResultType: state.fptiResultType,
                fptiAnswers: state.fptiAnswers,
                fptiBirthOhaeng: state.fptiBirthOhaeng,
                fptiAvatarCode: state.fptiAvatarCode,
                egoSyncHistory: state.egoSyncHistory,
                egoSyncStep: state.egoSyncStep,
                egoSyncBlur: state.egoSyncBlur,
                egoSyncSpeed: state.egoSyncSpeed,
            }),
        }
    )
);

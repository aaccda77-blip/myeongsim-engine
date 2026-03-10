import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // [Deep Tech] 영속성 모듈
import { ReportData } from '@/types/report';
import { mockReport } from '@/data/mockReport';

interface ReportStore {
    // 1. UI States
    currentStep: number;
    totalSteps: number;
    isLoading: boolean; // 로딩 상태 추가
    error: string | null; // 에러 상태 추가

    // 2. Data States
    reportData: ReportData | null;

    // 3. Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    // 데이터 업데이트 (Partial 허용)
    setReportData: (data: ReportData) => void;
    updateUserData: (data: Partial<ReportData>) => void;

    // 초기화 (로그아웃 시 필요)
    reset: () => void;
}

export const useReportStore = create<ReportStore>()(
    persist(
        (set, get) => ({
            // Initial States
            currentStep: 1,
            totalSteps: 14,
            isLoading: false,
            error: null,
            reportData: null, // [Fix] Mock 사용 중단 (실제 데이터 우선)

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

            // [Deep Tech] 로그아웃 시 스토어 비우기
            reset: () => set({
                currentStep: 1,
                reportData: null,
                isLoading: false,
                error: null
            }),
        }),
        {
            name: 'myeongsim-report-storage', // LocalStorage Key Name
            storage: createJSONStorage(() => sessionStorage), // [Security] 개인정보이므로 SessionStorage 권장 (탭 닫으면 삭제)
            version: 2, // [Fix] Version Bump to invalidate old 'Gyeong-sin' mock data
            // 만약 브라우저를 껐다 켜도 유지하고 싶다면 localStorage를 쓰되, 민감 정보 처리에 주의해야 합니다.
            partialize: (state) => ({
                // 저장하고 싶은 상태만 선택 (로딩 상태 같은 건 저장 안 함)
                currentStep: state.currentStep,
                reportData: state.reportData
            }),
        }
    )
);

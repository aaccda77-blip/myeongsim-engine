import { create } from 'zustand';
import { ReportData } from '@/types/report';
import { mockReport } from '@/data/mockReport';

interface ReportStore {
    currentStep: number;
    totalSteps: number;
    reportData: ReportData | null;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateUserData: (data: Partial<ReportData>) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
    currentStep: 1,
    totalSteps: 12,
    reportData: mockReport, // Initialize with mock data directly for demo
    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    updateUserData: (data: Partial<ReportData>) => set((state) => ({
        reportData: state.reportData ? { ...state.reportData, ...data } : null
    })),
}));

/**
 * questUnlockManager.ts
 * 
 * 명심코칭 평생교육원 공인 5단계 자격 사다리 & 게이미피케이션 스킬트리 매니저
 * 
 * 기능:
 * - 로컬스토리지 기반 자격 취득 및 학습 진도 영구 보존
 * - 레벨별 드릴메뉴 스킬 해금 상태 판정
 * - 승급 시험(Exam) 합격 시 자동 레벨업 및 실시간 UI 동기화
 * - 관리자/대표님 검토를 위한 [전체 자격 즉시 해금] 치트키 지원
 */

import { ACADEMY_COURSES, AcademyCourseLevel, ACADEMY_TEXTBOOKS } from '@/data/MyeongsimAcademyDB';

export interface AcademyState {
    currentLevel: number; // 0 ~ 5
    passedExams: string[];
    readTextbooks: string[];
    isCheatUnlocked: boolean; // 관리자 프리패스
    lastUnlockedAt?: string;
    newlyUnlockedSkillIds: string[];
}

const STORAGE_KEY = 'myeongsim_academy_cert_state_v1';
export const ACADEMY_UPDATE_EVENT = 'myeongsim_academy_updated';

// 기본 초기 상태 (Level 0: 오픈클래스 입문)
const DEFAULT_STATE: AcademyState = {
    currentLevel: 0,
    passedExams: [],
    readTextbooks: [],
    isCheatUnlocked: false,
    newlyUnlockedSkillIds: []
};

/**
 * 로컬스토리지에서 현재 교육원 자격 상태 로드
 */
export function getAcademyState(): AcademyState {
    if (typeof window === 'undefined') return DEFAULT_STATE;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_STATE,
            ...parsed
        };
    } catch (e) {
        console.error('Failed to load academy cert state:', e);
        return DEFAULT_STATE;
    }
}

/**
 * 상태 저장 및 리스너 이벤트 브로드캐스트
 */
export function saveAcademyState(state: AcademyState): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent(ACADEMY_UPDATE_EVENT, { detail: state }));
    } catch (e) {
        console.error('Failed to save academy cert state:', e);
    }
}

/**
 * 특정 스킬 아이콘이 해금되었는지 여부 판별
 */
export function isSkillUnlocked(skillId: string): boolean {
    const state = getAcademyState();

    // 관리자 치트 모드이거나 레벨 5(마스터)인 경우 모든 스킬 열림
    if (state.isCheatUnlocked || state.currentLevel >= 5) {
        return true;
    }

    // 기본 오픈 스킬 (오픈클래스 Level 0)
    const baseSkills = ['MY_REPORT', 'MEMORY_DOJO', 'BENCHMARK', 'LIBRARY', 'ORACLE_CARD'];
    if (baseSkills.includes(skillId)) return true;

    // 현재 레벨까지 누적 해금된 모든 스킬 ID 목록 수집
    const unlockedPool: string[] = [...baseSkills];
    for (const course of ACADEMY_COURSES) {
        if (state.currentLevel >= course.levelNumber) {
            unlockedPool.push(...course.unlockedSkillIds);
        }
    }

    return unlockedPool.includes(skillId);
}

/**
 * 특정 스킬을 해금하기 위해 필요한 자격 단계 정보 조회
 */
export function getRequiredCourseForSkill(skillId: string): AcademyCourseLevel | null {
    for (const course of ACADEMY_COURSES) {
        if (course.unlockedSkillIds.includes(skillId)) {
            return course;
        }
    }
    return null;
}

/**
 * 승급 시험(Exam Quiz) 합격 처리 및 레벨업
 */
export function passAcademyExam(quizId: string, examLevel: number): {
    success: boolean;
    leveledUp: boolean;
    newLevel: number;
    newlyUnlockedSkills: string[];
} {
    const state = getAcademyState();

    const passedExams = Array.from(new Set([...state.passedExams, quizId]));
    let newLevel = state.currentLevel;
    let leveledUp = false;
    let newlyUnlockedSkills: string[] = [];

    // 현재 레벨 이상의 시험을 통과한 경우 레벨 승급
    if (examLevel > state.currentLevel) {
        newLevel = examLevel;
        leveledUp = true;

        const targetCourse = ACADEMY_COURSES.find(c => c.levelNumber === newLevel);
        if (targetCourse) {
            newlyUnlockedSkills = targetCourse.unlockedSkillIds;
        }
    }

    const nextState: AcademyState = {
        ...state,
        currentLevel: newLevel,
        passedExams,
        lastUnlockedAt: new Date().toISOString(),
        newlyUnlockedSkillIds: newlyUnlockedSkills
    };

    saveAcademyState(nextState);

    return {
        success: true,
        leveledUp,
        newLevel,
        newlyUnlockedSkills
    };
}

/**
 * 교재 완독 처리
 */
export function markTextbookRead(bookId: string): void {
    const state = getAcademyState();
    if (state.readTextbooks.includes(bookId)) return;

    const nextState: AcademyState = {
        ...state,
        readTextbooks: [...state.readTextbooks, bookId]
    };
    saveAcademyState(nextState);
}

/**
 * 대표님 및 관리자 검토를 위한 [전체 자격 즉시 해금] 치트 스위치
 */
export function toggleAcademyCheatMode(): boolean {
    const state = getAcademyState();
    const nextVal = !state.isCheatUnlocked;
    const nextState: AcademyState = {
        ...state,
        isCheatUnlocked: nextVal,
        currentLevel: nextVal ? 5 : 0
    };
    saveAcademyState(nextState);
    return nextVal;
}

/**
 * 특정 레벨로 직접 승급 (테스트 및 디버그용)
 */
export function setAcademyLevelDirectly(level: number): void {
    const state = getAcademyState();
    const clamped = Math.max(0, Math.min(5, level));
    const nextState: AcademyState = {
        ...state,
        currentLevel: clamped
    };
    saveAcademyState(nextState);
}

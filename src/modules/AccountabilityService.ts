
export interface DailyMission {
    id: string;
    text: string;
    timestamp: number; // created at
    isCompleted: boolean;
    checkedAt?: number; // when user responded
}

const STORAGE_KEY = 'myeongsim_accountability_mission';

/**
 * AccountabilityService
 * 코칭 전문가 관점: "Accountability Check-in" 기능 구현
 * - 사용자의 미션을 로컬에 저장하고, 다음 방문 시 확인
 */
export class AccountabilityService {

    /**
     * 오늘의 미션 저장
     */
    static saveMission(text: string): DailyMission {
        const mission: DailyMission = {
            id: Date.now().toString(),
            text,
            timestamp: Date.now(),
            isCompleted: false
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
        }
        return mission;
    }

    /**
     * 체크인이 필요한 미션 확인
     * 조건:
     * 1. 미션이 존재함
     * 2. 아직 완료/체크 안됨
     * 3. 등록한 지 4시간 이상 지남 (너무 바로 물어보면 방금 설정한 거라 이상함)
     */
    static checkPending(): DailyMission | null {
        if (typeof window === 'undefined') return null;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const mission: DailyMission = JSON.parse(stored);
        const now = Date.now();
        const fourHours = 4 * 60 * 60 * 1000;

        // 이미 체크했거나 완료했으면 패스
        if (mission.checkedAt || mission.isCompleted) return null;

        // 설정한 지 4시간은 지났는지 확인
        if (now - mission.timestamp > fourHours) {
            return mission;
        }

        return null; // 아직 너무 이름
    }

    /**
     * 미션 결과 처리
     */
    static markResult(missionId: string, success: boolean): void {
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const mission: DailyMission = JSON.parse(stored);
        if (mission.id === missionId) {
            mission.isCompleted = success;
            mission.checkedAt = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
        }
    }

    /**
     * 현재 저장된 미션 가져오기 (디버그/UI용)
     */
    static getCurrentMission(): DailyMission | null {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
}

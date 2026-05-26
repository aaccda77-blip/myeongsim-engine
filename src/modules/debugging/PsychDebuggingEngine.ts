/**
 * PsychDebuggingEngine.ts
 * 3세대 심리 코칭 진단 알고리즘 핵심 엔진 (ACT/CBT 디버깅 라이브러리)
 * 
 * 내담자의 실시간 심리 스코어링 데이터를 기반으로 오류 진단 및 ACT 프로토콜 매핑 수행
 */

export interface PsychologicalMetrics {
    fusionScore: number;         // 인지적 융합도 (높을수록 생각에 함몰됨)
    avoidanceScore: number;      // 경험적 회피 (높을수록 불안을 미루고 실행 보류)
    perfectionismScore: number;  // 완벽주의 과열도 (높을수록 100% 무결점 추구)
}

export interface DebuggingMission {
    bugCode: string;             // 오류 진단 코드
    bugTitle: string;            // 오류명 (한글)
    bugSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    errorLog: string;            // 에이전트 분석용 시뮬레이션 로그
    defusionTargetText: string;  // 1단계 탈융합 텍스트 격리 목표
    actionTimeSeconds: number;   // 2단계 마이크로 타이머 가동 시간 (기본 300초 = 5분)
    actionGuide: string;         // 마이크로 행동 미션 가이드
    recommendedConcept: string;  // ACT 극복 핵심 개념
}

export class PsychDebuggingEngine {
    
    // 심리 스코어에 따른 실시간 심리 오류 및 ACT 미션 분석
    static diagnose(metrics: PsychologicalMetrics): DebuggingMission {
        const { fusionScore, avoidanceScore, perfectionismScore } = metrics;
        
        // 1순위: 완벽주의 과열에 따른 실행 지연 락 (CRITICAL)
        if (perfectionismScore >= 80 && avoidanceScore >= 70) {
            return {
                bugCode: 'ERR_OVER_THINKING_LOCK',
                bugTitle: '대뇌 OS 실행 지연 강박 락(Lock)',
                bugSeverity: 'CRITICAL',
                errorLog: `[SYSTEM ERROR] '완벽주의 인성 모듈'이 과열 상태(${perfectionismScore}%)에 도달하여 메인 프로세서의 동작이 중단(Thread-Lock)되었습니다. 실패에 대한 두려움으로 인해 실행 출력이 지연(Latent avoidance)되고 있습니다.`,
                defusionTargetText: '완벽하게 준비하지 못하면 나는 반드시 처참하게 실패할 것이다',
                actionTimeSeconds: 300,
                actionGuide: '완벽한 결과물 제작은 잠시 락(Lock) 처리합니다. 지금 당장 퀄리티와 무관하게 제목 1줄 적기, 책상 정리하기처럼 극도로 단순한 행동을 5분간 수행하십시오.',
                recommendedConcept: '탈융합(Defusion) & 가치 기반 마이크로 전념 행동'
            };
        }
        
        // 2순위: 높은 인지적 융합 및 에고 과열 상태 (HIGH)
        if (fusionScore >= 80) {
            return {
                bugCode: 'ERR_AMYGDALA_HIJACK',
                bugTitle: '감정적 융합 및 편도체 납치 에러',
                bugSeverity: 'HIGH',
                errorLog: `[SYSTEM ALERT] 인지 융합 지표 과각성(${fusionScore}%). 생각이 사실과 융합(Fusion)되어 편도체가 자동 경보를 가동하고 있습니다. '나는 약자다'라는 스키마가 가동 중입니다.`,
                defusionTargetText: '사람들은 나의 약점과 실수를 보고 나를 비웃고 무시할 것이다',
                actionTimeSeconds: 300,
                actionGuide: '머릿속의 부정적 생각 팝업창을 백그라운드로 강제 격리시킵니다. 감정의 폭풍을 3인칭의 눈으로 고요하게 관찰하면서, 심호흡과 함께 5분간 현재 신체 감각에 집중해 보세요.',
                recommendedConcept: '맥락으로서의 자기(Self-as-Context) & 인지적 유연성'
            };
        }
        
        // 3순위: 불안 회피에 의한 우회 및 고립 (MEDIUM)
        if (avoidanceScore >= 80) {
            return {
                bugCode: 'ERR_DREADED_ESCAPE',
                bugTitle: '경험적 불안 우회 피난 루프',
                bugSeverity: 'MEDIUM',
                errorLog: `[SYSTEM WARNING] 불안 회피 패턴 발동(${avoidanceScore}%). 불편함과 두려움을 피하기 위해 가상 세계나 자극적인 도피로 시스템 에너지를 우회 소모하고 있습니다.`,
                defusionTargetText: '지금 이 불안을 마주하면 감당할 수 없을 정도로 붕괴될 것이다',
                actionTimeSeconds: 300,
                actionGuide: '불안은 피할수록 커지는 악성 루프입니다. 불안이라는 감정을 물리치려 하지 말고, 몸 안의 하나의 에너지 파동으로 가만히 품은 채로, 5분간 아주 단순한 생활 행동을 개시하십시오.',
                recommendedConcept: '기꺼이 받아들임(Acceptance) & 기민한 현실 기반 전념'
            };
        }

        // 기본값: 일반 상태
        return {
            bugCode: 'SYSTEM_NORMAL',
            bugTitle: '대뇌 OS 안정 작동 상태',
            bugSeverity: 'LOW',
            errorLog: '[SYSTEM INFO] 모든 가중치 스펙트럼이 정상 허용치 이내에 머무르고 있습니다. 심리 방어 기제가 안정적으로 균형을 이루고 있습니다.',
            defusionTargetText: '내 머릿속의 사소한 걱정과 생각들',
            actionTimeSeconds: 300,
            actionGuide: '지금 하고 계신 의미 있는 활동에 평온하게 주의를 기울여 보세요. 현재 상태를 있는 그대로 만끽하는 5분간의 가벼운 알아차림(Mindfulness)을 권장합니다.',
            recommendedConcept: '현재 순간과의 접촉(Contact with the Present Moment)'
        };
    }
}

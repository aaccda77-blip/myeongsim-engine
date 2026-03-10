/**
 * LevelAssessmentQuiz.ts
 * 사용자의 건강 지식 수준을 측정하는 5문항 퀴즈
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
    id: string;
    question: string;
    options: {
        text: string;
        points: number; // 0 = beginner, 1 = intermediate, 2 = advanced
    }[];
}

export const LEVEL_ASSESSMENT_QUIZ: QuizQuestion[] = [
    {
        id: 'q1',
        question: '운동 강도를 나타내는 "RPE"가 무엇인지 아시나요?',
        options: [
            { text: '처음 들어봐요', points: 0 },
            { text: '들어본 적은 있어요', points: 1 },
            { text: '자각 운동 강도 척도입니다 (6~20점)', points: 2 }
        ]
    },
    {
        id: 'q2',
        question: '당뇨 환자가 운동할 때 혈당이 조절되는 원리를 설명할 수 있나요?',
        options: [
            { text: '잘 모르겠어요', points: 0 },
            { text: '운동하면 혈당이 내려간다는 건 알아요', points: 1 },
            { text: 'GLUT4 수용체 활성화로 포도당 흡수가 증가합니다', points: 2 }
        ]
    },
    {
        id: 'q3',
        question: '근력 운동 후 단백질 섭취 타이밍에 대해 알고 계신가요?',
        options: [
            { text: '언제 먹어도 상관없을 것 같아요', points: 0 },
            { text: '운동 후 30분~1시간 이내가 좋다고 들었어요', points: 1 },
            { text: '근단백질 합성 골든타임(anabolic window)을 알고 있어요', points: 2 }
        ]
    },
    {
        id: 'q4',
        question: '고혈압 환자에게 권장되는 운동 종류는?',
        options: [
            { text: '잘 모르겠어요', points: 0 },
            { text: '유산소 운동이 좋다고 들었어요', points: 1 },
            { text: 'ACSM 가이드라인에 따라 중강도 유산소 + 저강도 근력을 병행합니다', points: 2 }
        ]
    },
    {
        id: 'q5',
        question: '"MET"라는 단위를 사용해보신 적이 있나요?',
        options: [
            { text: '처음 들어봐요', points: 0 },
            { text: '운동 강도 단위라는 건 알아요', points: 1 },
            { text: '대사당량(Metabolic Equivalent)으로 활동 강도를 측정합니다', points: 2 }
        ]
    }
];

/**
 * 점수에 따른 레벨 판정
 */
export function calculateLevel(totalPoints: number): DifficultyLevel {
    if (totalPoints <= 3) return 'beginner';
    if (totalPoints <= 7) return 'intermediate';
    return 'advanced';
}

/**
 * 레벨별 설명
 */
export const LEVEL_DESCRIPTIONS = {
    beginner: {
        emoji: '🌱',
        label: '입문',
        description: '일반인을 위한 쉬운 설명',
        detail: '전문 용어 없이 일상 언어로 건강 지식을 전달합니다.'
    },
    intermediate: {
        emoji: '🌿',
        label: '중급',
        description: '운동 경험자를 위한 실용 지식',
        detail: '기본 전문 용어와 함께 운동 원리를 설명합니다.'
    },
    advanced: {
        emoji: '🏆',
        label: '고급',
        description: '전문가 수준의 심화 지식',
        detail: '건강운동관리사 구술시험 수준의 생리학적 메커니즘을 다룹니다.'
    }
};

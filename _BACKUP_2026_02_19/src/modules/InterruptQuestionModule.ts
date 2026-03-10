/**
 * @module InterruptQuestionModule
 * @description
 * Detects specific keywords in user input and returns 'Interrupt Questions'.
 * Used to pause the chat and force a 'Gap Analysis' check when emotional triggers are detected.
 */

import { Question } from './QuestionModule';

export class InterruptQuestionModule {

    // Keyword Map
    private static triggers: Record<string, Question[]> = {
        '불안': [
            {
                id: 'int_anxiety_1',
                text: '지금 느끼는 불안의 근원은 무엇인가요?',
                options: [
                    { label: '준비가 덜 되었다는 막연한 두려움', value: [2.0, 0, 0, 0, 0], gap: 20, type: 'gap' },
                    { label: '구체적인 문제 해결 방법의 부재', value: [0.5, 1.5, 0, 0, 0], gap: 5, type: 'active' }
                ]
            }
        ],
        '비교': [
            {
                id: 'int_comparison_1',
                text: '타인과 비교할 때 가장 위축되는 점은?',
                options: [
                    { label: '그들의 성과와 나의 현재 위치 차이', value: [2.0, 0, 0, 0, 0], gap: 20, type: 'gap' },
                    { label: '그들이 가진 환경적 지원과 운', value: [1.0, 0.5, 0, 0.5, 0], gap: 10, type: 'passive' }
                ]
            }
        ],
        '공부': [
            {
                id: 'int_study_1',
                text: '학습 과정에서 가장 힘든 순간은?',
                options: [
                    { label: '외워도 자꾸 까먹을 때의 자괴감', value: [2.0, 0, 0, 0, 0], gap: 20, type: 'gap' },
                    { label: '어디서부터 시작할지 모르는 막막함', value: [0.5, 1.5, 0, 0, 0], gap: 15, type: 'active' }
                ]
            }
        ],
        '완벽': [
            {
                id: 'int_perfection_1',
                text: '완벽함을 추구하다가 멈칫하는 이유는?',
                options: [
                    { label: '실패에 대한 두려움 때문에 시작조차 못함', value: [2.0, 0, 0, 0, 0], gap: 25, type: 'gap' },
                    { label: '디테일에 집착하느라 진도가 안 나감', value: [1.0, 1.0, 0, 0, 0], gap: 10, type: 'passive' }
                ]
            }
        ]
    };

    /**
     * Checks input text for triggers and returns a question if found.
     * @param inputText - User's chat message
     * @returns Question | null
     */
    public static checkInterrupt(inputText: string): Question | null {
        for (const keyword of Object.keys(this.triggers)) {
            if (inputText.includes(keyword)) {
                // Return random question from the trigger set
                const candidates = this.triggers[keyword];
                return candidates[Math.floor(Math.random() * candidates.length)];
            }
        }
        return null;
    }
}

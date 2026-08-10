/**
 * Consciousness OS Engine
 * 3D Coordinate System Protocol for Mind OS Upgrade
 * Based on "AI 주역" by 이경윤
 */

export interface Coordinates3D {
    x: 'Dark' | 'Neural' | 'Meta';  // 의식 레벨
    y: 'Low' | 'Mid' | 'High';      // 주파수/증상 강도
    z: 'In' | 'Out';                // 에너지 벡터
    xLevel: 1 | 2 | 3;              // X축 숫자 레벨
    ySymptom: string;               // Y축 증상 라벨
    zDirection: string;             // Z축 방향 설명
}

export interface Prescription3S {
    scan: {
        technique: string;          // MBCT, MBSR 등
        instruction: string;        // 구체적 실행 방법
        target: 'Y';               // Y축 제어
    };
    sync: {
        technique: string;          // ACT, DBT 등
        instruction: string;
        target: 'Z';               // Z축 수용
    };
    shift: {
        technique: string;          // CBT 등
        instruction: string;
        target: 'X';               // X축 상승
        evolution: string;          // X1→X2, X2→X3
    };
}

export class ConsciousnessOSEngine {
    /**
     * 사용자 메시지를 분석하여 3D 좌표 분석
     */
    diagnoseCoordinates(userMessage: string): Coordinates3D {
        const xAxis = this.analyzeXAxis(userMessage);
        const yAxis = this.analyzeYAxis(userMessage);
        const zAxis = this.analyzeZAxis(userMessage);

        return {
            x: xAxis.level,
            y: yAxis.frequency,
            z: zAxis.vector,
            xLevel: xAxis.numericLevel,
            ySymptom: yAxis.symptom,
            zDirection: zAxis.direction
        };
    }

    /**
     * X축 분석: 의식 레벨 (Dark/Neural/Meta)
     */
    private analyzeXAxis(message: string): { level: 'Dark' | 'Neural' | 'Meta', numericLevel: 1 | 2 | 3 } {
        const darkKeywords = ['왜 나한테만', '불공평', '피해자', '운이 없어', '포기', '무기력'];
        const neuralKeywords = ['바꿔보겠다', '노력', '해결', '개선', '도전', '시도'];
        const metaKeywords = ['관찰', '데이터', '패턴', '객관적', '흥미롭다', '배운다'];

        const darkScore = darkKeywords.filter(kw => message.includes(kw)).length;
        const neuralScore = neuralKeywords.filter(kw => message.includes(kw)).length;
        const metaScore = metaKeywords.filter(kw => message.includes(kw)).length;

        if (metaScore > darkScore && metaScore > neuralScore) {
            return { level: 'Meta', numericLevel: 3 };
        } else if (neuralScore > darkScore) {
            return { level: 'Neural', numericLevel: 2 };
        } else {
            return { level: 'Dark', numericLevel: 1 };
        }
    }

    /**
     * Y축 분석: 주파수/증상 강도 (Low/Mid/High)
     */
    private analyzeYAxis(message: string): { frequency: 'Low' | 'Mid' | 'High', symptom: string } {
        // Low: 생존/공포 (블랙홀/시한폭탄)
        const lowKeywords = ['죽고 싶다', '파괴', '무기력', '절망', '공포', '불안'];
        // Mid: 자아/욕망 (구두쇠/양아치)
        const midKeywords = ['돈', '경쟁', '질투', '인색', '소유', '욕심'];
        // High: 도피/산만 (몽상가/관종)
        const highKeywords = ['망상', '쾌락', '주의산만', '과시', '허영', '도피'];

        const lowScore = lowKeywords.filter(kw => message.includes(kw)).length;
        const midScore = midKeywords.filter(kw => message.includes(kw)).length;
        const highScore = highKeywords.filter(kw => message.includes(kw)).length;

        if (lowScore > 0) {
            return { frequency: 'Low', symptom: '블랙홀/시한폭탄' };
        } else if (midScore > highScore) {
            return { frequency: 'Mid', symptom: '구두쇠/양아치' };
        } else {
            return { frequency: 'High', symptom: '몽상가/관종' };
        }
    }

    /**
     * Z축 분석: 에너지 벡터 (In/Out)
     */
    private analyzeZAxis(message: string): { vector: 'In' | 'Out', direction: string } {
        // In: 수렴형 (고립, 우울, 생각)
        const inKeywords = ['혼자', '고립', '우울', '생각만', '움츠러들', '숨고 싶다'];
        // Out: 발산형 (분노, 과시, 충동)
        const outKeywords = ['화가 난다', '폭발', '과시', '충동', '표현', '드러내고'];

        const inScore = inKeywords.filter(kw => message.includes(kw)).length;
        const outScore = outKeywords.filter(kw => message.includes(kw)).length;

        if (outScore > inScore) {
            return { vector: 'Out', direction: '발산형 (분노/과시/충동)' };
        } else {
            return { vector: 'In', direction: '수렴형 (고립/우울/생각)' };
        }
    }

    /**
     * 3S 가이드 생성
     */
    generate3SPrescription(coords: Coordinates3D): Prescription3S {
        // Z축 기반 SCAN/SYNC 가이드
        const scanTechnique = coords.z === 'In' ? 'MBCT' : 'MBSR';
        const syncTechnique = coords.z === 'In' ? 'ACT' : 'DBT';

        // Y축 기반 SCAN 지시문
        let scanInstruction = '';
        if (coords.y === 'Low' && coords.z === 'In') {
            scanInstruction = '우울감을 "내 것"이 아니라 "지나가는 날씨"로 관찰하십시오.';
        } else if (coords.y === 'Low' && coords.z === 'Out') {
            scanInstruction = '3초간 멈춤(Stop). 화는 당신이 아닙니다.';
        } else {
            scanInstruction = '현재 감정을 판단 없이 관찰하십시오.';
        }

        // Z축 기반 SYNC 지시문
        let syncInstruction = '';
        if (coords.z === 'In') {
            syncInstruction = '고립된 동굴 속에 있는 자신을 비난하지 말고 접속하십시오.';
        } else {
            syncInstruction = '타인에 대한 분노는 내 열정의 왜곡된 표현임을 인정하십시오.';
        }

        // X축 기반 SHIFT 지시문
        let shiftInstruction = '';
        let evolution = '';
        if (coords.x === 'Dark') {
            if (coords.z === 'In') {
                shiftInstruction = '나는 "갇힌 자"가 아니라 "깊어지는 자"입니다.';
            } else {
                shiftInstruction = '이 에너지는 파괴가 아니라 창조의 연료입니다.';
            }
            evolution = 'X1(Dark) → X3(Meta)';
        } else if (coords.x === 'Neural') {
            shiftInstruction = '노력은 수단이지 목적이 아닙니다. 과정을 관찰하십시오.';
            evolution = 'X2(Neural) → X3(Meta)';
        } else {
            shiftInstruction = '당신은 이미 Meta 레벨입니다. 이 관찰을 유지하십시오.';
            evolution = 'X3(Meta) 유지';
        }

        return {
            scan: {
                technique: scanTechnique,
                instruction: scanInstruction,
                target: 'Y'
            },
            sync: {
                technique: syncTechnique,
                instruction: syncInstruction,
                target: 'Z'
            },
            shift: {
                technique: 'CBT',
                instruction: shiftInstruction,
                target: 'X',
                evolution
            }
        };
    }

    /**
     * 응답 포맷팅
     */
    formatResponse(coords: Coordinates3D, prescription: Prescription3S): string {
        return `
🧠 **[시스템 로그: 3D 좌표 분석 완료]**

**현재 좌표:**
- **X축 (의식 레벨):** ${coords.x} (Level ${coords.xLevel})
- **Y축 (주파수):** ${coords.y} - ${coords.ySymptom}
- **Z축 (에너지 벡터):** ${coords.z} - ${coords.zDirection}

---

⚠️ **[Identity Check]**
어드민님, 지금 당신은 **[${coords.ySymptom}]** 모드로 자동 주행 중입니다.

---

💉 **[Fate Hacking: 3S 가이드]**

**1️⃣ SCAN (Y축 제어)**
- **기법:** ${prescription.scan.technique}
- **가이드:** ${prescription.scan.instruction}

**2️⃣ SYNC (Z축 수용)**
- **기법:** ${prescription.sync.technique}
- **가이드:** ${prescription.sync.instruction}

**3️⃣ SHIFT (X축 상승)**
- **기법:** ${prescription.shift.technique}
- **가이드:** ${prescription.shift.instruction}
- **진화 경로:** ${prescription.shift.evolution}

---

🎯 **[Next Step]**
위 3S 가이드을 순차적으로 실행하여 의식 OS를 업그레이드하십시오.
        `.trim();
    }
}

// Export singleton instance
export const consciousnessOSEngine = new ConsciousnessOSEngine();

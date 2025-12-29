/**
 * @module MBTIMapper
 * @description
 * Converts 16 MBTI types into numerical 'Acquired' vectors for Gap Analysis.
 * Used to quantify the user's psychological 'software' running on their 'hardware' (Saju).
 * 
 * Vector Mapping Hypothesis (5 Dimensions):
 * [0]: Passive / Emotional / Shadow / Caution (Yin)
 * [1]: Active / Rational / Light / Execution (Yang)
 * [2]: Social / External / Harmony
 * [3]: Internal / Detail / Focus
 * [4]: Flexibility / Adaptability
 */

export class MBTIMapper {

    /**
     * Converts an MBTI string (e.g., "INTJ") into a 5-dimensional vector.
     * @param mbtiString - The 4-letter MBTI code (case insensitive)
     * @returns number[] - The acquired vector [v1, v2, v3, v4, v5]
     */
    public static getVector(mbtiString: string): number[] {
        const mbti = mbtiString.toUpperCase().trim();
        // Validation: Must be 4 chars
        if (mbti.length !== 4) {
            console.warn(`[MBTIMapper] Invalid MBTI input: ${mbti}. Returning neutral vector.`);
            return [0, 0, 0, 0, 0];
        }

        const vector = [0, 0, 0, 0, 0];
        const [ie, sn, tf, jp] = mbti.split('');

        // 1. E vs I (Energy Direction)
        if (ie === 'E') {
            vector[1] += 1.0; // Active/Execution
            vector[2] += 1.0; // Social
        } else { // I
            vector[0] += 1.0; // Passive/Caution
            vector[3] += 1.0; // Internal/Focus
        }

        // 2. S vs N (Perception)
        if (sn === 'S') {
            vector[1] += 0.5; // Realistic execution
            vector[3] += 0.5; // Detail
        } else { // N
            vector[0] += 0.5; // Intuition can be hesitant/abstract (Passive-leaning in this context?)
            vector[4] += 0.5; // Creative flexibility
        }

        // 3. T vs F (Judgment)
        if (tf === 'T') {
            vector[1] += 1.5; // Rational Action
        } else { // F
            vector[0] += 1.5; // Emotional Sensitivity (Passive/Reactive)
            vector[2] += 0.5; // Social Harmony
        }

        // 4. J vs P (Lifestyle)
        if (jp === 'J') {
            vector[1] += 0.5; // Plan/Execution
            vector[3] += 0.5; // Structure
        } else { // P
            vector[0] += 0.5; // Waiting/Observing
            vector[4] += 1.5; // Flexibility
        }

        // Special Tuning for specific types if needed (e.g. ISFP)
        // ISFP = I(Passive), S, F(Emotional), P(Flexible)
        // Result: High [0] (Passive), High [4] (Flexibility).
        // If Innate is "Opportunity" (High [1]), this creates a large Gap.

        return vector;
    }

    /**
     * Helper to get a simple description of the MBTI analysis
     */
    public static getAnalysis(mbtiString: string): string {
        const vec = this.getVector(mbtiString);
        // Find dominant index
        const maxVal = Math.max(...vec);
        const maxIdx = vec.indexOf(maxVal);

        const traits = [
            "신중/감성적 (Passive/Emotional)",
            "실행/이성적 (Active/Rational)",
            "관계지향적 (Social)",
            "내면탐구적 (Internal Focus)",
            "유연/자유분방 (Flexible)"
        ];

        return `MBTI(${mbtiString}) 분석: ${traits[maxIdx]} 성향이 강함.`;
    }
}

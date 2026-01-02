/**
 * @module TraitsMapper
 * @description
 * Converts 4-Dimension Personality Code into numerical 'Acquired' vectors for Gap Analysis.
 * Used to quantify the user's psychological 'software' running on their 'hardware' (Saju).
 * 
 * Vector Mapping Hypothesis (5 Dimensions):
 * [0]: Passive / Emotional / Shadow / Caution (Yin)
 * [1]: Active / Rational / Light / Execution (Yang)
 * [2]: Social / External / Harmony
 * [3]: Internal / Detail / Focus
 * [4]: Flexibility / Adaptability
 */

export class TraitsMapper {

    /**
     * Converts a Trait Code (e.g., "INTJ"-like format) into a 5-dimensional vector.
     * Uses the standard 4-axis psychological model (Energy, Perception, Judgment, Lifestyle).
     * @param traitCode - The 4-letter personality code (case insensitive)
     * @returns number[] - The acquired vector [v1, v2, v3, v4, v5]
     */
    public static getVector(traitCode: string): number[] {
        const code = traitCode.toUpperCase().trim();
        // Validation: Must be 4 chars
        if (code.length !== 4) {
            console.warn(`[TraitsMapper] Invalid Trait Code input: ${code}. Returning neutral vector.`);
            return [0, 0, 0, 0, 0];
        }

        const vector = [0, 0, 0, 0, 0];
        const [axis1, axis2, axis3, axis4] = code.split('');

        // 1. Energy Direction (Outward vs Inward)
        if (axis1 === 'E') {
            vector[1] += 1.0; // Active/Execution
            vector[2] += 1.0; // Social
        } else { // I
            vector[0] += 1.0; // Passive/Caution
            vector[3] += 1.0; // Internal/Focus
        }

        // 2. Perception (Sensing vs Intuition)
        if (axis2 === 'S') {
            vector[1] += 0.5; // Realistic execution
            vector[3] += 0.5; // Detail
        } else { // N
            vector[0] += 0.5; // Abstract/Passive-leaning
            vector[4] += 0.5; // Creative flexibility
        }

        // 3. Judgment (Thinking vs Feeling)
        if (axis3 === 'T') {
            vector[1] += 1.5; // Rational Action
        } else { // F
            vector[0] += 1.5; // Emotional Sensitivity
            vector[2] += 0.5; // Social Harmony
        }

        // 4. Lifestyle (Judging vs Perceiving)
        if (axis4 === 'J') {
            vector[1] += 0.5; // Plan/Execution
            vector[3] += 0.5; // Structure
        } else { // P
            vector[0] += 0.5; // Waiting/Observing
            vector[4] += 1.5; // Flexibility
        }

        return vector;
    }

    /**
     * Helper to get a simple description of the analysis
     */
    public static getAnalysis(traitCode: string): string {
        const vec = this.getVector(traitCode);
        // Find dominant index
        const maxVal = Math.max(...vec);
        const maxIdx = vec.indexOf(maxVal);

        const traits = [
            "신중/감성적 (Yin/Emotion)",
            "실행/이성적 (Yang/Reason)",
            "관계지향적 (Social)",
            "내면탐구적 (Internal Focus)",
            "유연/자유분방 (Flexible)"
        ];

        return `성향 코드(${traitCode}) 분석: ${traits[maxIdx]} 성향이 강함.`;
    }
}

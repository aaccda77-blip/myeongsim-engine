/**
 * @module GapAnalysisService
 * @description
 * Implements the 'Gap Analysis' logic defined in the patent.
 * Compares 'Innate Data' (Saju) and 'Acquired Data' (MBTI/Environment).
 * 
 * Logic:
 * - Matching Score: 0-100% (High means Innate ~= Acquired)
 * - Gap Level: 0-100% (High means significant disparity)
 * 
 * @notice
 * This module is independent and does not rely on existing core logic.
 * Inputs should be numerical vectors (arrays of numbers).
 */

export interface GapResult {
    matchingScore: number;
    gapLevel: number;
    details: {
        distance: number;
        dimensionCount: number;
    };
}

export class GapAnalysisService {
    /**
     * Calculates the Gap between Innate and Acquired traits.
     * Uses Euclidean distance to determine disparity.
     * 
     * @param innateVector - Numerical array representing original nature (Saju)
     * @param acquiredVector - Numerical array representing current state (MBTI/Test)
     * @returns GapResult object safely
     */
    public static calculateGap(innateVector: number[], acquiredVector: number[]): GapResult {
        try {
            // 1. Fallback Logic: If data is missing, return 0 gap (Perfect Match assumption to allow flow)
            if (!innateVector || !acquiredVector || innateVector.length === 0 || acquiredVector.length === 0) {
                console.warn("[GapAnalysis] Missing vector data. Defaulting to 100% Match.");
                return { matchingScore: 100, gapLevel: 0, details: { distance: 0, dimensionCount: 0 } };
            }

            // 2. Validate Dimensions
            const length = Math.min(innateVector.length, acquiredVector.length);
            if (length === 0) throw new Error("Vector length is zero.");

            // 3. Calculate Euclidean Distance
            let sumSqDiff = 0;
            for (let i = 0; i < length; i++) {
                const diff = innateVector[i] - acquiredVector[i];
                sumSqDiff += diff * diff;
            }
            const distance = Math.sqrt(sumSqDiff);

            // 4. Normalize Score (Experimental Normalization)
            // Assumption: Max possible distance depends on scale. 
            // If scale is 0-100 per dimension, max distance for N dimensions is sqrt(N * 100^2) = 100 * sqrt(N).
            // Let's assume input is normalized 0-10 or 0-100. Let's calculate purely based on relative distance.
            // For now, we use a decay function or simple inverse.
            // Heuristic: If distance is 0, match is 100. If distance is high, match drops.
            // Let's assume max reasonable distance is 50 (if scale is small) or 500 (if scale is big).
            // DYNAMIC NORMALIZATION: Use vector magnitude?
            // To be safe and consistent, we convert Distance to Similarity (0-100).
            // Formula: Similarity = 1 / (1 + distance) * 100 (scales well regardless of input magnitude)
            // Or linear mapping if we knew the max. Let's use the inverse formula for generic safety.

            // Actually, for "0-100%" strict output, let's try a standard bounded formula.
            // If inputs are 1-10 scale: max diff per item is 9. Max dist for 5 items = sqrt(5*81) = ~20.
            // Let's treat '20' as 0% match.
            // A safer approach without knowing scale: 
            // MatchingScore = 100 * e^(-distance / constant) -> Bell curve.

            // Sensitivity Adjustment:
            // Lower value means 'Gap' increases faster with distance.
            // With vectors of magnitude ~2-4, a sensitivity of 5 ensures that a distinct opposition triggers >30% gap.
            const sensitivity = 5;
            const matchingScore = Math.max(0, Math.min(100, Math.round(100 / (1 + (distance / sensitivity)))));
            const gapLevel = 100 - matchingScore;

            return {
                matchingScore,
                gapLevel,
                details: {
                    distance: parseFloat(distance.toFixed(2)),
                    dimensionCount: length
                }
            };

        } catch (error) {
            console.error("[GapAnalysis] Error calculating gap:", error);
            // Fail-safe Return
            return { matchingScore: 100, gapLevel: 0, details: { distance: 0, dimensionCount: 0 } };
        }
    }
}

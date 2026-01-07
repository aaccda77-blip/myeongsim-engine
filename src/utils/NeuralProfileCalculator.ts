import * as Astronomy from 'astronomy-engine';

// Human Design Mandala Gate Order (Counter-clockwise from Gate 41)
const MANDALA_ORDER = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

// [FIX] Gate 41 starts at ~223.25 degrees (approximately 13° Scorpio in tropical zodiac)
// This is the standard Human Design Mandala alignment
const GATE_41_START_LONGITUDE = 223.25;
const GATE_WIDTH_DEG = 5.625; // 360 / 64
const LINE_WIDTH_DEG = 0.9375; // 5.625 / 6

export interface NeuralProfile {
    lifeWork: number; // Personality Sun (with decimal for Line)
    evolution: number; // Personality Earth
    radiance: number; // Design Sun
    purpose: number; // Design Earth

    // 관계운 코드 (Relationship)
    attraction?: number; // Design Moon
    iq?: number;         // Design Venus
    eq?: number;         // Design Mars
    sq?: number;         // Design Venus

    // 재물운 코드 (Prosperity)
    vocation?: number;   // Design Mars
    culture?: number;    // Design Jupiter
    pearl?: number;      // Personality Jupiter
}

/**
 * Calculates the Gate.Line (e.g., 53.1) for a given Tropical Longitude (0-360).
 * Returns a decimal number where the integer part is the Gate (1-64)
 * and the decimal part represents the Line (0.1-0.6).
 */
export const getGateAndLineByLongitude = (longitude: number): number => {
    // Normalize the longitude relative to Gate 41's starting point
    const relativeLon = (longitude - GATE_41_START_LONGITUDE + 360) % 360;

    // Calculate Gate index (0-63)
    const gateIndex = Math.floor(relativeLon / GATE_WIDTH_DEG);
    const safeIndex = Math.max(0, Math.min(63, gateIndex));
    const gate = MANDALA_ORDER[safeIndex];

    // Calculate Line (1-6) based on position within the Gate
    const positionInGate = relativeLon % GATE_WIDTH_DEG;
    const lineIndex = Math.floor(positionInGate / LINE_WIDTH_DEG);
    const line = Math.min(6, Math.max(1, lineIndex + 1)); // Lines are 1-6

    // Return as Gate.Line (e.g., 53.1)
    return gate + (line / 10);
};

/**
 * Legacy function for backward compatibility - returns only Gate number
 */
export const getGateByLongitude = (longitude: number): number => {
    return Math.floor(getGateAndLineByLongitude(longitude));
};

/**
 * Calculates the Neural Keys Profile (Life's Work, Evolution, Radiance, Purpose)
 * based on the birth date.
 * 
 * [FIX] Correct Calculation:
 * - Personality Sun: Sun position at birth
 * - Personality Earth: Sun + 180° at birth
 * - Design Sun: Sun position 88 DAYS before birth (not 88 degrees!)
 * - Design Earth: Design Sun + 180°
 */
export const CalculateNeuralProfile = (birthDate: Date): NeuralProfile => {
    const birthTime = Astronomy.MakeTime(birthDate);

    // 1. LifeWork (Personality Sun) - Sun at birth
    const pSunPos = Astronomy.SunPosition(birthTime);
    const pSunLon = pSunPos.elon;

    // 2. Evolution (Personality Earth) - Opposite of Personality Sun
    const pEarthLon = (pSunLon + 180) % 360;

    // 3. [FIX] Design Date: 88 DAYS before birth (not 88 degrees!)
    // This is the standard Human Design calculation
    const designDate = new Date(birthDate);
    designDate.setDate(designDate.getDate() - 88);
    const designTime = Astronomy.MakeTime(designDate);

    // 4. Radiance (Design Sun) - Sun position at Design Date
    const dSunPos = Astronomy.SunPosition(designTime);
    const dSunLon = dSunPos.elon;

    // 5. Purpose (Design Earth) - Opposite of Design Sun
    const dEarthLon = (dSunLon + 180) % 360;

    // Helper function for planetary longitude
    const getGeoLon = (body: Astronomy.Body, time: Astronomy.AstroTime) => {
        const vec = Astronomy.GeoVector(body, time, true);
        const ecl = Astronomy.Ecliptic(vec);
        return ecl.elon;
    };

    // Venus Sequence (Relationships) - calculated at Design Time
    const dMoonLon = getGeoLon(Astronomy.Body.Moon, designTime);
    const dVenusLon = getGeoLon(Astronomy.Body.Venus, designTime);
    const dMarsLon = getGeoLon(Astronomy.Body.Mars, designTime);

    // Pearl Sequence (Prosperity)
    const dJupiterLon = getGeoLon(Astronomy.Body.Jupiter, designTime);
    const pJupiterLon = getGeoLon(Astronomy.Body.Jupiter, birthTime);

    return {
        // Activation Sequence (with Gate.Line format)
        lifeWork: getGateAndLineByLongitude(pSunLon),
        evolution: getGateAndLineByLongitude(pEarthLon),
        radiance: getGateAndLineByLongitude(dSunLon),
        purpose: getGateAndLineByLongitude(dEarthLon),

        // Venus Sequence (Relationships)
        attraction: getGateAndLineByLongitude(dMoonLon),
        iq: getGateAndLineByLongitude(dVenusLon),
        eq: getGateAndLineByLongitude(dMarsLon),
        sq: getGateAndLineByLongitude(dVenusLon),

        // Pearl Sequence (Prosperity)
        vocation: getGateAndLineByLongitude(dMarsLon),
        culture: getGateAndLineByLongitude(dJupiterLon),
        pearl: getGateAndLineByLongitude(pJupiterLon),
    };
};

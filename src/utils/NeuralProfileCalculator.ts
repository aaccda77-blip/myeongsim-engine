import * as Astronomy from 'astronomy-engine';

// Human Design Mandala Gate Order (Counter-clockwise from Gate 41)
const MANDALA_ORDER = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

const GATE_START_LONGITUDE = 302.0; // Start of Gate 41 in Tropical Zodiac
const GATE_WIDTH_DEG = 5.625; // 360 / 64

export interface NeuralProfile {
    lifeWork: number; // Personality Sun
    evolution: number; // Personality Earth
    radiance: number; // Design Sun
    purpose: number; // Design Earth
}

/**
 * Calculates the exact Gate number (1-64) for a given Tropical Longitude (0-360).
 */
export const getGateByLongitude = (longitude: number): number => {
    // Logic: 360 degrees divided by 64.
    // We use the MANDALA_ORDER to map the index to the Gate.
    // Alignment: Gate 41 starts at approx 302 degrees.
    // However, the Master Instruction says "0 deg = Gate 41 start point (roughly Aquarius)".
    // If we treat the input 'longitude' as the Tropical zodiac position (Aries 0),
    // then we must align the Mandala array (which starts with 41) to the actual sky.
    // Gate 41 is at ~302 deg.
    // So, (Tropical Lon - 302 + 360) % 360 gives the angle relative to Gate 41 start.

    const relativeLon = (longitude - GATE_START_LONGITUDE + 360) % 360;
    const index = Math.floor(relativeLon / GATE_WIDTH_DEG);

    const safeIndex = Math.max(0, Math.min(63, index));
    return MANDALA_ORDER[safeIndex];
};

/**
 * Calculates the Neural Keys Profile (Life's Work, Evolution, Radiance, Purpose)
 * based on the birth date.
 * 
 * Logic:
 * 1. lifeWork: Sun Position
 * 2. evolution: Sun + 180
 * 3. radiance: Sun - 88
 * 4. purpose: Sun + 92 (which is Evolution - 88)
 */
export const CalculateNeuralProfile = (birthDate: Date): NeuralProfile => {
    const birthTime = Astronomy.MakeTime(birthDate);

    // 1. LifeWork (Personality Sun)
    const pSunPos = Astronomy.SunPosition(birthTime);
    const pSunLon = pSunPos.elon;

    // 2. Evolution (Personality Earth)
    const pEarthLon = (pSunLon + 180) % 360;

    // 3. Radiance (Design Sun = Sun - 88)
    const dSunLon = (pSunLon - 88 + 360) % 360;

    // 4. Purpose (Design Earth = Design Sun + 180 = Sun - 88 + 180 = Sun + 92)
    const dEarthLon = (pSunLon + 92 + 360) % 360; // Equivalent to dSunLon + 180

    return {
        lifeWork: getGateByLongitude(pSunLon),
        evolution: getGateByLongitude(pEarthLon),
        radiance: getGateByLongitude(dSunLon),
        purpose: getGateByLongitude(dEarthLon)
    };
};

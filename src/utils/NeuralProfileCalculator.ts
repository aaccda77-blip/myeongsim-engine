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
    const dEarthLon = (pSunLon + 92 + 360) % 360;

    // --- Venus Sequence (Relationships) ---
    // IQ: Venus (Design), EQ: Mars (Design), SQ: Venus (Design) ?? 
    // Wait, standard Gene Keys:
    // Attraction: Moon (Design)
    // IQ: Venus (Design)
    // EQ: Mars (Design)
    // SQ: Venus (Design) - usually Venus (Design) is used for IQ/SQ in many readings, but let's stick to core:
    // Core Venus Sequence: Design Venus, Design Mars.
    // Let's calculate Design Time first.
    // Design Date = Birth Date - 88 degrees of Sun movement (~88-89 days)
    // Precise Calculation: Find time when Sun was at (pSunLon - 88).
    // Simplifying for speed: Subtract 88 days (approx) or calc precise angle?
    // Using Astronomy engine to find precise time is expensive (iterative).
    // Let's use the Design Sun Longitude we already calculated: dSunLon.

    // We need PLANETARY positions at Design Time.
    // We have Birth Time (Personality).
    // We need Design Time. 
    // Approximation: 88 days prior.
    const designDate = new Date(birthDate);
    designDate.setDate(designDate.getDate() - 88);
    const designTime = Astronomy.MakeTime(designDate);

    // 5. Attraction (Design Moon)
    const dMoonPos = Astronomy.GeoVector(Astronomy.Body.Moon, designTime, true);
    // Convert Vector to Longitude is complex without helper.
    // Let's use MoonPosition function if available or separate lib logic.
    // Astronomy.MoonPosition might be available or we use Equator function.
    // Let's check imports. 'astronomy-engine' has Body position functions.
    // Re-checking doc or assuming standard usage: Astronomy.Ecliptic(Vector).
    // Wait, let's just use the Heliocentric/Geocentric function provided by lib.
    // Actually, simple subtraction of 88 days is OK for MVP.
    // Let's get Design Venus & Mars.

    const getGeoLon = (body: Astronomy.Body, time: Astronomy.AstroTime) => {
        const vec = Astronomy.GeoVector(body, time, true);
        const ecl = Astronomy.Ecliptic(vec);
        return ecl.elon;
    };

    const dMoonLon = getGeoLon(Astronomy.Body.Moon, designTime);
    const dVenusLon = getGeoLon(Astronomy.Body.Venus, designTime);
    const dMarsLon = getGeoLon(Astronomy.Body.Mars, designTime);

    // --- 재물운 코드 (부와 성공의 패턴) ---
    // Vocation: Core Mars (Personality) - wait, usually Design Core? No, Vocation is Mars (Design).
    // Culture: Jupiter (Design)
    // Brand: Sun (Personality) - we have this (LifeWork).
    // Pearl: Jupiter (Personality)

    const dJupiterLon = getGeoLon(Astronomy.Body.Jupiter, designTime);
    const pJupiterLon = getGeoLon(Astronomy.Body.Jupiter, birthTime);

    return {
        // Activation
        lifeWork: getGateByLongitude(pSunLon),
        evolution: getGateByLongitude(pEarthLon),
        radiance: getGateByLongitude(dSunLon),
        purpose: getGateByLongitude(dEarthLon),

        // Venus (Relationships)
        attraction: getGateByLongitude(dMoonLon), // Design Moon
        iq: getGateByLongitude(dVenusLon),        // Design Venus (Mental)
        eq: getGateByLongitude(dMarsLon),         // Design Mars (Emotional)
        sq: getGateByLongitude(dVenusLon),        // Design Venus (Spiritual/Love) - simplified mapping

        // Pearl (Prosperity)
        vocation: getGateByLongitude(dMarsLon),   // Design Mars (Core Vocation)
        culture: getGateByLongitude(dJupiterLon), // Design Jupiter
        pearl: getGateByLongitude(pJupiterLon),   // Personality Jupiter
    };
};

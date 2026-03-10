import * as Astronomy from 'astronomy-engine';

// ============================================
// RAVE MANDALA GATE MAPPING (CORRECTED)
// Gate 41 starts at 302° (2° Aquarius)
// Counter-clockwise order through the 64 gates
// Each gate = 5.625°
// ============================================

// Human Design Mandala: Gate order starting from Gate 41
const HD_GATE_ORDER = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

// Gate 41 starts at 302° (2° Aquarius)
const GATE_41_START = 302.0;
const GATE_WIDTH = 5.625;
const LINE_WIDTH = 0.9375;

// Build gate lookup: for each degree, which gate?
function buildGateLookup(): Map<number, { gate: number; start: number }> {
    const lookup = new Map<number, { gate: number; start: number }>();

    for (let i = 0; i < 64; i++) {
        const gate = HD_GATE_ORDER[i];
        const startDeg = (GATE_41_START + i * GATE_WIDTH) % 360;

        // Store with gate index for easy lookup
        lookup.set(gate, { gate, start: startDeg });
    }

    return lookup;
}

const GATE_LOOKUP = buildGateLookup();

export interface NeuralProfile {
    lifeWork: number;
    evolution: number;
    radiance: number;
    purpose: number;
    attraction?: number;
    iq?: number;
    eq?: number;
    sq?: number;
    vocation?: number;
    culture?: number;
    pearl?: number;
}

/**
 * Convert longitude (0-360) to Gate.Line
 */
export const getGateAndLineByLongitude = (longitude: number): number => {
    // Normalize to 0-360
    const deg = ((longitude % 360) + 360) % 360;

    // Calculate offset from Gate 41's start (302°)
    let offset = deg - GATE_41_START;
    if (offset < 0) offset += 360;

    // Which gate index (0-63)?
    const gateIndex = Math.floor(offset / GATE_WIDTH) % 64;
    const gate = HD_GATE_ORDER[gateIndex];

    // Which line (1-6)?
    const posInGate = offset % GATE_WIDTH;
    const line = Math.min(6, Math.max(1, Math.floor(posInGate / LINE_WIDTH) + 1));

    return gate + (line / 10);
};

export const getGateByLongitude = (longitude: number): number => {
    return Math.floor(getGateAndLineByLongitude(longitude));
};

/**
 * Find Design Date: when Sun was 88° BEFORE birth Sun position
 */
const findDesignDate = (birthDate: Date, birthSunLon: number): Date => {
    const targetLon = ((birthSunLon - 88) % 360 + 360) % 360;

    let designDate = new Date(birthDate);
    designDate.setDate(designDate.getDate() - 88);

    for (let i = 0; i < 20; i++) {
        const designTime = Astronomy.MakeTime(designDate);
        const sunPos = Astronomy.SunPosition(designTime);
        const currentLon = sunPos.elon;

        let diff = targetLon - currentLon;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        if (Math.abs(diff) < 0.001) break;

        designDate = new Date(designDate.getTime() + diff * 24 * 60 * 60 * 1000);
    }

    return designDate;
};

/**
 * Calculate Neural Profile with correct HD Rave Mandala
 */
export const CalculateNeuralProfile = (birthDate: Date): NeuralProfile => {
    const birthTime = Astronomy.MakeTime(birthDate);

    // Personality Sun (Life's Work)
    const pSunPos = Astronomy.SunPosition(birthTime);
    const pSunLon = pSunPos.elon;

    // Personality Earth (Evolution) = Sun + 180°
    const pEarthLon = (pSunLon + 180) % 360;

    // Design Date = 88 DEGREES before birth Sun
    const designDate = findDesignDate(birthDate, pSunLon);
    const designTime = Astronomy.MakeTime(designDate);

    // Design Sun (Radiance)
    const dSunPos = Astronomy.SunPosition(designTime);
    const dSunLon = dSunPos.elon;

    // Design Earth (Purpose) = Design Sun + 180°
    const dEarthLon = (dSunLon + 180) % 360;

    // Helper for planet positions
    const getGeoLon = (body: Astronomy.Body, time: Astronomy.AstroTime) => {
        const vec = Astronomy.GeoVector(body, time, true);
        const ecl = Astronomy.Ecliptic(vec);
        return ecl.elon;
    };

    const dMoonLon = getGeoLon(Astronomy.Body.Moon, designTime);
    const dVenusLon = getGeoLon(Astronomy.Body.Venus, designTime);
    const dMarsLon = getGeoLon(Astronomy.Body.Mars, designTime);
    const dJupiterLon = getGeoLon(Astronomy.Body.Jupiter, designTime);
    const pJupiterLon = getGeoLon(Astronomy.Body.Jupiter, birthTime);

    console.log(`🔮 [NeuralCalc] Birth Sun: ${pSunLon.toFixed(2)}° → Gate ${getGateAndLineByLongitude(pSunLon)}`);
    console.log(`🔮 [NeuralCalc] Design Sun: ${dSunLon.toFixed(2)}° → Gate ${getGateAndLineByLongitude(dSunLon)}`);

    return {
        lifeWork: getGateAndLineByLongitude(pSunLon),
        evolution: getGateAndLineByLongitude(pEarthLon),
        radiance: getGateAndLineByLongitude(dSunLon),
        purpose: getGateAndLineByLongitude(dEarthLon),
        attraction: getGateAndLineByLongitude(dMoonLon),
        iq: getGateAndLineByLongitude(dVenusLon),
        eq: getGateAndLineByLongitude(dMarsLon),
        sq: getGateAndLineByLongitude(dVenusLon),
        vocation: getGateAndLineByLongitude(dMarsLon),
        culture: getGateAndLineByLongitude(dJupiterLon),
        pearl: getGateAndLineByLongitude(pJupiterLon),
    };
};

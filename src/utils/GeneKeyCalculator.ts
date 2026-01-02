/**
 * GeneKeyCalculator.ts - 천문 역법 엔진 (Gene Keys / Human Design Calculator)
 * 
 * 목적: 생년월일시를 바탕으로 행성 위치를 계산하고, 64 Gate + 6 Line으로 변환
 * 특징:
 *  - astronomy-engine 라이브러리 기반 정밀 천문 계산
 *  - 의식(Personality/Black) + 무의식(Design/Red) 모두 계산
 *  - 모듈식 설계 (기존 시스템에 영향 ZERO)
 *  - 저작권 안전: 숫자 계산만 수행, 해석은 별도
 */

import * as Astronomy from 'astronomy-engine';

// ============== 타입 정의 ==============
export interface GatePosition {
    gate: number;       // 1-64
    line: number;       // 1-6
    color: number;      // 1-6 (하위 구분)
    tone: number;       // 1-6 (더 하위)
    base: number;       // 1-5 (최하위)
    longitude: number;  // 원본 황경 (0-360)
}

export interface PlanetaryActivation {
    sun: GatePosition;
    earth: GatePosition;
    moon: GatePosition;
    mercury: GatePosition;
    venus: GatePosition;
    mars: GatePosition;
    jupiter: GatePosition;
    saturn: GatePosition;
    uranus: GatePosition;
    neptune: GatePosition;
    pluto: GatePosition;
    northNode: GatePosition;
    southNode: GatePosition;
}

export interface MyeongsimProfile {
    // 의식 (Personality / Black) - 출생 순간
    conscious: PlanetaryActivation;
    // 무의식 (Design / Red) - 약 88일 전
    unconscious: PlanetaryActivation;

    // 활성화 시퀀스 (Activation Sequence)
    activation: {
        lifeOS: GatePosition;           // Conscious Sun
        growthTrigger: GatePosition;    // Conscious Earth
        bioEngine: GatePosition;        // Unconscious Sun
        rootPurpose: GatePosition;      // Unconscious Earth
    };

    // 비너스 시퀀스 (Venus Sequence)
    venus: {
        attraction: GatePosition;       // Unconscious Moon
        iq: GatePosition;               // Conscious Venus
        eq: GatePosition;               // Conscious Mars
        sq: GatePosition;               // Conscious Jupiter
    };

    // 펄 시퀀스 (Pearl Sequence)
    pearl: {
        coreMission: GatePosition;      // Unconscious Mars
        ecoSystem: GatePosition;        // Unconscious Jupiter
        signatureSignal: GatePosition;  // Conscious Sun
        quantumReward: GatePosition;    // Conscious Jupiter
    };

    // 메타 정보
    meta: {
        birthDate: Date;
        designDate: Date;               // 88일 전
        timezone: string;
    };
}

// ============== I-Ching Wheel 매핑 (시작점 보정) ==============
// Gene Keys / Human Design의 I-Ching Wheel은 특정 순서로 64괘가 배열됨
// 표준 휠에서 Gate 41이 0도에서 시작함
const ICHING_WHEEL_ORDER: number[] = [
    41, 19, 13, 49, 30, 55, 37, 63,  // 0° - 45°
    22, 36, 25, 17, 21, 51, 42, 3,   // 45° - 90°
    27, 24, 2, 23, 8, 20, 16, 35,    // 90° - 135°
    45, 12, 15, 52, 39, 53, 62, 56,  // 135° - 180°
    31, 33, 7, 4, 29, 59, 40, 64,    // 180° - 225°
    47, 6, 46, 18, 48, 57, 32, 50,   // 225° - 270°
    28, 44, 1, 43, 14, 34, 9, 5,     // 270° - 315°
    26, 11, 10, 58, 38, 54, 61, 60   // 315° - 360°
];

// 역방향 매핑: Gate 번호 → Wheel 인덱스
const GATE_TO_WHEEL_INDEX: Map<number, number> = new Map();
ICHING_WHEEL_ORDER.forEach((gate, index) => {
    GATE_TO_WHEEL_INDEX.set(gate, index);
});

// ============== 핵심 계산 함수 ==============

/**
 * 황경(Longitude)을 Gate + Line으로 변환
 */
function longitudeToGate(longitude: number): GatePosition {
    // 0-360 범위로 정규화
    let normalizedLong = longitude % 360;
    if (normalizedLong < 0) normalizedLong += 360;

    // 각 Gate는 5.625도 (360 / 64 = 5.625)
    const gateIndex = Math.floor(normalizedLong / 5.625);
    const gate = ICHING_WHEEL_ORDER[gateIndex] || 1;

    // Gate 내 위치 계산 (0 ~ 5.625)
    const positionInGate = normalizedLong % 5.625;

    // Line 계산 (1-6): 각 Line은 0.9375도 (5.625 / 6)
    const line = Math.floor(positionInGate / 0.9375) + 1;

    // Color 계산 (1-6): 각 Color는 0.15625도
    const positionInLine = positionInGate % 0.9375;
    const color = Math.floor(positionInLine / 0.15625) + 1;

    // Tone 계산 (1-6)
    const positionInColor = positionInLine % 0.15625;
    const tone = Math.floor(positionInColor / 0.02604) + 1;

    // Base 계산 (1-5)
    const positionInTone = positionInColor % 0.02604;
    const base = Math.floor(positionInTone / 0.00521) + 1;

    return {
        gate: Math.min(64, Math.max(1, gate)),
        line: Math.min(6, Math.max(1, line)),
        color: Math.min(6, Math.max(1, color)),
        tone: Math.min(6, Math.max(1, tone)),
        base: Math.min(5, Math.max(1, base)),
        longitude: normalizedLong
    };
}

/**
 * 특정 시간에 행성의 황경 계산
 */
function getPlanetLongitude(date: Date, body: Astronomy.Body): number {
    const time = Astronomy.MakeTime(date);

    // 달의 경우 특별 처리
    if (body === Astronomy.Body.Moon) {
        const ecliptic = Astronomy.EclipticGeoMoon(time);
        return ecliptic.lon; // 'lon' is the correct property
    }

    // 태양 및 다른 행성들
    const equator = Astronomy.Equator(body, time, null as any, true, true);
    const eclipticCoord = Astronomy.Ecliptic(equator.vec);

    return eclipticCoord.elon; // ecliptic longitude
}

/**
 * 지구의 황경 계산 (태양 반대편)
 */
function getEarthLongitude(date: Date): number {
    const sunLong = getPlanetLongitude(date, Astronomy.Body.Sun);
    return (sunLong + 180) % 360;
}

/**
 * 노스 노드 (Rahu) 황경 계산
 */
function getNorthNodeLongitude(date: Date): number {
    const time = Astronomy.MakeTime(date);
    const moon = Astronomy.EclipticGeoMoon(time);

    // 달의 승교점 (간략화된 계산)
    // 실제로는 더 복잡한 계산이 필요하지만, 근사값 사용
    const T = (time.ut - 2451545.0) / 36525.0;
    let node = 125.0445 - 1934.136261 * T + 0.0020708 * T * T;
    node = node % 360;
    if (node < 0) node += 360;

    return node;
}

/**
 * 사우스 노드 (Ketu) 황경 계산
 */
function getSouthNodeLongitude(date: Date): number {
    return (getNorthNodeLongitude(date) + 180) % 360;
}

/**
 * 모든 행성의 Gate 위치 계산
 */
function calculateAllPlanets(date: Date): PlanetaryActivation {
    return {
        sun: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Sun)),
        earth: longitudeToGate(getEarthLongitude(date)),
        moon: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Moon)),
        mercury: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Mercury)),
        venus: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Venus)),
        mars: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Mars)),
        jupiter: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Jupiter)),
        saturn: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Saturn)),
        uranus: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Uranus)),
        neptune: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Neptune)),
        pluto: longitudeToGate(getPlanetLongitude(date, Astronomy.Body.Pluto)),
        northNode: longitudeToGate(getNorthNodeLongitude(date)),
        southNode: longitudeToGate(getSouthNodeLongitude(date)),
    };
}

/**
 * 무의식(Design) 날짜 계산 (태양이 88도 이전 위치)
 * 대략 88-89일 전
 */
function calculateDesignDate(birthDate: Date): Date {
    // 태양은 하루에 약 0.9856도 이동
    // 88도 / 0.9856 ≈ 89.3일
    const designDate = new Date(birthDate);
    designDate.setDate(designDate.getDate() - 88);

    // 더 정밀한 계산: 태양이 정확히 88도 이전일 때
    // (추후 정밀도 개선 가능)
    return designDate;
}

// ============== 메인 계산 함수 ==============

/**
 * 명심코칭 프로필 전체 계산
 */
export function calculateMyeongsimProfile(
    birthDate: Date,
    timezone: string = 'Asia/Seoul'
): MyeongsimProfile {
    // 1. 무의식 날짜 계산
    const designDate = calculateDesignDate(birthDate);

    // 2. 의식/무의식 행성 위치 계산
    const conscious = calculateAllPlanets(birthDate);
    const unconscious = calculateAllPlanets(designDate);

    // 3. 시퀀스 매핑
    return {
        conscious,
        unconscious,

        // 활성화 시퀀스
        activation: {
            lifeOS: conscious.sun,
            growthTrigger: conscious.earth,
            bioEngine: unconscious.sun,
            rootPurpose: unconscious.earth,
        },

        // 비너스 시퀀스
        venus: {
            attraction: unconscious.moon,
            iq: conscious.venus,
            eq: conscious.mars,
            sq: conscious.jupiter,
        },

        // 펄 시퀀스
        pearl: {
            coreMission: unconscious.mars,
            ecoSystem: unconscious.jupiter,
            signatureSignal: conscious.sun,
            quantumReward: conscious.jupiter,
        },

        meta: {
            birthDate,
            designDate,
            timezone,
        },
    };
}

// ============== 유틸리티 함수 ==============

/**
 * Gate.Line 형식 문자열 생성
 */
export function formatGatePosition(pos: GatePosition): string {
    return `${pos.gate}.${pos.line}`;
}

/**
 * 프로필 요약 문자열 생성 (디버깅/표시용)
 */
export function formatProfileSummary(profile: MyeongsimProfile): string {
    return `
[명심코칭 프로필]
======================
생년월일: ${profile.meta.birthDate.toISOString().split('T')[0]}
무의식 기준일: ${profile.meta.designDate.toISOString().split('T')[0]}

[활성화 시퀀스 (Core Architecture)]
- Life OS: Gate ${formatGatePosition(profile.activation.lifeOS)}
- Growth Trigger: Gate ${formatGatePosition(profile.activation.growthTrigger)}
- Bio Engine: Gate ${formatGatePosition(profile.activation.bioEngine)}
- Root Purpose: Gate ${formatGatePosition(profile.activation.rootPurpose)}

[비너스 시퀀스 (Love Protocol)]
- Attraction: Gate ${formatGatePosition(profile.venus.attraction)}
- IQ: Gate ${formatGatePosition(profile.venus.iq)}
- EQ: Gate ${formatGatePosition(profile.venus.eq)}
- SQ: Gate ${formatGatePosition(profile.venus.sq)}

[펄 시퀀스 (Wealth Protocol)]
- Core Mission: Gate ${formatGatePosition(profile.pearl.coreMission)}
- Eco-System: Gate ${formatGatePosition(profile.pearl.ecoSystem)}
- Signature Signal: Gate ${formatGatePosition(profile.pearl.signatureSignal)}
- Quantum Reward: Gate ${formatGatePosition(profile.pearl.quantumReward)}
`.trim();
}

/**
 * 생년월일 문자열을 Date로 파싱
 */
export function parseBirthDate(
    dateStr: string,
    timeStr: string = '12:00',
    timezoneOffset: number = 9 // KST = UTC+9
): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    // UTC 시간으로 변환
    const date = new Date(Date.UTC(year, month - 1, day, hour - timezoneOffset, minute, 0));
    return date;
}

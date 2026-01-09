"""
Gene Keys / Human Design Activation Sequence Calculator
=========================================================
Pure Python implementation using astronomical algorithms.
No external dependencies required (no pyswisseph needed).

Author: AI Backend Module
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, Tuple

# ============================================
# RAVE MANDALA GATE MAPPING
# 64 Gates mapped to 360 Zodiac Wheel
# Each gate = 5.625 degrees, Each line = 0.9375 degrees
# ============================================

RAVE_MANDALA_GATES = [
    # (start_degree, gate_number)
    # Aries (0-30)
    (0.000, 25), (5.625, 17), (11.250, 21), (16.875, 51), (22.500, 42),
    # Taurus (30-60)
    (28.125, 3), (33.750, 27), (39.375, 24), (45.000, 2), (50.625, 23),
    # Gemini (60-90)
    (56.250, 8), (61.875, 20), (67.500, 16), (73.125, 35), (78.750, 45),
    # Cancer (90-120)
    (84.375, 12), (90.000, 15), (95.625, 52), (101.250, 39), (106.875, 53),
    # Leo (120-150)
    (112.500, 62), (118.125, 56), (123.750, 31), (129.375, 33), (135.000, 7),
    # Virgo (150-180)
    (140.625, 4), (146.250, 29), (151.875, 59), (157.500, 40), (163.125, 64),
    # Libra (180-210)
    (168.750, 47), (174.375, 6), (180.000, 46), (185.625, 18), (191.250, 48),
    # Scorpio (210-240)
    (196.875, 57), (202.500, 32), (208.125, 50), (213.750, 28), (219.375, 44),
    # Sagittarius (240-270)
    (225.000, 1), (230.625, 43), (236.250, 14), (241.875, 34), (247.500, 9),
    # Capricorn (270-300)
    (253.125, 5), (258.750, 26), (264.375, 11), (270.000, 10), (275.625, 58),
    # Aquarius (300-330)
    (281.250, 38), (286.875, 54), (292.500, 61), (298.125, 60), (303.750, 41),
    # Pisces (330-360)
    (309.375, 19), (315.000, 13), (320.625, 49), (326.250, 30), (331.875, 55),
    (337.500, 37), (343.125, 63), (348.750, 22), (354.375, 36),
]


def _build_gate_lookup():
    gates = []
    sorted_mandala = sorted(RAVE_MANDALA_GATES, key=lambda x: x[0])
    for i, (start_deg, gate_num) in enumerate(sorted_mandala):
        end_deg = sorted_mandala[(i + 1) % len(sorted_mandala)][0]
        if end_deg <= start_deg:
            end_deg += 360
        gates.append((start_deg, end_deg, gate_num))
    return gates


GATE_LOOKUP = _build_gate_lookup()


# ============================================
# PURE PYTHON ASTRONOMICAL CALCULATIONS
# ============================================

def datetime_to_julian(dt: datetime) -> float:
    """Convert datetime to Julian Day number (pure Python)."""
    year = dt.year
    month = dt.month
    day = dt.day + dt.hour / 24.0 + dt.minute / 1440.0 + dt.second / 86400.0
    
    if month <= 2:
        year -= 1
        month += 12
    
    A = int(year / 100)
    B = 2 - A + int(A / 4)
    
    jd = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + B - 1524.5
    return jd


def julian_to_datetime(jd: float) -> Tuple[int, int, int, int, int]:
    """Convert Julian Day to (year, month, day, hour, minute)."""
    jd = jd + 0.5
    Z = int(jd)
    F = jd - Z
    
    if Z < 2299161:
        A = Z
    else:
        alpha = int((Z - 1867216.25) / 36524.25)
        A = Z + 1 + alpha - int(alpha / 4)
    
    B = A + 1524
    C = int((B - 122.1) / 365.25)
    D = int(365.25 * C)
    E = int((B - D) / 30.6001)
    
    day = B - D - int(30.6001 * E) + F
    
    if E < 14:
        month = E - 1
    else:
        month = E - 13
    
    if month > 2:
        year = C - 4716
    else:
        year = C - 4715
    
    day_int = int(day)
    frac = day - day_int
    hour = int(frac * 24)
    minute = int((frac * 24 - hour) * 60)
    
    return (year, month, day_int, hour, minute)


def calculate_sun_longitude(jd: float) -> float:
    """
    Calculate Sun's ecliptic longitude using simplified VSOP87.
    Accuracy: ~0.01 degrees (sufficient for Gene Keys).
    """
    # Days since J2000.0 (Jan 1, 2000, 12:00 TT)
    T = (jd - 2451545.0) / 36525.0
    
    # Mean longitude of Sun (degrees)
    L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
    L0 = L0 % 360
    
    # Mean anomaly of Sun (degrees)
    M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
    M_rad = math.radians(M)
    
    # Equation of center (degrees)
    C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * math.sin(M_rad)
    C += (0.019993 - 0.000101 * T) * math.sin(2 * M_rad)
    C += 0.000289 * math.sin(3 * M_rad)
    
    # Sun's true longitude (degrees)
    sun_longitude = (L0 + C) % 360
    
    return sun_longitude


def calculate_earth_position(jd: float) -> float:
    """Earth position = Sun + 180 degrees."""
    sun_longitude = calculate_sun_longitude(jd)
    return (sun_longitude + 180) % 360


def degree_to_gate_and_line(degree: float) -> Tuple[int, int]:
    """Convert zodiac degree (0-360) to Gene Gate and line."""
    degree = degree % 360
    gate_number = None
    gate_start = None
    
    for start_deg, end_deg, gate_num in GATE_LOOKUP:
        normalized_end = end_deg if end_deg > start_deg else end_deg + 360
        normalized_degree = degree if degree >= start_deg else degree + 360
        
        if start_deg <= normalized_degree < normalized_end:
            gate_number = gate_num
            gate_start = start_deg
            break
    
    if gate_number is None:
        gate_number = 1
        gate_start = 0
    
    degree_within_gate = (degree - gate_start) % 5.625
    line_number = int(degree_within_gate / 0.9375) + 1
    line_number = min(max(line_number, 1), 6)
    
    return gate_number, line_number


def find_design_date(birth_jd: float, birth_sun_longitude: float) -> float:
    """Find Julian Day when Sun was 88 degrees before birth Sun position."""
    target_longitude = (birth_sun_longitude - 88) % 360
    design_jd = birth_jd - 88  # Approx 88 days before
    
    for _ in range(20):
        current_sun = calculate_sun_longitude(design_jd)
        diff = target_longitude - current_sun
        if diff > 180:
            diff -= 360
        elif diff < -180:
            diff += 360
        
        if abs(diff) < 0.001:
            break
        design_jd += diff  # Sun moves ~1 deg/day
    
    return design_jd


# ============================================
# MAIN CALCULATION FUNCTION
# ============================================

def calculate_activation_sequence(
    birth_date: str,
    birth_time: str = "12:00",
    timezone_offset: int = 0
) -> Dict:
    """
    Calculate Activation Sequence (4 Prime Gifts).
    
    Args:
        birth_date: YYYY-MM-DD format
        birth_time: HH:MM format (24-hour)
        timezone_offset: Hours from UTC (e.g., +9 for KST)
    
    Returns:
        Dictionary with lifes_work, evolution, radiance, purpose
    """
    year, month, day = map(int, birth_date.split('-'))
    hour, minute = map(int, birth_time.split(':'))
    
    birth_dt = datetime(year, month, day, hour, minute)
    birth_dt_utc = birth_dt - timedelta(hours=timezone_offset)
    birth_jd = datetime_to_julian(birth_dt_utc)
    
    # PERSONALITY DATA (Birth Time)
    personality_sun_deg = calculate_sun_longitude(birth_jd)
    personality_earth_deg = calculate_earth_position(birth_jd)
    personality_sun_gate, personality_sun_line = degree_to_gate_and_line(personality_sun_deg)
    personality_earth_gate, personality_earth_line = degree_to_gate_and_line(personality_earth_deg)
    
    # DESIGN DATA (88 degrees prior)
    design_jd = find_design_date(birth_jd, personality_sun_deg)
    design_sun_deg = calculate_sun_longitude(design_jd)
    design_earth_deg = calculate_earth_position(design_jd)
    design_sun_gate, design_sun_line = degree_to_gate_and_line(design_sun_deg)
    design_earth_gate, design_earth_line = degree_to_gate_and_line(design_earth_deg)
    
    design_date_tuple = julian_to_datetime(design_jd)
    
    return {
        "lifes_work": {"gate": personality_sun_gate, "line": personality_sun_line, "degree": round(personality_sun_deg, 4)},
        "evolution": {"gate": personality_earth_gate, "line": personality_earth_line, "degree": round(personality_earth_deg, 4)},
        "radiance": {"gate": design_sun_gate, "line": design_sun_line, "degree": round(design_sun_deg, 4)},
        "purpose": {"gate": design_earth_gate, "line": design_earth_line, "degree": round(design_earth_deg, 4)},
        "metadata": {
            "birth_date": birth_date,
            "birth_time": birth_time,
            "timezone_offset": timezone_offset,
            "design_date": f"{design_date_tuple[0]}-{design_date_tuple[1]:02d}-{design_date_tuple[2]:02d}",
            "engine": "Pure Python (VSOP87 Simplified)"
        }
    }


# ============================================
# CLI & TESTING
# ============================================

if __name__ == "__main__":
    import sys
    
    print("=" * 50)
    print("Activation Sequence Calculator")
    print("Pure Python Implementation")
    print("=" * 50)
    
    birth_date = sys.argv[1] if len(sys.argv) >= 2 else "1990-05-15"
    birth_time = sys.argv[2] if len(sys.argv) >= 3 else "14:30"
    tz_offset = int(sys.argv[3]) if len(sys.argv) >= 4 else 9
    
    result = calculate_activation_sequence(birth_date, birth_time, tz_offset)
    
    print(f"\n🌟 Life's Work: Gate {result['lifes_work']['gate']}.{result['lifes_work']['line']} ({result['lifes_work']['degree']}°)")
    print(f"🔄 Evolution: Gate {result['evolution']['gate']}.{result['evolution']['line']} ({result['evolution']['degree']}°)")
    print(f"☀️ Radiance: Gate {result['radiance']['gate']}.{result['radiance']['line']} ({result['radiance']['degree']}°)")
    print(f"🎯 Purpose: Gate {result['purpose']['gate']}.{result['purpose']['line']} ({result['purpose']['degree']}°)")
    print(f"\n📅 Design Date: {result['metadata']['design_date']}")
    
    print("\n" + "-" * 50)
    print("JSON Output:")
    print(json.dumps(result, indent=2))

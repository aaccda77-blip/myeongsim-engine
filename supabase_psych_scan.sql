-- ============================================
-- 명심코칭 앱: psych_scan_profiles 테이블 생성
-- 심리 데이터 스캔 (선천적 기질 + 성격검사 + 생체 평형선) 캐싱 및 조회용
-- ============================================

CREATE TABLE IF NOT EXISTS psych_scan_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 주관적 기질 데이터
    mbti TEXT,
    big_five JSONB, -- {neuroticism: 0~100, extraversion: 0~100, openness: 0~100, agreeableness: 0~100, conscientiousness: 0~100}

    -- 선천적 운명 기질 데이터
    saju_profile JSONB, -- {day_master: '辛', elements: {metal: 40, ...}, ten_gods: {비겁: 30, ...}, gongmang: ['申', '酉']}

    -- 생체 데이터 베이스라인 (가상/실제 통합)
    biometric_baseline JSONB, -- {hrv: 45, bpm: 72, temp: 36.5, sleep: 7.2}

    -- 종합 취약성 지표 점수 (0 ~ 100)
    vulnerability_score INTEGER DEFAULT 0
);

-- 인덱스: 유저아이디 조회 최적화
CREATE UNIQUE INDEX IF NOT EXISTS idx_psych_scan_user ON psych_scan_profiles (user_id);

-- RLS (Row Level Security): 본인 데이터만 접근 가능
ALTER TABLE psych_scan_profiles ENABLE ROW LEVEL SECURITY;

-- 조회 정책
CREATE POLICY "Users can view own psych scan profiles"
ON psych_scan_profiles FOR SELECT
USING (auth.uid() = user_id);

-- 삽입 정책
CREATE POLICY "Users can insert own psych scan profiles"
ON psych_scan_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 수정 정책
CREATE POLICY "Users can update own psych scan profiles"
ON psych_scan_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 1. 온보딩 데이터 저장을 위한 테이블 생성
CREATE TABLE public.user_onboarding_data (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    birth_date DATE,
    birth_time TIME,
    gender TEXT CHECK (gender IN ('남성', '여성', '기타')),
    current_stressors TEXT[],
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
    energy_level INTEGER CHECK (energy_level >= 0 AND energy_level <= 100),
    personality_16 TEXT,
    enneagram TEXT,
    big_five TEXT,
    disc TEXT,
    terms_agreed BOOLEAN DEFAULT FALSE
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.user_onboarding_data ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 (Policy) 설정
-- 각 사용자는 자신의 데이터만 조회(Select), 삽입(Insert), 수정(Update)할 수 있습니다.

-- [조회 정책]
CREATE POLICY "Users can view their own onboarding data"
    ON public.user_onboarding_data
    FOR SELECT
    USING (auth.uid() = id);

-- [삽입 정책]
CREATE POLICY "Users can insert their own onboarding data"
    ON public.user_onboarding_data
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- [수정 정책]
CREATE POLICY "Users can update their own onboarding data"
    ON public.user_onboarding_data
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 명심코칭 앱: coaching_logs 테이블 생성
-- 셀프 코칭 기록 & 월간 리포트용 데이터
-- ============================================

CREATE TABLE IF NOT EXISTS coaching_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 코칭 세션 정보
    pillar_type TEXT NOT NULL,        -- '지향점' | '핵심 자아' | '사회적 환경' | '배경 에너지'
    pillar_id TEXT NOT NULL,          -- 'vision' | 'identity' | 'social' | 'base'
    base_code TEXT NOT NULL,          -- '을미' | '신사' | '계미' | '경신'

    -- 상태 전환 기록
    start_state TEXT NOT NULL,        -- 'dark' | 'neural' | 'meta'
    end_state TEXT NOT NULL,          -- 'dark' | 'neural' | 'meta'
    code_name TEXT NOT NULL,          -- '[초조한 수확자]', '[유연한 기획자]' 등

    -- 사용자 입력 텍스트 (핵심 아카이브 데이터)
    scan_input TEXT,                  -- Slide 1 (Scan) 입력
    sync_input TEXT,                  -- Slide 2 (Sync) 입력
    shift_input TEXT,                 -- Slide 3 (Shift) 입력 ← 월간 리포트의 "나에게 건넨 문장"

    -- 메타 정보
    completed BOOLEAN DEFAULT FALSE,  -- 3단계 완료 여부
    session_duration_ms INTEGER       -- 코칭 세션 소요 시간 (밀리초)
);

-- 인덱스: 사용자별 월간 조회용
CREATE INDEX IF NOT EXISTS idx_coaching_logs_user_month
ON coaching_logs (user_id, created_at DESC);

-- 인덱스: 기둥 타입별 조회
CREATE INDEX IF NOT EXISTS idx_coaching_logs_pillar
ON coaching_logs (user_id, pillar_id);

-- RLS (Row Level Security): 본인 데이터만 접근 가능
ALTER TABLE coaching_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coaching logs"
ON coaching_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching logs"
ON coaching_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 명심코칭 앱: user_daily_matrix 테이블 생성
-- 초개인화 오늘의 소스코드 및 투사된 현실 히스토리 평생 보존용
-- ============================================

CREATE TABLE IF NOT EXISTS user_daily_matrix (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,                  -- YYYY-MM-DD KST 형식
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 매트릭스 카드 정보
    code TEXT NOT NULL,                  -- 오늘의 소스코드
    reality TEXT NOT NULL,               -- 오늘의 투사된 현실
    theme JSONB NOT NULL,                -- 테마 색상 설정 객체
    coaching JSONB NOT NULL,             -- 명심 코칭 처방 6종 세트 (desc, socratic, recursive, meta, pureAwareness, awareness)

    -- 하루에 사용자 한 명당 오직 하나의 카드만 저장 가능하도록 유니크 제약
    CONSTRAINT unique_user_daily_matrix UNIQUE (user_id, date)
);

-- 인덱스: 사용자별 날짜 역순 조회용
CREATE INDEX IF NOT EXISTS idx_user_daily_matrix_user_date
ON user_daily_matrix (user_id, date DESC);

-- RLS (Row Level Security) 설정: 내 정보는 나만 읽고 쓰기 가능
ALTER TABLE user_daily_matrix ENABLE ROW LEVEL SECURITY;

-- 1. 본인 레코드 조회 정책
CREATE POLICY "Users can view own daily matrix"
ON user_daily_matrix FOR SELECT
USING (auth.uid() = user_id);

-- 2. 본인 레코드 삽입 정책
CREATE POLICY "Users can insert own daily matrix"
ON user_daily_matrix FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. 본인 레코드 업데이트 정책 (재생성 또는 수정 대비)
CREATE POLICY "Users can update own daily matrix"
ON user_daily_matrix FOR UPDATE
USING (auth.uid() = user_id);

-- 4. 본인 레코드 삭제 정책
CREATE POLICY "Users can delete own daily matrix"
ON user_daily_matrix FOR DELETE
USING (auth.uid() = user_id);

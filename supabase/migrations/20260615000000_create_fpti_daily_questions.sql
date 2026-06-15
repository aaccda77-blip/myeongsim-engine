-- fpti_daily_questions 테이블 생성 (일일 질문 캐싱)
CREATE TABLE IF NOT EXISTS public.fpti_daily_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,                  -- YYYY-MM-DD KST 형식
    questions JSONB NOT NULL,            -- 생성된 질문 객체 배열
    today_iljin JSONB NOT NULL,          -- 오늘의 일진 정보
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_fpti_date UNIQUE (user_id, date)
);

-- 인덱스 추가 (조회 속도 최적화)
CREATE INDEX IF NOT EXISTS idx_fpti_daily_questions_user_date
ON public.fpti_daily_questions (user_id, date DESC);

-- RLS 활성화
ALTER TABLE public.fpti_daily_questions ENABLE ROW LEVEL SECURITY;

-- 1. 본인 레코드 조회 정책
CREATE POLICY "Users can view own fpti questions"
ON public.fpti_daily_questions FOR SELECT
USING (auth.uid() = user_id);

-- 2. 본인 레코드 삽입 정책
CREATE POLICY "Users can insert own fpti questions"
ON public.fpti_daily_questions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. 본인 레코드 업데이트 정책 (만약을 대비한 수정 허용)
CREATE POLICY "Users can update own fpti questions"
ON public.fpti_daily_questions FOR UPDATE
USING (auth.uid() = user_id);

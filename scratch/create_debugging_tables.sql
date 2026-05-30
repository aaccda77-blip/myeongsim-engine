-- 매트릭스 디버깅 리포트 (CBT·DBT·ACT·MBCT 통합) 저장 테이블
CREATE TABLE IF NOT EXISTS public.user_debugging_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date_string)
);

-- RLS 보안 설정
ALTER TABLE public.user_debugging_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debugging reports"
ON public.user_debugging_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debugging reports"
ON public.user_debugging_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

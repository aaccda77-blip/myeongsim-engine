-- 매트릭스 리빌딩(Zero Point 디버깅 일지) 테이블
CREATE TABLE IF NOT EXISTS public.user_rebuilding_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    bug_report text NOT NULL, -- Step 1: 에고의 결핍 코드 (Mindfulness)
    self_praise text NOT NULL, -- Step 3: 자가 권한 부여 (Self-Kindness)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 설정
ALTER TABLE public.user_rebuilding_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rebuilding logs" 
ON public.user_rebuilding_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rebuilding logs" 
ON public.user_rebuilding_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 디버깅 워크시트 저장용 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_debugging_worksheets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    worksheet_text text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date_string)
);

-- RLS 보안 설정
ALTER TABLE public.user_debugging_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debugging worksheets"
ON public.user_debugging_worksheets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debugging worksheets"
ON public.user_debugging_worksheets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debugging worksheets"
ON public.user_debugging_worksheets FOR UPDATE
USING (auth.uid() = user_id);

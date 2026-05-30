-- 주파수 상승 시뮬레이션 결과 저장 테이블
CREATE TABLE IF NOT EXISTS public.user_frequency_shifts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date_string)
);

-- 주파수 상승 워크시트 저장 테이블
CREATE TABLE IF NOT EXISTS public.user_frequency_worksheets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    worksheet_text text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date_string)
);

-- RLS 보안 설정
ALTER TABLE public.user_frequency_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_frequency_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own frequency shifts"
ON public.user_frequency_shifts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own frequency shifts"
ON public.user_frequency_shifts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own frequency worksheets"
ON public.user_frequency_worksheets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own frequency worksheets"
ON public.user_frequency_worksheets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own frequency worksheets"
ON public.user_frequency_worksheets FOR UPDATE USING (auth.uid() = user_id);

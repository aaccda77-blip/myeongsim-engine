-- 오늘의 제로캡슐 알약 저장용 격리 테이블 생성
CREATE TABLE IF NOT EXISTS public.daily_capsules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_date DATE DEFAULT CURRENT_DATE,
    flavor VARCHAR(255),
    keyword VARCHAR(255),
    scan TEXT,
    sync TEXT,
    shift TEXT,
    log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT unique_user_date UNIQUE (user_id, target_date)
);

-- RLS(Row Level Security) 설정 활성화
ALTER TABLE public.daily_capsules ENABLE ROW LEVEL SECURITY;

-- 유저가 자신의 데이터만 조회(SELECT)할 수 있는 정책 설정
CREATE POLICY "Users can view their own daily capsules" ON public.daily_capsules
    FOR SELECT USING (auth.uid() = user_id);

-- 유저가 자신의 데이터만 삽입(INSERT)할 수 있는 정책 설정
CREATE POLICY "Users can insert their own daily capsules" ON public.daily_capsules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

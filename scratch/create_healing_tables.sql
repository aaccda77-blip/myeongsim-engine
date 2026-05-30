-- 사용자 맞춤형 딥 힐링 포스트 테이블
CREATE TABLE IF NOT EXISTS public.user_healing_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date_string text NOT NULL,
    theme text NOT NULL,
    content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date_string)
);

-- RLS 설정
ALTER TABLE public.user_healing_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own healing posts" 
ON public.user_healing_posts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own healing posts" 
ON public.user_healing_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- 사용자 맞춤형 프라이빗 치유 일기(댓글) 테이블
CREATE TABLE IF NOT EXISTS public.user_healing_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES public.user_healing_posts(id) ON DELETE CASCADE,
    guest_name text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 설정
ALTER TABLE public.user_healing_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own healing comments" 
ON public.user_healing_comments FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_healing_posts
        WHERE user_healing_posts.id = user_healing_comments.post_id
        AND user_healing_posts.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own healing comments" 
ON public.user_healing_comments FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_healing_posts
        WHERE user_healing_posts.id = post_id
        AND user_healing_posts.user_id = auth.uid()
    )
);

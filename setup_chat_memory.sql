-- 1. 채팅 로그 저장을 위한 테이블 생성
CREATE TABLE IF NOT EXISTS public.myeongsim_chat_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'model', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 타임스탬프와 사용자 ID 기반 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_myeongsim_chat_logs_user_id_created_at 
ON public.myeongsim_chat_logs (user_id, created_at ASC);

-- 3. Row Level Security (행 수준 보안) 활성화
ALTER TABLE public.myeongsim_chat_logs ENABLE ROW LEVEL SECURITY;

-- 4. 본인의 기록만 읽을 수 있도록 허용하는 정책 (SELECT)
CREATE POLICY "Users can view their own chat logs" 
ON public.myeongsim_chat_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- 5. 본인의 기록만 쓸 수 있도록 허용하는 정책 (INSERT)
CREATE POLICY "Users can insert their own chat logs" 
ON public.myeongsim_chat_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. 본인의 기록만 삭제할 수 있도록 허용하는 정책 (DELETE - 선택적)
CREATE POLICY "Users can delete their own chat logs" 
ON public.myeongsim_chat_logs 
FOR DELETE 
USING (auth.uid() = user_id);

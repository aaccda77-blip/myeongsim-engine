-- Add metadata column to chat_logs for storing rich content (images, options, etc.)
ALTER TABLE public.chat_logs 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Optional: Index for faster retrieval by user_id
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON public.chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at);

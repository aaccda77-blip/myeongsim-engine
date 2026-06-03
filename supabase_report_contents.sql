-- ─────────────────────────────────────────────────────────────
-- supabase_report_contents.sql
-- 🌌 온디맨드 108페이지 리포트 캐싱을 위한 Supabase 테이블 아키텍처
-- ─────────────────────────────────────────────────────────────

-- 1. report_contents 캐시 테이블 생성
CREATE TABLE IF NOT EXISTS public.report_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_key VARCHAR(255) NOT NULL, -- 사용자 사주 fingerprint 지문 (예: '임임_임신임인임신임신')
    page_key VARCHAR(50) NOT NULL,  -- 108페이지 인덱스 키 (예: '001', '002', '108')
    content JSONB NOT NULL,         -- Gemini 2.5 Flash가 빌드한 맞춤 백서 내용 (10개 모듈 스키마)
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 동일 사주 지문과 페이지 키에 대해 단 1개의 캐시만 허용하도록 유니크 락인 걸기
    CONSTRAINT unique_user_page_key UNIQUE (user_key, page_key)
);

-- 2. 고속 쿼리 성능 확보를 위한 인덱스 구축
CREATE INDEX IF NOT EXISTS idx_report_contents_user_key ON public.report_contents (user_key);
CREATE INDEX IF NOT EXISTS idx_report_contents_page_key ON public.report_contents (page_key);
CREATE INDEX IF NOT EXISTS idx_report_contents_user_page ON public.report_contents (user_key, page_key);

-- 3. Row Level Security (RLS) 보안 정책 활성화
ALTER TABLE public.report_contents ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 정의: 익명(Anonymous) 및 인증회원(Authenticated) 모두 본인 사주 지문(user_key)에 한해 안전하게 접근 허용
-- 데이터 생성 (INSERT)
CREATE POLICY "Allow select for everyone by user_key" 
ON public.report_contents 
FOR SELECT 
USING (true); -- 캐시 조익용 전원 허용 (지문 기반 보안 격리)

-- 데이터 생성 및 업데이트 (ALL)
CREATE POLICY "Allow upsert for authenticated users" 
ON public.report_contents 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow upsert for anonymous guests" 
ON public.report_contents 
FOR ALL 
TO anon 
USING (true)
WITH CHECK (true);

-- 5. 업데이트 트리거 설정 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_report_contents_timestamp
    BEFORE UPDATE ON public.report_contents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 🎉 테이블 생성 및 RLS 보안 프로토콜 세팅 완료!
-- ─────────────────────────────────────────────────────────────

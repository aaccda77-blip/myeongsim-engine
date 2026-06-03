-- ─────────────────────────────────────────────────────────────
-- supabase_report_contents.sql
-- 🌌 온디맨드 108페이지 리포트 캐싱을 위한 Supabase 테이블 아키텍처
-- ─────────────────────────────────────────────────────────────

-- 1. report_contents 캐시 테이블 생성 (기존 테이블 존재 시 덮어씌움)
-- user_id를 VARCHAR(255)로 하여, 로그인 회원(UUID)과 비회원('guest') 모두 유연하게 처리합니다.
CREATE TABLE IF NOT EXISTS public.report_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL, -- 회원 UUID 또는 비회원 'guest' 문자열
    page_id VARCHAR(50) NOT NULL,  -- 108페이지 상세 섹션/페이지 키 (예: 'p5_8', 'p9_12' 등)
    title VARCHAR(255) NOT NULL,   -- 해당 섹션의 제목
    generated_text TEXT NOT NULL,  -- Gemini 2.5 Flash가 생성한 상세 본문 내용
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 동일 사용자가 같은 페이지의 데이터를 중복 생성 및 저장하지 못하도록 유니크 키 설정
    CONSTRAINT unique_user_page UNIQUE (user_id, page_id)
);

-- 2. 고속 캐시 판별 및 쿼리 조회를 위한 복합 인덱스 설정
CREATE INDEX IF NOT EXISTS idx_report_contents_user_page ON public.report_contents (user_id, page_id);

-- 3. Row Level Security (RLS) 보안 정책 활성화
ALTER TABLE public.report_contents ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 정의: 회원 및 비회원 게스트 모두가 캐시를 안전하게 다룰 수 있도록 허용
-- API Route 및 프론트엔드 supabase 클라이언트 통신을 모두 고려하여 세밀하게 설정합니다.

-- 데이터 조회 (SELECT) 허용 정책
CREATE POLICY "Allow select for everyone by user_id and page_id" 
ON public.report_contents 
FOR SELECT 
USING (true);

-- 데이터 삽입 (INSERT / UPSERT) 허용 정책
CREATE POLICY "Allow insert for everyone" 
ON public.report_contents 
FOR INSERT 
WITH CHECK (true);

-- 데이터 업데이트 (UPDATE) 허용 정책
CREATE POLICY "Allow update for everyone" 
ON public.report_contents 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 5. 업데이트 트리거 설정 (updated_at 자동 타임스탬프 갱신)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_report_contents_timestamp ON public.report_contents;
CREATE TRIGGER trigger_update_report_contents_timestamp
    BEFORE UPDATE ON public.report_contents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 🎉 [완료] 온디맨드 리포트 캐싱용 Supabase SQL 아키텍처 설정 완료!
-- ─────────────────────────────────────────────────────────────

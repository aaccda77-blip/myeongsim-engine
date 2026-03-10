-- ============================================
-- 건강 Q&A 데이터베이스 스키마
-- ============================================

-- 1. 건강 Q&A 메인 테이블
CREATE TABLE IF NOT EXISTS public.health_qa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    advice_cards JSONB NOT NULL, -- 3가지 조언 카드 [{title, icon, content}]
    category VARCHAR(50) NOT NULL, -- 'hypertension', 'diabetes', 'disc', 'obesity' 등
    difficulty_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    tags TEXT[], -- ['근력운동', '혈압', '안전수칙']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_date DATE DEFAULT CURRENT_DATE,
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    bookmark_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE, -- 인기 Q&A
    metadata JSONB -- 추가 메타데이터
);

-- 2. 사용자 북마크 테이블
CREATE TABLE IF NOT EXISTS public.health_qa_bookmarks (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    qa_id UUID REFERENCES public.health_qa(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, qa_id)
);

-- 3. 사용자 읽기 기록 (분석용)
CREATE TABLE IF NOT EXISTS public.health_qa_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    qa_id UUID REFERENCES public.health_qa(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_duration_seconds INT, -- 읽은 시간 (초)
    completed BOOLEAN DEFAULT FALSE -- 끝까지 읽었는지
);

-- 4. 공유 기록 (바이럴 분석용)
CREATE TABLE IF NOT EXISTS public.health_qa_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    qa_id UUID REFERENCES public.health_qa(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'kakao', 'instagram', 'sms', 'link'
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 인덱스 (성능 최적화)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_health_qa_published_date ON public.health_qa(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_qa_category ON public.health_qa(category);
CREATE INDEX IF NOT EXISTS idx_health_qa_featured ON public.health_qa(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_health_qa_views_user ON public.health_qa_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_qa_bookmarks_user ON public.health_qa_bookmarks(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.health_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_qa_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_qa_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_qa_shares ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 Q&A 읽기 가능
CREATE POLICY "Anyone can read health QA" ON public.health_qa
    FOR SELECT USING (true);

-- 인증된 사용자만 북마크 가능
CREATE POLICY "Users can manage their bookmarks" ON public.health_qa_bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- 인증된 사용자만 자신의 읽기 기록 관리
CREATE POLICY "Users can manage their views" ON public.health_qa_views
    FOR ALL USING (auth.uid() = user_id);

-- 인증된 사용자만 공유 기록 생성
CREATE POLICY "Users can create share records" ON public.health_qa_shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 권한 부여
-- ============================================

GRANT SELECT ON public.health_qa TO anon;
GRANT SELECT ON public.health_qa TO authenticated;

GRANT ALL ON public.health_qa_bookmarks TO authenticated;
GRANT ALL ON public.health_qa_views TO authenticated;
GRANT ALL ON public.health_qa_shares TO authenticated;

-- ============================================
-- 유용한 함수들
-- ============================================

-- 오늘의 Q&A 가져오기
CREATE OR REPLACE FUNCTION get_daily_health_qa()
RETURNS SETOF public.health_qa AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.health_qa
    WHERE published_date = CURRENT_DATE
    ORDER BY created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 인기 Q&A 가져오기 (공유/북마크 많은 순)
CREATE OR REPLACE FUNCTION get_trending_health_qa(limit_count INT DEFAULT 10)
RETURNS SETOF public.health_qa AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.health_qa
    WHERE is_featured = TRUE
    ORDER BY (share_count + bookmark_count * 2) DESC, created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용자 맞춤 추천 (읽은 카테고리 기반)
CREATE OR REPLACE FUNCTION get_personalized_health_qa(p_user_id UUID, limit_count INT DEFAULT 5)
RETURNS SETOF public.health_qa AS $$
BEGIN
    RETURN QUERY
    WITH user_categories AS (
        SELECT DISTINCT hq.category
        FROM public.health_qa_views hqv
        JOIN public.health_qa hq ON hqv.qa_id = hq.id
        WHERE hqv.user_id = p_user_id
        ORDER BY hqv.viewed_at DESC
        LIMIT 3
    )
    SELECT hq.*
    FROM public.health_qa hq
    WHERE hq.category IN (SELECT category FROM user_categories)
    AND hq.id NOT IN (
        SELECT qa_id FROM public.health_qa_views WHERE user_id = p_user_id
    )
    ORDER BY hq.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

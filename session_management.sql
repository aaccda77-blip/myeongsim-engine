-- 돌려쓰기 방지를 위한 세션 관리 테이블
-- Supabase SQL Editor에서 실행하세요

-- 1. 활성 세션 테이블 생성
CREATE TABLE IF NOT EXISTS active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_fingerprint TEXT,
    device_info JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_active_sessions_active ON active_sessions(is_active) WHERE is_active = TRUE;

-- 3. RLS (Row Level Security) 정책
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- 서비스 역할용 정책 (모든 작업 허용)
CREATE POLICY "Service role full access" ON active_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- 4. 만료된 세션 자동 정리 함수
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM active_sessions
    WHERE expires_at < NOW() OR is_active = FALSE;
END;
$$ LANGUAGE plpgsql;

-- 5. 사용자당 활성 세션 수 확인 함수
CREATE OR REPLACE FUNCTION get_active_session_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO session_count
    FROM active_sessions
    WHERE user_id = p_user_id
      AND is_active = TRUE
      AND expires_at > NOW();
    RETURN session_count;
END;
$$ LANGUAGE plpgsql;

-- 6. 다른 세션 킥아웃 함수 (새 로그인 시 기존 세션 비활성화)
CREATE OR REPLACE FUNCTION kickout_other_sessions(p_user_id UUID, p_current_token TEXT)
RETURNS INTEGER AS $$
DECLARE
    kicked_count INTEGER;
BEGIN
    UPDATE active_sessions
    SET is_active = FALSE
    WHERE user_id = p_user_id
      AND session_token != p_current_token
      AND is_active = TRUE;
    
    GET DIAGNOSTICS kicked_count = ROW_COUNT;
    RETURN kicked_count;
END;
$$ LANGUAGE plpgsql;

-- 7. 세션 유효성 검증 함수
CREATE OR REPLACE FUNCTION validate_session(p_token TEXT)
RETURNS TABLE (
    user_id UUID,
    is_valid BOOLEAN,
    expires_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.user_id,
        (s.is_active AND s.expires_at > NOW()) AS is_valid,
        s.expires_at
    FROM active_sessions s
    WHERE s.session_token = p_token
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 8. 세션 활성 시간 업데이트 함수
CREATE OR REPLACE FUNCTION touch_session(p_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    updated BOOLEAN;
BEGIN
    UPDATE active_sessions
    SET last_active_at = NOW()
    WHERE session_token = p_token
      AND is_active = TRUE
      AND expires_at > NOW();
    
    GET DIAGNOSTICS updated = ROW_COUNT;
    RETURN updated > 0;
END;
$$ LANGUAGE plpgsql;

-- 9. users 테이블에 max_sessions 컬럼 추가 (티어별 제한)
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_sessions INTEGER DEFAULT 1;

-- VIP는 2개, 나머지는 1개
UPDATE users SET max_sessions = CASE 
    WHEN membership_tier = 'VIP' THEN 2 
    ELSE 1 
END;

-- 완료 메시지
SELECT 'Session management tables and functions created successfully!' AS result;

-- ======================================
-- RAG Knowledge Base 테이블 및 RPC 생성
-- Supabase SQL Editor에서 실행하세요
-- ======================================

-- 1. Knowledge Base 테이블 생성 (아직 없다면)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(768), -- Gemini text-embedding-004 차원
    metadata JSONB DEFAULT '{}',
    source VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 벡터 인덱스 생성 (검색 속도 향상)
CREATE INDEX IF NOT EXISTS knowledge_embedding_idx 
ON knowledge_base USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 3. match_knowledge RPC 함수 생성
CREATE OR REPLACE FUNCTION match_knowledge(
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 3,
    filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.content,
        kb.metadata,
        1 - (kb.embedding <=> query_embedding) AS similarity
    FROM knowledge_base kb
    WHERE 
        1 - (kb.embedding <=> query_embedding) > match_threshold
        AND (filter IS NULL OR filter = '{}' OR kb.metadata @> filter)
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ======================================
-- User Memories 테이블 및 RPC 생성
-- ======================================

-- 4. User Memories 테이블 생성 (Long-Term Memory)
CREATE TABLE IF NOT EXISTS user_memories (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    type VARCHAR(50) DEFAULT 'conversation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 벡터 인덱스 생성
CREATE INDEX IF NOT EXISTS memories_embedding_idx 
ON user_memories USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 6. 사용자별 인덱스
CREATE INDEX IF NOT EXISTS memories_user_idx ON user_memories(user_id);

-- 7. match_memories RPC 함수 생성
CREATE OR REPLACE FUNCTION match_memories(
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 3
)
RETURNS TABLE (
    id BIGINT,
    user_id UUID,
    content TEXT,
    created_at TIMESTAMPTZ,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        um.id,
        um.user_id,
        um.content,
        um.created_at,
        1 - (um.embedding <=> query_embedding) AS similarity
    FROM user_memories um
    WHERE 1 - (um.embedding <=> query_embedding) > match_threshold
    ORDER BY um.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 8. pgvector 확장 활성화 (이미 되어있을 수 있음)
CREATE EXTENSION IF NOT EXISTS vector;

-- ======================================
-- 샘플 데이터 삽입 (테스트용)
-- ======================================

-- 참고: 실제 데이터는 Python ingest.py로 삽입해야 합니다
-- 이건 테스트용 예시입니다

-- INSERT INTO knowledge_base (content, metadata, source)
-- VALUES 
--     ('식상생재(食傷生財)는 창의력으로 재물을 얻는 구조입니다...', 
--      '{"code_id": "NC-06", "title": "외교관", "keywords": "소통,창의력,재물"}',
--      'error_is_genre');

SELECT 'RAG 및 Memory 테이블/함수 생성 완료!' AS status;

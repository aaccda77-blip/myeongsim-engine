-- ==============================================================================
-- 네이버 스마트스토어(청류출판사) 주문 데이터 및 디지털 도서관 인증 테이블
-- ==============================================================================

CREATE TABLE IF NOT EXISTS smartstore_orders (
    order_id VARCHAR(64) PRIMARY KEY,              -- 네이버페이 주문번호 (예: 20260904-12345678)
    product_order_id VARCHAR(64),                  -- 네이버페이 상품주문번호
    orderer_name VARCHAR(100),                     -- 주문자명 (마스킹 또는 원본)
    orderer_id VARCHAR(100),                       -- 주문자 ID
    product_id VARCHAR(64),                        -- 스마트스토어 상품 ID
    product_name VARCHAR(255),                     -- 상품명 (예: ZERO POINT 제로 포인트)
    quantity INT DEFAULT 1,                        -- 수량
    total_payment_amount NUMERIC DEFAULT 0,        -- 결제 금액
    order_status VARCHAR(50),                      -- 주문 상태 (PAYED, DELIVERING, DELIVERED 등)
    payment_date TIMESTAMPTZ,                      -- 결제 일시
    is_claimed BOOLEAN DEFAULT FALSE,              -- 명심코칭 디지털도서관 인증 완료 여부
    claimed_at TIMESTAMPTZ,                        -- 인증 완료 일시
    claimed_by VARCHAR(100),                       -- 인증한 유저 ID / 회원명
    drm_serial_key VARCHAR(100),                   -- 발급된 DRM 포렌식 시리얼키
    raw_data JSONB,                                -- 네이버 API 수신 원본 JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 빠른 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_smartstore_orders_status ON smartstore_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_smartstore_orders_claimed ON smartstore_orders(is_claimed);
CREATE INDEX IF NOT EXISTS idx_smartstore_orders_payment_date ON smartstore_orders(payment_date DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE smartstore_orders ENABLE ROW LEVEL SECURITY;

-- 서비스 롤(백엔드 API) 및 관리자만 전체 읽기/쓰기 가능하도록 설정
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'smartstore_orders' AND policyname = 'Allow service role full access'
    ) THEN
        CREATE POLICY "Allow service role full access" 
        ON smartstore_orders 
        FOR ALL 
        TO service_role 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;

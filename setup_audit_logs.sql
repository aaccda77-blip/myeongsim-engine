-- [ENTERPRISE SECURITY] Audit Logging System (Digital Forensics)
-- Records every admin action for compliance and security tracing.

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(50) NOT NULL, -- 'APPROVE_USER', 'DELETE_USER', 'LOGIN_ATTEMPT'
    target_user_id UUID, -- affected user
    admin_id VARCHAR(50) DEFAULT 'admin_system', -- who did it
    ip_address VARCHAR(45), -- request IP
    details JSONB, -- extra data (e.g. tier changed to VIP)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [SECURITY] Immutable Logs
-- No one, not even admins, should be able to UPDATE or DELETE logs.
-- Only INSERT is allowed via Service Role.

ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Block ALL public access
CREATE POLICY "Public No Access" ON public.security_logs FOR ALL TO public USING (false);

-- Service Role (API) can INSERT only
CREATE POLICY "Service Role Log Insert" ON public.security_logs FOR INSERT TO service_role WITH CHECK (true);

-- Service Role (API) can SELECT (for audit dashboard if needed)
CREATE POLICY "Service Role Log Select" ON public.security_logs FOR SELECT TO service_role USING (true);

-- Explicitly DENY Update/Delete even for Service Role? 
-- Postgres policies are permissive, so we need a Trigger to block changes.

CREATE OR REPLACE FUNCTION public.prevent_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Security Logs are IMMUTABLE. Cannot Update or Delete.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_security_logs
BEFORE UPDATE OR DELETE ON public.security_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_log_tampering();

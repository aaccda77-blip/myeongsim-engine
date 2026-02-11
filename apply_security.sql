-- [SECURITY] Force-Restore Critical Fields Trigger
-- This ensures that even if a client sends "expires_at", it is ignored/reset unless done by Admin.

CREATE OR REPLACE FUNCTION public.restore_secure_state()
RETURNS TRIGGER AS $$
BEGIN
    -- [Check Role] If it's a Service Role (Admin/API), allow everything.
    -- Supabase service_role key uses 'service_role' as current_role usually.
    -- We can check: current_setting('request.jwt.claim.role', true) = 'service_role'
    
    IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- [Logic for Non-Admins (Anon/Authenticated)]
    IF (TG_OP = 'INSERT') THEN
        -- Force insecure fields to defaults on INSERT
        NEW.expires_at := NULL;
        NEW.is_active := FALSE;
        NEW.approved_at := NULL;
        NEW.approved_by := NULL;
        NEW.payment_amount := 0;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Prevent modification of secure fields on UPDATE
        NEW.expires_at := OLD.expires_at;
        NEW.is_active := OLD.is_active;
        NEW.approved_at := OLD.approved_at;
        NEW.approved_by := OLD.approved_by;
        NEW.payment_amount := OLD.payment_amount;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow updating logic
DROP TRIGGER IF EXISTS secure_users_trigger ON public.users;

-- Create Trigger
CREATE TRIGGER secure_users_trigger
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.restore_secure_state();

-- [OPTIONAL] Enable RLS but allow Public access matching current logic (but protected by trigger)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow everything for Service Role
CREATE POLICY "Service Role Full Access" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow Public (Anon/Auth) to Select/Insert/Update (But Trigger restricts the data)
-- Note: 'true' policies are open, but the Trigger above is the real guard.
CREATE POLICY "Public Read" ON public.users FOR SELECT TO public USING (true);
CREATE POLICY "Public Insert" ON public.users FOR INSERT TO public WITH CHECK (true);
-- Update: Users should only update their own row ideally, but for now we rely on Trigger for column security.
-- Ideally: auth.uid() = id for Google, but Phone Auth is anon. 
-- So we keep it open but sanitized.
CREATE POLICY "Public Update" ON public.users FOR UPDATE TO public USING (true);
CREATE POLICY "Public Delete" ON public.users FOR DELETE TO public USING (false); -- Block Delete

-- [Premium Membership] Database Schema Update

-- 1. Add membership tier column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'FREE';

-- 2. Add expiration timestamp
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 3. Add payment tracking
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT 0;

-- 4. Add approval metadata
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS approved_by TEXT;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 5. Create index for expiration queries
CREATE INDEX IF NOT EXISTS idx_users_expires_at ON public.users(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(membership_tier);

-- 6. Add comments for documentation
COMMENT ON COLUMN public.users.membership_tier IS 'User tier: FREE, TRIAL_30M, PASS_24H, VIP_7D';
COMMENT ON COLUMN public.users.expires_at IS 'When the current membership expires (NULL = no expiration)';
COMMENT ON COLUMN public.users.payment_amount IS 'Amount paid in KRW';
COMMENT ON COLUMN public.users.approved_by IS 'Admin who approved the payment';
COMMENT ON COLUMN public.users.approved_at IS 'When the payment was approved';

-- [Admin Dashboard] Add Membership Management Columns

-- 1. Add membership_tier column
alter table public.users 
add column if not exists membership_tier text default 'FREE';

-- 2. Add is_active column
alter table public.users 
add column if not exists is_active boolean default false;

-- 3. Update existing users to FREE tier if null
update public.users 
set membership_tier = 'FREE' 
where membership_tier is null;

-- 4. Create index for faster queries
create index if not exists idx_users_membership on public.users(membership_tier);
create index if not exists idx_users_active on public.users(is_active);

-- 5. Add comment for documentation
comment on column public.users.membership_tier is 'User subscription level: FREE, PREMIUM, VIP';
comment on column public.users.is_active is 'Whether user has been approved by admin';

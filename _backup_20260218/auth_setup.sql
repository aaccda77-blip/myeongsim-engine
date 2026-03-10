-- [Auth Setup] Custom Phone Authentication Schema

-- 1. Create Public Users Table (Stores Hashed Phone IDs)
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  phone_hash text unique not null,
  deep_scan_completed boolean default false,
  created_at timestamptz default now(),
  last_login_at timestamptz default now()
);

-- 2. Relax Foreign Key Constraint on Memory Table
-- The original setup linked user_memories to generic auth.users.
-- We need to support our custom public.users as well.

-- Try to drop the existing constraint if it exists (Safe operation)
do $$
begin
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'user_memories_user_id_fkey') then
    alter table user_memories drop constraint user_memories_user_id_fkey;
  end if;
end $$;

-- Optional: Add new constraint if you want strict integrity (Users must exist in public.users)
-- alter table user_memories add constraint fk_custom_user foreign key (user_id) references public.users(id);
-- But for maximum flexibility (supporting both Auth systems), we can leave it loose for now.

-- 3. RLS Policies for Public Users
alter table public.users enable row level security;

-- Allow anyone to select/insert during login (since they don't have an ID yet)
-- In a strict prod env, this should be via Function, but for MVP Direct Access:
create policy "Allow public access for login" on public.users
  for all
  using (true)
  with check (true);

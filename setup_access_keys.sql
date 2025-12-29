-- 1. Create/Modify Users Table for Access Keys
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text,
  access_key text unique not null,
  coins int default 0, 
  created_at timestamptz default now()
);

-- 2. Add Time Limit Columns
alter table users 
add column if not exists active_at timestamptz,       -- 최초 접속 시간
add column if not exists expires_at timestamptz,      -- 만료 시간
add column if not exists duration_minutes int default 30; -- 이용권 시간 (분)

-- 3. RLS (Allow Read for Verification)
alter table users enable row level security;
create policy "Allow public read for key check" 
on users for select 
using (true);

-- 4. [Insert Master Key] (Lifetime Access)
-- 만료 기간: 5256000분 (약 10년) -> 사실상 무제한
insert into users (access_key, duration_minutes) 
values ('master-key-2025', 5256000)
on conflict (access_key) do update 
set duration_minutes = 5256000;

-- 5. [Insert Test Keys]
-- 30분권 (맛보기)
insert into users (access_key, duration_minutes) 
values ('test-30min', 30)
on conflict (access_key) do nothing;

-- 24시간권 (자유이용권)
insert into users (access_key, duration_minutes) 
values ('test-24hour', 1440)
on conflict (access_key) do nothing;

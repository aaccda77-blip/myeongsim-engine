-- [1] Chat Logs Table
create table if not exists public.chat_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid, -- For Demo, this is nullable or specific UUID
  role text not null, -- 'user' or 'assistant'
  content text not null,
  stage_context int default 1
);

-- RLS Policies (Open for Demo / Anon)
alter table public.chat_logs enable row level security;

create policy "Enable insert for everyone (Demo)" 
  on public.chat_logs for insert 
  with check (true);

create policy "Enable select for everyone (Demo)" 
  on public.chat_logs for select 
  using (true);

-- [2] Coaching Sessions Table (Summaries)
create table if not exists public.coaching_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid,
  stage_level int not null,
  summary text,
  unique(user_id, stage_level)
);

-- RLS Policies
alter table public.coaching_sessions enable row level security;

create policy "Enable all access for everyone (Demo)" 
  on public.coaching_sessions for all 
  using (true) 
  with check (true);

-- Enable RLS
create table if not exists integral_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date default current_date not null,
  
  -- Quadrant Scores (1-10)
  ul_mind integer check (ul_mind >= 1 and ul_mind <= 10),
  ur_body integer check (ur_body >= 1 and ur_body <= 10),
  ll_relation integer check (ll_relation >= 1 and ll_relation <= 10),
  lr_system integer check (lr_system >= 1 and lr_system <= 10),
  
  -- Metadata
  symptoms text[], -- Array of strings
  calculated_context jsonb, -- Stores Saju/GeneKey analysis snapshot
  ai_coaching_message text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table integral_logs enable row level security;

create policy "Users can insert their own logs"
  on integral_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own logs"
  on integral_logs for select
  using (auth.uid() = user_id);

-- Create a table to store FCM Push Tokens
create table if not exists public.user_push_tokens (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    token text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure unique token per user
    unique(user_id, token)
);

-- RLS Policies
alter table public.user_push_tokens enable row level security;

-- Allow users to insert their own tokens
create policy "Users can insert their own tokens"
    on public.user_push_tokens
    for insert
    with check (auth.uid() = user_id);

-- Allow users to read their own tokens
create policy "Users can see their own tokens"
    on public.user_push_tokens
    for select
    using (auth.uid() = user_id);

-- Allow users to delete their own tokens
create policy "Users can delete their own tokens"
    on public.user_push_tokens
    for delete
    using (auth.uid() = user_id);

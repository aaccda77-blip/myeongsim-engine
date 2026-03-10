-- [Memory] Long-Term Memory Schema Setup
-- 1. Enable Vector Extension (Must be run by Superuser/Dashboard)
create extension if not exists vector;

-- 2. Create Memory Table
create table if not exists public.long_term_memory (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Link to User
    user_id uuid references auth.users(id) on delete cascade, 
    -- If using custom public.users, you might need to relax this FK or point to public.users(id)
    -- For now, we make it nullable or loose if strict FK fails.
    
    persona_id text not null, -- Unique Hash (User + Context)
    
    content text not null, -- The actual memory (e.g., "User is a monk.")
    
    -- Embedding Spec: Gemini text-embedding-004 uses 768 dimensions
    embedding vector(768), 
    
    metadata jsonb default '{}'::jsonb
);

-- 3. Enable RLS
alter table public.long_term_memory enable row level security;

create policy "Users can view own memories"
on public.long_term_memory for select
using (auth.uid() = user_id);

create policy "Users can insert own memories"
on public.long_term_memory for insert
with check (auth.uid() = user_id);

-- 4. Similarity Search Function
create or replace function match_memories (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_user_id uuid,
  p_persona_id text
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    long_term_memory.id,
    long_term_memory.content,
    1 - (long_term_memory.embedding <=> query_embedding) as similarity
  from long_term_memory
  where 1 - (long_term_memory.embedding <=> query_embedding) > match_threshold
  and long_term_memory.user_id = p_user_id
  and long_term_memory.persona_id = p_persona_id
  order by long_term_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;

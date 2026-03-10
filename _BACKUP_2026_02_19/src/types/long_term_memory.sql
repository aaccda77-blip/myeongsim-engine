-- Enable pgvector extension
create extension if not exists vector;

-- Table: long_term_memory
-- Stores conversational context and insights
create table if not exists public.long_term_memory (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- User & Persona Link
    user_id uuid references auth.users(id) on delete cascade not null, -- Google Account Holder
    persona_id text not null, -- Hash(User + Target Bio Data)
    
    -- Content
    content text not null, -- The actual memory text
    tags text[], -- ['self', 'diagnosis', 'partner_conflict']
    
    -- Vector Embedding (OpenAI text-embedding-ada-002 dimension: 1536)
    embedding vector(1536),
    
    -- Emotional Context (Optional)
    emotion text, -- 'anxiety', 'joy', 'neutral'
    
    -- Metadata
    metadata jsonb default '{}'::jsonb
);

-- Index for Vector Similarity Search
create index on public.long_term_memory using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

-- Enable RLS
alter table public.long_term_memory enable row level security;

-- Policy: Users can only see their own memories (linked by user_id)
create policy "Users can view own memories"
on public.long_term_memory for select
using (auth.uid() = user_id);

create policy "Users can insert own memories"
on public.long_term_memory for insert
with check (auth.uid() = user_id);

-- Check function for similarity search
create or replace function match_memories (
  query_embedding vector(1536),
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

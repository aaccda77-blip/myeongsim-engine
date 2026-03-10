-- Enable Vector Extension (Already enabled, but good practice)
-- create extension if not exists vector;

-- 1. Create User Memories Table (Long-Term Episodic Memory)
create table if not exists user_memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null, -- Links to auth user
  content text not null, -- The chat summary or key insight
  embedding vector(768), -- Gemini Text Embedding Dimensions
  metadata jsonb default '{}'::jsonb, -- e.g., { "emotion": "sadness", "topic": "career" }
  created_at timestamptz default now()
);

-- 2. Index for Faster Search
create index if not exists user_memories_embedding_idx on user_memories using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 3. RLS Policies (Privacy First)
alter table user_memories enable row level security;

create policy "Users can only see their own memories"
on user_memories for select
using (auth.uid() = user_id);

create policy "Users can insert their own memories"
on user_memories for insert
with check (auth.uid() = user_id);

-- 4. Vector Search Function (RPC)
-- Matches memories similar to query_embedding, filtered by user_id
create or replace function match_memories (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_user_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float,
  metadata jsonb,
  created_at timestamptz
)
language plpgsql
as $$
begin
  return query
  select
    user_memories.id,
    user_memories.content,
    1 - (user_memories.embedding <=> query_embedding) as similarity,
    user_memories.metadata,
    user_memories.created_at
  from user_memories
  where user_memories.user_id = filter_user_id
  and 1 - (user_memories.embedding <=> query_embedding) > match_threshold
  order by user_memories.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- [DEV MODE] Relax Security & Fix Vector Dimension
-- CAUTION: Use this only for Development/Testing!

-- 1. [CRITICAL FIX] Correct Vector Dimension (1536 -> 768)
-- Gemini Text Embedding 004 uses 768 dimensions.
-- OpenAI uses 1536. We need to switch to 768.
-- Note: This will wipe existing embeddings if they are incompatible.
alter table public.long_term_memory 
alter column embedding type vector(768);

-- 2. Disable Row Level Security (RLS) - Allow ALL operations
alter table public.long_term_memory disable row level security;

-- 3. Drop strict link between App Users and Auth Users (for Phone Auth support)
alter table public.long_term_memory 
drop constraint if exists long_term_memory_user_id_fkey;

-- 4. Update Function to use 768 Dimensions & Security Definer
drop function if exists match_memories(vector(1536), float, int, uuid, text);

create or replace function match_memories (
  query_embedding vector(768), -- [FIX] Changed to 768
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
security definer -- [CRITICAL] Run as Owner (Bypass RLS)
as $$
begin
  return query
  select
    long_term_memory.id,
    long_term_memory.content,
    1 - (long_term_memory.embedding <=> query_embedding) as similarity
  from long_term_memory
  where 1 - (long_term_memory.embedding <=> query_embedding) > match_threshold
  -- Relaxed User ID check (Allow null p_user_id to search everything if needed, but keeping scoped for now)
  and long_term_memory.user_id = p_user_id
  and long_term_memory.persona_id = p_persona_id
  order by long_term_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. Grant full access to everyone (Anon + Authenticated + Service)
grant all on public.long_term_memory to anon, authenticated, service_role;

-- 6. (Optional) Ensure Users table is accessible
-- grant all on public.users to anon, authenticated, service_role;

-- [Fix] Memory System Security & Constraints
-- 1. Relax Foreign Key Constraint (Allow custom IDs from public.users)
alter table public.long_term_memory 
drop constraint if exists long_term_memory_user_id_fkey;

-- 2. Update Function to Bypass RLS (Security Definer)
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
security definer -- [CRITICAL] Run as Owner (Bypass RLS for Read)
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

-- 3. Explicitly Allow Service Role (Admin API) to Bypass RLS
drop policy if exists "Service Role Full Access" on public.long_term_memory;
create policy "Service Role Full Access" 
on public.long_term_memory 
for all 
to service_role 
using (true) 
with check (true);

-- 4. Grant Permissions (Just in case)
grant all on public.long_term_memory to service_role;
grant all on public.long_term_memory to postgres;

-- Create a function for similarity search
create or replace function match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter jsonb default '{}'
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query(
    select
      knowledge_store.id,
      knowledge_store.content,
      knowledge_store.metadata,
      1 - (knowledge_store.embedding <=> query_embedding) as similarity
    from knowledge_store
    where 1 - (knowledge_store.embedding <=> query_embedding) > match_threshold
    and knowledge_store.metadata @> filter
    order by knowledge_store.embedding <=> query_embedding
    limit match_count
  );
end;
$$;

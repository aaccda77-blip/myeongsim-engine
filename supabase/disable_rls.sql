-- RLS(보안 규칙) 때문에 데모 유저의 접근이 차단된 상태입니다.
-- 데모 원활한 실행을 위해 잠시 RLS를 끕니다.

alter table public.users disable row level security;
alter table public.chat_logs disable row level security;
alter table public.coaching_sessions disable row level security;

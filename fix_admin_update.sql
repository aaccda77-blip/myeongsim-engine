-- [Fix] Drop the trigger that blocks Admin updates
DROP TRIGGER IF EXISTS secure_users_trigger ON public.users;
DROP FUNCTION IF EXISTS public.restore_secure_state();

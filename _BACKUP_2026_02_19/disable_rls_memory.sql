-- Disable Row Level Security on the memory table to allow unrestricted access for debugging
-- Run this in the Supabase SQL Editor

ALTER TABLE long_term_memory DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'long_term_memory';

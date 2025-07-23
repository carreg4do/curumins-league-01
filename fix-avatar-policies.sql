-- Script para verificar e corrigir políticas RLS para upload de avatar

-- Primeiro, vamos verificar as políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Verificar se a coluna avatar existe e seu tipo
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'avatar';

-- Remover políticas existentes para usuários (se necessário)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Recriar políticas mais permissivas para debug
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Verificar se há triggers que podem estar interferindo
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- Testar uma atualização simples (substitua USER_ID pelo ID real)
-- UPDATE public.users SET avatar = 'test-avatar-url' WHERE id = 'USER_ID';

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Instruções:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique os resultados de cada query
-- 3. Se necessário, substitua USER_ID por um ID real para testar
-- 4. Observe se há algum erro ou restrição específica
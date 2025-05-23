/*
  # Remover segurança do banco de dados

  1. Alterações
    - Remove políticas RLS da tabela transactions
    - Desabilita RLS na tabela transactions
    - Remove coluna user_id da tabela transactions
*/

-- Remover políticas RLS
DROP POLICY IF EXISTS "Usuários podem ver suas próprias transações" ON transactions;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias transações" ON transactions;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias transações" ON transactions;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias transações" ON transactions;

-- Desabilitar RLS
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Remover coluna user_id
ALTER TABLE transactions DROP COLUMN IF EXISTS user_id;
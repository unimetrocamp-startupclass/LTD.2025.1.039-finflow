/*
  # Criação da tabela de transações

  1. Nova Tabela
    - `transactions`
      - `id` (uuid, chave primária)
      - `description` (texto)
      - `amount` (decimal)
      - `type` (enum: income/expense)
      - `category` (texto)
      - `date` (timestamp)
      - `user_id` (uuid, referência ao usuário)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela
    - Adicionar políticas para usuários autenticados
*/

-- Criar enum para tipo de transação
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  type transaction_type NOT NULL,
  category text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver suas próprias transações"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias transações"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
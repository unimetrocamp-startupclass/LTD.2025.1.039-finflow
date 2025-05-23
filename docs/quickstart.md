# Guia de Início Rápido

## Introdução

Este guia fornecerá todas as informações necessárias para começar a usar o FinFlow rapidamente em sua organização.

## Pré-requisitos

- Node.js 18 ou superior
- NPM 8 ou superior
- Mínimo de 2GB de RAM
- Conexão estável com a internet
- Conta FinFlow Enterprise (para recursos avançados)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/finflow/enterprise.git
cd enterprise
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure seu arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Primeiros Passos

### 1. Configuração Inicial

1. Acesse o painel administrativo
2. Configure suas credenciais
3. Defina as permissões de usuário
4. Personalize as categorias financeiras

### 2. Importação de Dados

- Suporte para importação CSV
- Integração com sistemas legados
- Migração de dados existentes
- Validação automática

### 3. Configuração de Usuários

- Criação de contas
- Definição de papéis
- Permissões granulares
- Políticas de segurança

## Próximos Passos

- [Explore a documentação completa](./architecture.md)
- [Configure integrações](./erp.md)
- [Personalize seu ambiente](./customization.md)
- [Implemente políticas de backup](./backup.md)

## Suporte

Para suporte durante a instalação:
- Email: suporte@finflow.com.br
- Chat: suporte.finflow.com.br
- Tel: +55 11 4002-8922
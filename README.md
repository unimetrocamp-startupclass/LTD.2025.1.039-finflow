# Gerenciador Financeiro

## Descrição
Sistema web para gerenciamento de finanças pessoais, desenvolvido com React, TypeScript e Tailwind CSS. Permite o controle de receitas e despesas, visualização de relatórios e análise de gastos por categoria.

## Índice
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura de Dados](#estrutura-de-dados)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Funcionalidades
- ✅ Registro de receitas e despesas
- 📊 Gráfico de distribuição de gastos
- 🔍 Pesquisa e filtragem de transações
- 📅 Análise mensal de gastos
- 🌓 Tema claro/escuro
- 📱 Interface responsiva
- 💾 Persistência local de dados
- 🔔 Notificações de ações

## Tecnologias
- React 18.3.1
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)
- React Hot Toast (notificações)
- Recharts (gráficos)

## Arquitetura

### Estrutura de Diretórios
```
src/
├── models/          # Classes e interfaces
├── docs/           # Documentação
├── components/     # Componentes React
└── styles/        # Estilos CSS
```

### Modelagem de Dados
O sistema utiliza três entidades principais:
- **Transaction**: Registros de receitas e despesas
- **User**: Informações do usuário
- **Category**: Categorias de transações

Para mais detalhes, consulte o [Diagrama ER](docs/DER.md).

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gerenciador-financeiro.git

# Acesse o diretório
cd gerenciador-financeiro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Uso

### Adicionar Transação
1. Preencha a descrição
2. Informe o valor
3. Selecione o tipo (receita/despesa)
4. Escolha a categoria
5. Clique em "Adicionar"

### Visualizar Relatórios
- Use o gráfico de pizza para análise de gastos
- Selecione mês/ano para análise temporal
- Utilize a barra de pesquisa para filtrar transações

### Temas
- Alterne entre tema claro/escuro no botão superior direito

## Estrutura de Dados

### Transaction
```typescript
{
  id: UUID
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: Date
  user_id: UUID
}
```

### User
```typescript
{
  id: UUID
  email: string
  name: string
  created_at: Date
}
```

### Category
```typescript
{
  id: UUID
  name: string
  type: 'income' | 'expense'
  user_id: UUID
}
```

## Contribuição

### Processo
1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões
- Use TypeScript
- Siga as regras do ESLint
- Mantenha a formatação do Prettier
- Escreva testes para novas funcionalidades
- Mantenha os componentes React pequenos e focados
- Use Tailwind CSS para estilização

## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
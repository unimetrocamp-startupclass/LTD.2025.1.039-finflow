# Gerenciador Financeiro

Um sistema web moderno e intuitivo para gerenciamento de finanças pessoais, desenvolvido com React, TypeScript e Tailwind CSS. Oferece uma interface elegante e responsiva para controle de receitas, despesas e análise financeira.

## 🌟 Funcionalidades

### Gestão Financeira
- ✅ Registro de receitas e despesas
- 📊 Gráficos interativos de distribuição de gastos
- 🏷️ Sistema de categorias personalizáveis
- 💰 Cálculo automático de saldo total e mensal
- 🔍 Busca avançada com múltiplos filtros

### Categorização
- 🎨 Cores personalizáveis para categorias
- 📋 Categorias padrão pré-configuradas
- 🔄 Gestão flexível de categorias

### Relatórios e Exportação
- 📑 Exportação para PDF
- 📊 Exportação para Excel
- 📈 Análise mensal detalhada
- 📉 Visualização de tendências

### Interface
- 🌓 Tema claro/escuro
- 📱 Design totalmente responsivo
- 🔔 Sistema de notificações
- 🎯 Interface intuitiva e moderna

### Segurança
- 🔐 Criptografia de dados local
- 🛡️ Visualizador de criptografia integrado
- 💾 Persistência segura de dados

## 🛠️ Tecnologias

- React 18.3
- TypeScript
- Tailwind CSS
- Vite
- Recharts (gráficos)
- jsPDF (exportação PDF)
- XLSX (exportação Excel)
- Lucide React (ícones)
- React Hot Toast (notificações)

## 🚀 Instalação

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

## 💻 Uso

### Adicionar Transação
1. Preencha a descrição da transação
2. Informe o valor
3. Selecione o tipo (receita/despesa)
4. Escolha ou crie uma categoria
5. Confirme a adição

### Gerenciar Categorias
1. Clique em "Nova" ao lado do campo de categoria
2. Defina um nome para a categoria
3. Escolha o tipo (receita/despesa)
4. Selecione uma cor personalizada
5. Confirme a criação

### Filtros Avançados
- Pesquisa por texto
- Filtro por data
- Filtro por valor
- Seleção de categorias
- Tipo de transação

### Exportação
- Clique no botão "PDF" para relatório em PDF
- Clique no botão "Excel" para planilha detalhada

### Tema
- Alterne entre tema claro/escuro no botão superior direito

## 📊 Estrutura de Dados

### Transaction
```typescript
{
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: Date
}
```

### Category
```typescript
{
  name: string
  type: 'income' | 'expense'
  color: string
}
```

## 🤝 Contribuição

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
- Use Tailwind CSS para estilização
- Mantenha os componentes React pequenos e focados

## 📝 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
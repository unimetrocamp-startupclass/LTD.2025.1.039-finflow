# FinFlow – Gerenciador Financeiro

## Descrição
Este documento fornece informações detalhadas sobre o FinFlow, um sistema web desenvolvido para auxiliar no controle de receitas e despesas pessoais de forma simples e eficiente.

## Índice
- [Introdução](#introdução)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Funcionalidades](#funcionalidades)
- [Requisitos Técnicos](#requisitos-técnicos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Manutenção](#manutenção)
- [Equipe](#equipe)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Introdução
O **FinFlow** foi desenvolvido para simplificar o controle financeiro pessoal. Ele fornece uma solução eficiente para o registro e acompanhamento de receitas e despesas, permitindo uma visão clara do fluxo financeiro.

## Arquitetura do Sistema
A arquitetura do sistema segue o modelo de **Single Page Application (SPA)**, utilizando as seguintes tecnologias:
- React 18.3.1
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)

## Funcionalidades
- Registro de receitas e despesas
- Cálculo automático do saldo total
- Visualização do histórico de transações
- Exclusão de transações
- Interface responsiva e amigável
- Validação de dados de entrada

## Requisitos Técnicos
- Node.js (16.0.0 ou superior)
- NPM (7.0.0 ou superior)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalação
```bash
# Clone o repositório
git clone https://github.com/unimetrocamp-startupclass/finflow.git

# Acesse o diretório do projeto
cd finflow

# Instale as dependências
npm install
```

## Configuração
O projeto não requer configurações adicionais após a instalação. Todas as dependências são instaladas automaticamente via `package.json`.

## Uso
### Ambiente de desenvolvimento
```bash
npm run dev
```

### Build de produção
```bash
npm run build
```

### Visualização da build local
```bash
npm run preview
```

## Manutenção
Para atualizar o sistema:
```bash
git pull origin main
npm install
```

## Equipe
### Desenvolvedores
- João Silva – Desenvolvedor Frontend
- Maria Santos – Desenvolvedora Frontend
- Pedro Oliveira – Desenvolvedor Full Stack

### Design
- Ana Costa – UI/UX Designer

### Gestão
- Carlos Mendes – Product Owner  
- Beatriz Souza – Scrum Master

## Contribuição
Se deseja contribuir com o projeto:

1. Faça um fork do repositório  
2. Crie um branch para sua feature:  
   `git checkout -b feature/nova-funcionalidade`  
3. Faça o commit das alterações:  
   `git commit -m 'Adiciona nova funcionalidade'`  
4. Envie para o repositório remoto:  
   `git push origin feature/nova-funcionalidade`  
5. Abra um Pull Request

### Padrões de Código
- Utilize **TypeScript** para todo novo código
- Siga as regras do **ESLint**
- Mantenha a formatação com **Prettier**
- Escreva testes para novas funcionalidades
- Crie componentes React pequenos e reutilizáveis
- Use **Tailwind CSS** para estilização

## Licença
Este projeto é licenciado sob a licença **MIT**.  
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

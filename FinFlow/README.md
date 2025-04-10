# Gerenciador Financeiro

## Descrição
Este documento fornece informações detalhadas sobre o Gerenciador Financeiro, um sistema web desenvolvido para auxiliar no controle de receitas e despesas pessoais de forma simples e eficiente.

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
O Gerenciador Financeiro foi desenvolvido para simplificar o controle financeiro pessoal. Ele fornece uma solução eficiente para o registro e acompanhamento de receitas e despesas, permitindo uma visão clara do fluxo financeiro.

## Arquitetura do Sistema
A arquitetura do sistema segue um modelo de Single Page Application (SPA), utilizando as seguintes tecnologias:
- React 18.3.1
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (para ícones)

## Funcionalidades
O sistema possui as seguintes funcionalidades principais:
- Registro de receitas e despesas
- Cálculo automático do saldo total
- Visualização do histórico de transações
- Exclusão de transações
- Interface responsiva e amigável
- Validação de dados de entrada

## Requisitos Técnicos
Para rodar o sistema, são necessários os seguintes requisitos:
- Node.js (versão 16.0.0 ou superior)
- NPM (versão 7.0.0 ou superior)
- Navegador web moderno (Chrome, Firefox, Safari ou Edge)

## Instalação
Para instalar o sistema, siga os passos abaixo:
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gerenciador-financeiro.git

# Acesse o diretório do projeto
cd gerenciador-financeiro

# Instale as dependências
npm install
```

## Configuração
O projeto não requer configurações adicionais após a instalação. Todas as dependências necessárias são instaladas automaticamente através do package.json.

## Uso
Para iniciar o sistema em modo de desenvolvimento, utilize o comando:
```bash
npm run dev
```

Para criar uma build de produção:
```bash
npm run build
```

Para visualizar a build de produção localmente:
```bash
npm run preview
```

## Manutenção
Para atualizar o sistema, execute:
```bash
git pull origin main
npm install
```

## Equipe
Nossa equipe é composta por profissionais dedicados ao desenvolvimento e manutenção deste projeto:

### Desenvolvedores
- João Silva - Desenvolvedor Frontend
- Maria Santos - Desenvolvedora Frontend
- Pedro Oliveira - Desenvolvedor Full Stack

### Design
- Ana Costa - UI/UX Designer

### Gestão
- Carlos Mendes - Product Owner
- Beatriz Souza - Scrum Master

## Contribuição
Se deseja contribuir com o projeto, siga estas etapas:
1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça o commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- Utilize TypeScript para todo código novo
- Siga as regras do ESLint configuradas no projeto
- Mantenha a formatação consistente com o Prettier
- Escreva testes para novas funcionalidades
- Mantenha os componentes React pequenos e focados
- Use Tailwind CSS para estilização

## Licença
Este projeto é licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
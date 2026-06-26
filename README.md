# Caio Ricson Advocacia

Site institucional desenvolvido em Node.js com padrão MVC para o escritório Caio Ricson Advocacia, atuante nas áreas cível, família e criminal.

## Tecnologias

- Node.js + Express
- EJS (template engine)
- SQLite (banco de dados)
- CSS puro

## Como rodar

```bash
mkdir database
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Painel administrativo

Rota: `/auth/login`

- **E-mail:** admin@caioricson.com
- **Senha:** admin123

## Funcionalidades

- Páginas públicas: Início, Sobre, Serviços, Contato
- Área administrativa com login
- CRUD completo de serviços (cadastrar, editar, excluir, pesquisar)
- Formulário de contato com armazenamento no banco

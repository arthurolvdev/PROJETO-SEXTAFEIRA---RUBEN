# Caio Ricson Advocacia

Site institucional desenvolvido em Node.js com padrão MVC para o escritório Caio Ricson Advocacia, atuante nas áreas cível, família e criminal.

## Tecnologias

- Node.js + Express
- EJS (template engine)
- SQLite (banco de dados)
- CSS puro

## Como rodar

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Painel administrativo

Rota: `/auth/login`

- **E-mail:** admin@caioricson.com
- **Senha:** admin123

## Estrutura MVC

```
src/
├── controllers/   # Lógica das rotas
├── models/        # Banco de dados (SQLite)
├── views/         # Templates EJS
│   ├── partials/  # Header e footer
│   └── admin/     # Painel administrativo
└── public/        # CSS e JS estáticos
```

## Funcionalidades

- Páginas públicas: Início, Sobre, Serviços, Contato
- Área administrativa com login
- CRUD completo de serviços (cadastrar, editar, excluir, pesquisar)
- Formulário de contato com armazenamento no banco

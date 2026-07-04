Caio Ricson Advocacia — Site Institucional

Projeto final da disciplina de Programação Web II, desenvolvido como site institucional para um escritório de advocacia real.

A ideia por trás do projeto

Queria fazer algo que fosse além de um projeto fictício. Resolvi buscar um projeto onde se encaixasse em uma necessidade humana, conversei com meu advogado que expressou a intenção de lançar um site pra ele e resolvi tentar realizar um com base nas ideias de negócio dele.

O resultado foi esse site institucional completo pro escritório Caio Ricson Advocacia, com área pública, painel administrativo e uma área exclusiva pra clientes acompanharem seus processos.

O que tem no projeto

Site público


Página inicial com apresentação do escritório
Página Sobre com perfil do advogado
Página de Serviços com as áreas de atuação
Formulário de contato


Área do cliente


Consulta de processos por CPF
Acompanhamento de status e previsão de audiência
Chat de mensagens direto com o advogado


Painel administrativo


Dashboard com gráficos de processos por status e área
CRUD completo de serviços jurídicos
CRUD completo de processos
Visualização e resposta de mensagens dos clientes
Listagem de contatos recebidos pelo formulário


Tecnologias utilizadas


Node.js com Express
EJS como template engine
SQLite com better-sqlite3
Chart.js para os gráficos do dashboard
CSS puro com variáveis e responsividade


Como rodar localmente

bash# Instalar dependências
npm install

# Criar a pasta do banco
mkdir database

# Rodar em modo desenvolvimento
npm run dev

Acesse em: http://localhost:3001

Acesso ao painel

CampoValorRota/auth/loginE-mailadmin@caioricson.comSenhaCaio@123
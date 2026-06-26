const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/advocacia.db');

function getDb() {
  return new Database(DB_PATH);
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      area TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT,
      mensagem TEXT NOT NULL,
      recebido_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    );
  `);

  const userExists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@caioricson.com');
  if (!userExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)').run('Administrador', 'admin@caioricson.com', hash);
  }

  const servicosExistem = db.prepare('SELECT id FROM servicos LIMIT 1').get();
  if (!servicosExistem) {
    const insert = db.prepare('INSERT INTO servicos (titulo, descricao, area) VALUES (?, ?, ?)');
    insert.run('Direito Cível', 'Atuamos em ações de reparação de danos, cobranças, contratos, posse e propriedade, garantindo a defesa dos seus direitos nas relações civis.', 'Cível');
    insert.run('Direito de Família', 'Assistência jurídica em divórcios, inventários, guarda de filhos, pensão alimentícia e partilha de bens com discrição e comprometimento.', 'Família');
    insert.run('Direito Criminal', 'Defesa técnica em processos criminais, inquéritos policiais, habeas corpus e recursos. Atuação estratégica para garantir seus direitos fundamentais.', 'Criminal');
  }

  db.close();
}

function getAllServicos() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM servicos ORDER BY criado_em DESC').all();
  db.close();
  return rows;
}

function getServicoById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM servicos WHERE id = ?').get(id);
  db.close();
  return row;
}

function searchServicos(termo) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM servicos WHERE titulo LIKE ? OR area LIKE ? OR descricao LIKE ?').all(`%${termo}%`, `%${termo}%`, `%${termo}%`);
  db.close();
  return rows;
}

function createServico(titulo, descricao, area) {
  const db = getDb();
  const result = db.prepare('INSERT INTO servicos (titulo, descricao, area) VALUES (?, ?, ?)').run(titulo, descricao, area);
  db.close();
  return result;
}

function updateServico(id, titulo, descricao, area) {
  const db = getDb();
  const result = db.prepare('UPDATE servicos SET titulo = ?, descricao = ?, area = ? WHERE id = ?').run(titulo, descricao, area, id);
  db.close();
  return result;
}

function deleteServico(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM servicos WHERE id = ?').run(id);
  db.close();
  return result;
}

function saveContato(nome, email, telefone, mensagem) {
  const db = getDb();
  const result = db.prepare('INSERT INTO contatos (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)').run(nome, email, telefone, mensagem);
  db.close();
  return result;
}

function getAllContatos() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM contatos ORDER BY recebido_em DESC').all();
  db.close();
  return rows;
}

function getUserByEmail(email) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  db.close();
  return row;
}

module.exports = {
  initDb,
  getAllServicos,
  getServicoById,
  searchServicos,
  createServico,
  updateServico,
  deleteServico,
  saveContato,
  getAllContatos,
  getUserByEmail
};

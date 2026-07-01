const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../database');
const DB_PATH = path.join(DB_DIR, 'advocacia.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function getDb() {
  return new Database(DB_PATH);
}

function gerarNumeroProcesso() {
  const ano = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${random}-${ano}`;
}

function calcularProximaAudiencia() {
  const data = new Date();
  data.setDate(data.getDate() + 45);
  return data.toISOString().split('T')[0];
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

    CREATE TABLE IF NOT EXISTS processos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL UNIQUE,
      cliente_nome TEXT NOT NULL,
      cliente_cpf TEXT NOT NULL,
      area TEXT NOT NULL,
      descricao TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em andamento',
      proxima_audiencia DATE,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mensagens_processo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      processo_id INTEGER NOT NULL,
      autor TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      enviado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (processo_id) REFERENCES processos(id)
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

function getAllProcessos() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM processos ORDER BY criado_em DESC').all();
  db.close();
  return rows;
}

function getProcessoById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM processos WHERE id = ?').get(id);
  db.close();
  return row;
}

function getProcessoByCpf(cpf) {
  const db = getDb();
  const cpfLimpo = cpf.replace(/\D/g, '');
  const rows = db.prepare("SELECT * FROM processos WHERE replace(replace(replace(cliente_cpf, '.', ''), '-', ''), '/', '') = ?").all(cpfLimpo);
  db.close();
  return rows;
}

function createProcesso(clienteNome, clienteCpf, area, descricao, status) {
  const db = getDb();
  let numero = gerarNumeroProcesso();
  while (db.prepare('SELECT id FROM processos WHERE numero = ?').get(numero)) {
    numero = gerarNumeroProcesso();
  }
  const proximaAudiencia = calcularProximaAudiencia();
  const result = db.prepare('INSERT INTO processos (numero, cliente_nome, cliente_cpf, area, descricao, status, proxima_audiencia) VALUES (?, ?, ?, ?, ?, ?, ?)').run(numero, clienteNome, clienteCpf, area, descricao, status || 'Em andamento', proximaAudiencia);
  db.close();
  return result;
}

function updateProcesso(id, clienteNome, clienteCpf, area, descricao, status, proximaAudiencia) {
  const db = getDb();
  const result = db.prepare('UPDATE processos SET cliente_nome = ?, cliente_cpf = ?, area = ?, descricao = ?, status = ?, proxima_audiencia = ? WHERE id = ?').run(clienteNome, clienteCpf, area, descricao, status, proximaAudiencia, id);
  db.close();
  return result;
}

function deleteProcesso(id) {
  const db = getDb();
  db.prepare('DELETE FROM mensagens_processo WHERE processo_id = ?').run(id);
  const result = db.prepare('DELETE FROM processos WHERE id = ?').run(id);
  db.close();
  return result;
}

function getMensagensByProcesso(processoId) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM mensagens_processo WHERE processo_id = ? ORDER BY enviado_em ASC').all(processoId);
  db.close();
  return rows;
}

function saveMensagemProcesso(processoId, autor, mensagem) {
  const db = getDb();
  const result = db.prepare('INSERT INTO mensagens_processo (processo_id, autor, mensagem) VALUES (?, ?, ?)').run(processoId, autor, mensagem);
  db.close();
  return result;
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
  getUserByEmail,
  getAllProcessos,
  getProcessoById,
  getProcessoByCpf,
  createProcesso,
  updateProcesso,
  deleteProcesso,
  getMensagensByProcesso,
  saveMensagemProcesso
};

const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
  const servicos = db.getAllServicos();
  res.render('index', { servicos });
});

router.get('/sobre', (req, res) => {
  res.render('sobre');
});

router.get('/servicos', (req, res) => {
  const servicos = db.getAllServicos();
  res.render('servicos', { servicos });
});

router.get('/contato', (req, res) => {
  res.render('contato', { sucesso: null, erro: null });
});

router.post('/contato', (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.render('contato', { sucesso: null, erro: 'Preencha todos os campos obrigatórios.' });
  }
  db.saveContato(nome, email, telefone || '', mensagem);
  res.render('contato', { sucesso: 'Mensagem enviada com sucesso! Entraremos em contato em breve.', erro: null });
});

module.exports = router;

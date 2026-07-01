const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
  res.render('processos/consulta', { processos: null, erro: null, cpf: '' });
});

router.post('/', (req, res) => {
  const { cpf } = req.body;
  if (!cpf) {
    return res.render('processos/consulta', { processos: null, erro: 'Informe o CPF.', cpf: '' });
  }
  const processos = db.getProcessoByCpf(cpf);
  if (!processos || processos.length === 0) {
    return res.render('processos/consulta', { processos: null, erro: 'Nenhum processo encontrado para este CPF.', cpf });
  }
  res.render('processos/consulta', { processos, erro: null, cpf });
});

router.get('/:id', (req, res) => {
  const processo = db.getProcessoById(req.params.id);
  if (!processo) return res.redirect('/processos');
  const mensagens = db.getMensagensByProcesso(processo.id);
  res.render('processos/detalhe', { processo, mensagens, sucesso: null, erro: null });
});

router.post('/:id/mensagem', (req, res) => {
  const processo = db.getProcessoById(req.params.id);
  if (!processo) return res.redirect('/processos');
  const { mensagem } = req.body;
  if (!mensagem || !mensagem.trim()) {
    const mensagens = db.getMensagensByProcesso(processo.id);
    return res.render('processos/detalhe', { processo, mensagens, sucesso: null, erro: 'Escreva uma mensagem antes de enviar.' });
  }
  db.saveMensagemProcesso(processo.id, processo.cliente_nome, mensagem.trim());
  const mensagens = db.getMensagensByProcesso(processo.id);
  res.render('processos/detalhe', { processo, mensagens, sucesso: 'Mensagem enviada ao advogado.', erro: null });
});

module.exports = router;

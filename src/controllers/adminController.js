const express = require('express');
const router = express.Router();
const db = require('../models/db');

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

router.use(requireAuth);

router.get('/', (req, res) => {
  const servicos = db.getAllServicos();
  const contatos = db.getAllContatos();
  const processos = db.getAllProcessos();
  res.render('admin/dashboard', { servicos, contatos, processos, userName: req.session.userName, busca: '' });
});

router.get('/servicos/buscar', (req, res) => {
  const busca = req.query.q || '';
  const servicos = busca ? db.searchServicos(busca) : db.getAllServicos();
  const contatos = db.getAllContatos();
  const processos = db.getAllProcessos();
  res.render('admin/dashboard', { servicos, contatos, processos, userName: req.session.userName, busca });
});

router.get('/servicos/novo', (req, res) => {
  res.render('admin/form-servico', { servico: null, erro: null });
});

router.post('/servicos/novo', (req, res) => {
  const { titulo, descricao, area } = req.body;
  if (!titulo || !descricao || !area) {
    return res.render('admin/form-servico', { servico: null, erro: 'Preencha todos os campos.' });
  }
  db.createServico(titulo, descricao, area);
  res.redirect('/admin');
});

router.get('/servicos/editar/:id', (req, res) => {
  const servico = db.getServicoById(req.params.id);
  if (!servico) return res.redirect('/admin');
  res.render('admin/form-servico', { servico, erro: null });
});

router.post('/servicos/editar/:id', (req, res) => {
  const { titulo, descricao, area } = req.body;
  if (!titulo || !descricao || !area) {
    const servico = db.getServicoById(req.params.id);
    return res.render('admin/form-servico', { servico, erro: 'Preencha todos os campos.' });
  }
  db.updateServico(req.params.id, titulo, descricao, area);
  res.redirect('/admin');
});

router.post('/servicos/excluir/:id', (req, res) => {
  db.deleteServico(req.params.id);
  res.redirect('/admin');
});

router.get('/processos/novo', (req, res) => {
  res.render('admin/form-processo', { processo: null, erro: null });
});

router.post('/processos/novo', (req, res) => {
  const { cliente_nome, cliente_cpf, area, descricao, status } = req.body;
  if (!cliente_nome || !cliente_cpf || !area || !descricao) {
    return res.render('admin/form-processo', { processo: null, erro: 'Preencha todos os campos.' });
  }
  db.createProcesso(cliente_nome, cliente_cpf, area, descricao, status);
  res.redirect('/admin');
});

router.get('/processos/editar/:id', (req, res) => {
  const processo = db.getProcessoById(req.params.id);
  if (!processo) return res.redirect('/admin');
  res.render('admin/form-processo', { processo, erro: null });
});

router.post('/processos/editar/:id', (req, res) => {
  const { cliente_nome, cliente_cpf, area, descricao, status, proxima_audiencia } = req.body;
  if (!cliente_nome || !cliente_cpf || !area || !descricao || !status) {
    const processo = db.getProcessoById(req.params.id);
    return res.render('admin/form-processo', { processo, erro: 'Preencha todos os campos.' });
  }
  db.updateProcesso(req.params.id, cliente_nome, cliente_cpf, area, descricao, status, proxima_audiencia);
  res.redirect('/admin');
});

router.post('/processos/excluir/:id', (req, res) => {
  db.deleteProcesso(req.params.id);
  res.redirect('/admin');
});

router.get('/processos/:id/mensagens', (req, res) => {
  const processo = db.getProcessoById(req.params.id);
  if (!processo) return res.redirect('/admin');
  const mensagens = db.getMensagensByProcesso(processo.id);
  res.render('admin/mensagens-processo', { processo, mensagens });
});

router.post('/processos/:id/responder', (req, res) => {
  const { mensagem } = req.body;
  if (mensagem && mensagem.trim()) {
    db.saveMensagemProcesso(req.params.id, 'Advogado', mensagem.trim());
  }
  res.redirect(`/admin/processos/${req.params.id}/mensagens`);
});

module.exports = router;

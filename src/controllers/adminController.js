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
  res.render('admin/dashboard', { servicos, contatos, userName: req.session.userName, busca: '' });
});

router.get('/servicos/buscar', (req, res) => {
  const busca = req.query.q || '';
  const servicos = busca ? db.searchServicos(busca) : db.getAllServicos();
  const contatos = db.getAllContatos();
  res.render('admin/dashboard', { servicos, contatos, userName: req.session.userName, busca });
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

module.exports = router;

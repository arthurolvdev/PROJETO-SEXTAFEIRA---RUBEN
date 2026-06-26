const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/admin');
  res.render('admin/login', { erro: null });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.getUserByEmail(email);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.render('admin/login', { erro: 'E-mail ou senha incorretos.' });
  }

  req.session.userId = usuario.id;
  req.session.userName = usuario.nome;
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;

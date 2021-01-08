const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/feed', (req, res) => {
  res.redirect('/posts');
});

router.get('/login', (req, res) => {
  res.redirect('/users/login');
});

router.get('/signup', (req, res) => {
  res.redirect('/users/signup');
});

module.exports = router;

const { Router } = require('express');
const { loginGuard, homeGuard } = require('../auth/auth.guards');
const userService = require('./user.services');
const router = Router();

router
  .route('/login')
  .get(homeGuard, (req, res) => {
    res.render('users/login', { title: 'Login', message: req.query.message });
  })
  .post(homeGuard, async (req, res) => {
    const { email, password } = req.body;
    const { next = 'posts' } = req.query;

    if (email && password) {
      const user = await userService.login(email, password);
      if (user) {
        req.session.userId = user.id;
        res.redirect('/' + next);
      } else {
        const message = 'wrong email or password'.replace(/ /g, '+');
        res.redirect('/users/login?message=' + message);
      }
    } else {
      const message = 'incomplete login information'.replace(/ /g, '+');
      res.redirect('/users/login?message=' + message);
    }
  });

router
  .route('/signup')
  .get(homeGuard, (req, res) => {
    res.render('users/signup', { title: 'Signup', message: req.query.message });
  })
  .post(homeGuard, async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
      try {
        const user = await userService.create(name, email, password);
        req.session.userId = user.id;
        res.redirect('/');
      } catch (err) {
        const message = 'email already in use'.replace(/ /g, '+');
        res.redirect('/users/signup?message=' + message);
      }
    } else {
      const message = 'incomplete signup information'.replace(/ /g, '+');
      res.redirect('/users/signup?message=' + message);
    }
  });

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect('/');
    } else {
      res.clearCookie('flipper');
      res.redirect('/users/login');
    }
  });
});

router.get('/profile', loginGuard, async (req, res) => {
  const { userId } = req.session
  res.redirect('/users/' + userId);
});

router.get('/:id', loginGuard, async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    res.render('users/user', { title: user.name, user, userId: req.session.userId, });
  } catch (err) {
    const message = 'user not found'.replace(/ /g, '+');
    res.redirect('/users/login?message=' + message);
  }
});

router.get('/', loginGuard, async (req, res) => {
  try {
    const users = await userService.find();
    res.render('users/users', { title: 'Users', users, userId: req.session.userId, });
  } catch (err) {
    const message = 'users couldnt be found'.replace(/ /g, '+');
    res.redirect('/users/login?message=' + message);
  }
})

module.exports = router;

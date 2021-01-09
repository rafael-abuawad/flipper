const { Router } = require('express');
const userService = require('../user/user.services');
const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await userService.login(email, password);
    if (user) {
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.json({ error: 'wrong email or password' });
    }
  } else {
    res.json({ error: 'incomplete login information' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.create(name, email, password);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;

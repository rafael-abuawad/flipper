const { Router } = require('express');
const jwt = require('jsonwebtoken');
const jwtExpress = require('express-jwt');
const userService = require('./user.services');
const router = Router();

router
  .route('/')
  .get(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) {
        return res.sendStatus(401);
      } else {
        try {
          const users = (await userService.find()).map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }));
          res.json({ users });
        } catch (err) {
          console.error(err);
          res.json({ error: "The request couldn't be completed" });
        }
      }
    }
  );

router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const user = await userService.login(email, password);
      if (user) {
        console.log({ JWT_SECRET: process.env.JWT_SECRET });
        const token = jwt.sign(
          { user: { id: user.id, name: user.name, email: user.email } },
          process.env.JWT_SECRET,
          { algorithm: 'HS256' }
        );
        res.json({ token });
      } else {
        res.json({ error: 'Incorrect email or password' });
      }
    } catch (err) {
      console.error(err);
      res.json({ error: 'An error ocurred' });
    }
  } else {
    res.json({ error: 'Email And Password are required fileds' });
  }
});

router.route('/signup').post(async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    try {
      const user = await userService.create(name, email, password);
      const token = jwt.sign(
        { user: { id: user.id, name: user.name, email: user.email } },
        process.env.JWT_SECRET,
        { algorithm: 'HS256' }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.json({ error: 'Email already in use' });
    }
  } else {
    res.json({ error: 'Name, Email And Password are required fileds' });
  }
});

router
  .route('/profile')
  .get(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) {
        return res.sendStatus(401);
      } else {
        res.status(200).json({ user: req.user });
      }
    }
  )
  .put(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) {
        return res.sendStatus(401);
      } else {
        try {
          const { name } = req.body;
          const user = await userService.update(req.user.id, name);
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (err) {
          console.error(err);
          res.json({ error: "The request couldn't be completed" });
        }
      }
    }
  )
  .delete(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) {
        return res.sendStatus(401);
      } else {
        try {
          const user = await userService.remove(req.user.id);
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (err) {
          console.error(err);
          res.json({ error: "The request couldn't be completed" });
        }
      }
    }
  );

router
  .route('/:id')
  .get(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) return res.sendStatus(401);
      else {
        try {
          const user = await userService.findById(req.params.id);
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (err) {
          console.error(err);
          res.json({ error: "The request couldn't be completed" });
        }
      }
    }
  );

module.exports = router;

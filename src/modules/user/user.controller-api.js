const { Router } = require('express');
const userService = require('./user.services');
const router = Router();

router.route('/').get(async (req, res) => {
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
});

router
  .route('/:id')
  .get(async (req, res) => {
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
  })
  .put(async (req, res) => {
    try {
      const { name } = req.body;
      const user = await userService.update(req.params.id, name);
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
  })
  .delete(async (req, res) => {
    try {
      const user = await userService.remove(req.params.id);
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
  });

module.exports = router;

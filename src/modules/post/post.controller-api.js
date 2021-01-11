const { Router } = require('express');
const postService = require('./post.services');
const jwtExpress = require('express-jwt');
const router = Router();

router
  .route('/')
  .get(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      try {
        const posts = await postService.find();
        res.json({ posts });
      } catch (error) {
        console.error(error);
        res.json({ error: "The request couldn't be completed" });
      }
    }
  )
  .post(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      try {
        const { title, description, minutesPerBlock } = req.body;
        const authorId = req.user.id;
        const post = await postService.create(
          title,
          description,
          minutesPerBlock,
          authorId
        );
        res.json({ post });
      } catch (error) {
        console.error(error);
        res.json({ error: "The request couldn't be completed" });
      }
    }
  );

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const post = await postService.findById(req.params.id);
      res.json({ post });
    } catch (error) {
      console.error(error);
      res.json({ error: "The request couldn't be completed" });
    }
  })
  .put(
    jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      if (!req.user) {
        return res.sendStatus(401);
      } else {
        try {
          const { title, description, published } = req.body;
          const post = await postService.update(
            req.params.id,
            title,
            content,
            published
          );
          res.json({ post });
        } catch (error) {
          console.error(error);
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
          const post = await postService.remove(req.params.id);
          res.json({ post });
        } catch (error) {
          console.error(error);
          res.json({ error: "The request couldn't be completed" });
        }
      }
    }
  );

router.put(
  '/:id/increment',
  jwtExpress({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    } else {
      try {
        const { authorId } = req.body;
        const post = await postService.updateCompleted(req.params.id, authorId);
        res.json({ post });
      } catch (error) {
        console.error(error);
        res.json({ error: "The request couldn't be completed" });
      }
    }
  }
);

module.exports = router;

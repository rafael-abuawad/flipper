const { Router } = require('express');
const postService = require('./post.services');
const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const posts = await postService.find();
      res.json({ posts });
    } catch (error) {
      res.json({ error });
    }
  })
  .post(async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await postService.create(title, content);
      res.json({ post });
    } catch (error) {
      res.json({ error });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const post = await postService.findById(req.params.id);
      res.json({ post });
    } catch (error) {
      res.json({ error });
    }
  })
  .put(async (req, res) => {
    try {
      const { title, content, published } = req.body;
      const post = await postService.update(
        req.params.id,
        title,
        content,
        published
      );
      res.json({ post });
    } catch (error) {
      res.json({ error });
    }
  })
  .delete(async (req, res) => {
    try {
      const post = await postService.remove(req.params.id);
      res.json({ post });
    } catch (error) {
      res.json({ error });
    }
  });

module.exports = router;

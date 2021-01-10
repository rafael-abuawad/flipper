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
      console.error(error);
      res.json({ error: "The request couldn't be completed" });
    }
  })
  .post(async (req, res) => {
    try {
      // TODO: Change to JWT auth, get the Author ID from that
      const { title, description, minutesPerBlock, authorId } = req.body;
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
  });

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
  .put(async (req, res) => {
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
  })
  .delete(async (req, res) => {
    try {
      const post = await postService.remove(req.params.id);
      res.json({ post });
    } catch (error) {
      console.error(error);
      res.json({ error: "The request couldn't be completed" });
    }
  });

router.put('/:id/increment', async (req, res) => {
  try {
    const { authorId } = req.body;
    const post = await postService.updateCompleted(req.params.id, authorId);
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.json({ error: "The request couldn't be completed" });
  }
});

module.exports = router;

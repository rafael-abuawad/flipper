const { Router } = require('express');
const { loginGuard } = require('../auth/auth.guards');
const postServices = require('./post.services');
const router = Router();

router.get('/', loginGuard, async (req, res) => {
  const posts = await postServices.find();
  res.render('posts/posts', {
    title: 'Posts',
    posts,
    message: req.query.message,
  });
});

router
  .route('/create')
  .get(loginGuard, (req, res) => {
    res.render('posts/create', {
      title: 'Create post',
      message: req.query.message,
    });
  })
  .post(loginGuard, async (req, res) => {
    try {
      const { title, content } = req.body;
      if (title && content) {
        const authorId = req.session.userId;
        try {
          const post = await postServices.create(title, content, authorId);
          res.redirect('/posts/' + post.id);
        } catch (err) {
          const message = "author doesn't exists".replace(/ /g, '+');
          res.redirect('/posts/create?message=' + message);
        }
      } else {
        const message = 'title or content are missing'.replace(/ /g, '+');
        res.redirect('/posts/create?message=' + message);
      }
    } catch (err) {
      const message = "post coulnd't be created".replace(/ /g, '+');
      res.redirect('/posts/create?message=' + message);
    }
  });

router.get('/:id', loginGuard, async (req, res) => {
  try {
    const post = await postServices.findById(req.params.id);
    res.render('posts/post', { title: post.title, post });
  } catch (err) {
    const message = "post coulnd't be found".replace(/ /g, '+');
    res.redirect('/posts/?message=' + message);
  }
});

module.exports = router;

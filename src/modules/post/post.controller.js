const { Router } = require('express');
const { loginGuard } = require('../auth/auth.guards');
const postServices = require('./post.services');
const router = Router();

router.get('/', loginGuard, async (req, res) => {
  try {
    const posts = await postServices.find();
    res.render('posts/posts', {
      title: 'Posts',
      posts,
      message: req.query.message,
      userId: req.session.userId,
    });
  } catch (err) {
    console.log(err);
    const message = 'an error ocurred'.replace(/ /g, '+');
    res.redirect('/posts/create?message=' + message);
  }
});

router
  .route('/create')
  .get(loginGuard, (req, res) => {
    res.render('posts/create', {
      title: 'Create post',
      message: req.query.message,
      userId: req.session.userId,
    });
  })
  .post(loginGuard, async (req, res) => {
    try {
      const { title, description, minutesPerBlock } = req.body;
      if (title && description) {
        const authorId = req.session.userId;
        try {
          const post = await postServices.create(
            title,
            description,
            minutesPerBlock,
            authorId
          );
          res.redirect('/posts/' + post.id);
        } catch (err) {
          console.error(err);
          const message = "author doesn't exists".replace(/ /g, '+');
          res.redirect('/posts/create?message=' + message);
        }
      } else {
        const message = 'title or content are missing'.replace(/ /g, '+');
        res.redirect('/posts/create?message=' + message);
      }
    } catch (err) {
      console.error(err);
      const message = "post coulnd't be created".replace(/ /g, '+');
      res.redirect('/posts/create?message=' + message);
    }
  });

router.route('/:id').get(loginGuard, async (req, res) => {
  try {
    const post = await postServices.findById(req.params.id);

    res.render('posts/post', {
      title: post.title,
      post: {
        ...post,
        createdAtString: new Date(post.createdAt).toLocaleString(),
      },
      userId: req.session.userId,
    });
  } catch (err) {
    console.error(err);
    const message = "post coulnd't be found".replace(/ /g, '+');
    res.redirect('/posts/?message=' + message);
  }
});

router.post('/:id/increment', loginGuard, async (req, res) => {
  try {
    const authorId = req.session.userId;
    await postServices.updateCompleted(req.params.id, authorId);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    const message = "post coulnd't be found".replace(/ /g, '+');
    res.redirect('/posts/?message=' + message);
  }
});

router.post('/:id/delete', loginGuard, async (req, res) => {
  try {
    await postServices.remove(req.params.id);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    const message = "post coulnd't be found".replace(/ /g, '+');
    res.redirect('/posts/?message=' + message);
  }
});

module.exports = router;

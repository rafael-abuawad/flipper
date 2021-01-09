const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const path = require('path');

const appController = require('./app.controller');
const postController = require('./modules/post/post.controller');
const userController = require('./modules/user/user.controller');

const authApiController = require('./modules/auth/auth.controller-api');
const postApiController = require('./modules/post/post.controller-api');
const userApiController = require('./modules/user/user.controller-api');

const app = express();

// App constants
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('static', path.join(__dirname, 'static'));
app.set('view engine', 'html');

// App middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(app.get('static')));
app.use(morgan(app.get('env') == 'production' ? 'common' : 'dev'));
app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: app.get('enviroment') == 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// App view engine
nunjucks.configure(app.get('views'), {
  autoescape: true,
  express: app,
});

// App routes
app.use('/posts', postController);
app.use('/users', userController);
app.use('/api/auth', authApiController);
app.use('/api/posts', postApiController);
app.use('/api/users', userApiController);
app.use('/', appController);

app.listen(app.get('port'), () =>
  console.log(`App listening on http://localhost:${app.get('port')}`)
);

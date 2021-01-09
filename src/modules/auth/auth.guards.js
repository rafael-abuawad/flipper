const loginGuard = (req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    next();
  } else {
    const message = 'You must be logged in'.replace(/ /g, '+');
    const next = req.baseUrl.slice(1);
    res.redirect(`/users/login?message=${message}&next=${next}`);
  }
};

const homeGuard = (req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.redirect('/users/' + userId);
  } else {
    next();
  }
};

module.exports = {
  loginGuard,
  homeGuard,
};

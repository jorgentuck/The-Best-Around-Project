const router = require('express').Router();
const checkAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('homepage');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }

    res.render('login');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', checkAuth, async (req, res) => {
  try {
    res.render('profile');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/upload', checkAuth, async (req, res) => {
  try {
    res.render('upload');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

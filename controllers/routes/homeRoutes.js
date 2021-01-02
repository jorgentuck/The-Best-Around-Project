const router = require('express').Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../../utils/auth');
const {
  Designs,
  Favorites,
  Images,
  Instructions,
  Users,
  Videos,
  Votes,
} = require('../../models');

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

router.get('/profile', async (req, res) => {
// router.get('/profile', checkAuth, async (req, res) => {
  try {
    res.render('profile');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/upload', async (req, res) => {
// router.get('/upload', checkAuth, async (req, res) => {
  try {
    res.render('upload');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email_address: req.body.email_address },
    });

    if (!user) {
      res.status(404).json({ message: 'Login failed! email not found' });
      return;
    }

    const passValidation = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passValidation) {
      res.status(404).json({ message: 'Login failed! password wrong' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      console.log("logged in")
    });
    // res.status(200).json({ message: 'Login Success!' });
    // res.status(200).json(req.session);
    res.render('profile');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.render('homepage');
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;

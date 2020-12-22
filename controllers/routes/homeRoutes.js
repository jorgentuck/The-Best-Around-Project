const router = require('express').Router();

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
    try {
        if (!req.session.logged_in) {
            res.redirect('/login');
            return;
          }

          res.render('profile');
    } catch (err) {

    }
});

router.get('/upload', async (req, res) => {
    try {

          res.render('upload');
    } catch (err) {

    }
});

module.exports = router;
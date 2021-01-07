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
    const designData = await Designs.findAll({
      limit: 4,
      order: [['rating', 'DESC'],]
    });
    if (!designData) {
      res.render('homepage');
      console.log('no data')
      // res.status(200).json(designData);
    }
    const designs = designData.map((design) => design.get({ plain: true }));
    console.log(designs)
    res.render('homepage', { designs });
    // res.render('homepage');
    // res.status(200).json(designData);
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

// router.get('/profile', async (req, res) => {
router.get('/profile', checkAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.session.user_id, {
      include: [
        {
          model: Designs,
          include: [
            { model: Images },
            { model: Instructions },
            { model: Videos },
          ],
        },
        {
          model: Favorites,
          include: Designs,
        },
        { model: Votes },
      ],
      attributes: { exclude: ['password'] },
    });
    if (userData.length == 0) {
      res.status(404).json({ message: 'No user found with that ID' });
      return;
    }

    const favCount = await Favorites.findAndCountAll({
      where: { user_id: req.session.user_id }
    });

    const vidCount = await Videos.findAndCountAll({
      include: [
        {
          model: Designs,
          where: { user_id: req.session.user_id }
        }
      ],

    });

    const designCount = await Designs.findAndCountAll({
      where: { user_id: req.session.user_id }
    });

    const user = userData.get({ plain: true });
    res.render('profile', { ...user, favCount, vidCount, designCount });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/upload', async (req, res) => {
router.get('/upload', checkAuth, async (req, res) => {
  try {
    res.render('upload');
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/vote', async (req, res) => {
router.get('/vote', checkAuth, async (req, res) => {
  try {
    const designData = await Designs.findAll({
      limit: 4,
      order: [['rating', 'DESC'],]
    });
    if (!designData) {
      res.render('designs');
      console.log('no data')
    }
    const designs = designData.map((design) => design.get({ plain: true }));
    console.log(designs)
    res.render('designs', { designs });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/vote/:id', checkAuth, async (req, res) => {
  try {
    const designData = await Designs.findByPk(req.params.id, {
      include: [
        { model: Images },
        { model: Instructions, order: [['sequence', 'ASC'],] },
        { model: Videos },
        { model: Votes },
        { model: Favorites, where: { user_id: req.session.user_id }, required: false }
      ],
    });
    if (!designData) {
      res.render('vote');
      console.log('no data')
    }
    const designs = designData.get({ plain: true });
    console.log(designs)
    res.render('vote', { designs });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/edit/:id', async (req, res) => {
  try {

    const designData = await Designs.findByPk(req.params.id, {
      include: [
        { model: Favorites },
        { model: Images },
        { model: Instructions },
        { model: Users, attributes: { exclude: ['password'] } },
        { model: Videos },
        { model: Votes },
      ],
    });
    if (!designData) {
      res.status(404).json({ message: 'No designs found' });
      return;
    }
    const designs = designData.get({ plain: true });
    console.log(designs)
    res.render('editDesign', { designs });
    // res.status(200).json(designData);
    // res.render('editDesign')
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
      res.status(404).json({ message: 'Login failed!' });
      return;
    }
    const passValidation = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passValidation) {
      res.status(404).json({ message: 'Login failed!' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      res.status(200).json({ message: 'Login Success!' });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/vote/:id', checkAuth, async (req, res) => {
  try {
    const voterId = req.session.user_id;
    const designId = req.params.id;
    console.log('voter id', voterId);
    console.log('design id', designId);
    const voted = await Votes.count({ where: { user_id: voterId } });
    if (voted === 0) {
      Votes.create({ user_id: voterId, design_id: designId });
      console.log('created');
    } else {
      Votes.destroy({ where: { user_id: voterId } });
      console.log('destroyed');
    }
    res.status(200).json({ message: 'Vote successful' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/fav/:id', checkAuth, async (req, res) => {
  try {
    const voterId = req.session.user_id;
    const designId = req.params.id;
    console.log('voter id', voterId);
    console.log('design id', designId);
    const voted = await Favorites.count({ where: { user_id: voterId } });
    if (voted === 0) {
      Favorites.create({ user_id: voterId, design_id: designId });
      console.log('created');
    } else {
      Favorites.destroy({ where: { user_id: voterId } });
      console.log('destroyed');
    }
    res.status(200).json({ message: 'Favorite successful' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

router.get('*', (req, res) => {
  res.redirect('/')
});

module.exports = router;

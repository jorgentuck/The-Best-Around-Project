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
      order: 'rating DESC'
    });
    if (!designData) {
      res.status(404).json({ message: 'No designs found' });
      return;
    }
    const design = designData.get({ plain: true });
    res.render('homepage', { ...design });
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
    res.render('vote');
  } catch (err) {
    res.status(500).json(err);
  } 
});

router.get('/sign-s3', checkAuth, async (req, res) => {
  const userId = req.session.user_id;
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: userId.concat(fileName),
    Expires: 120,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

router.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
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
      // res.status(200).json(req.session);
      // console.log("made it here")
      // return;
      // res.redirect('/profile');
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/vote/:id', checkAuth, async (req, res) => {
  try {
    // const voterId = req.session.user_id;
    const voterId = 1;
    const designId = req.params.id;
    const voted = await Votes.count({ where: { user_id: voterId}});
    if (voted === 0) {
      Votes.create({ user_id: voterId, design_id: designId});
    } else {
      Votes.destroy({ where: {user_id: voterId}});
    }
    res.status(200).json({ message: 'Vote successful'});
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});
module.exports = router;

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
// router.get('/profile', async (req, res) => {
router.get('/profile', checkAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id, {
      include: [
        {
          model: Designs,
          include: [
            { model: Images },
            { model: Instructions },
            { model: Videos },
          ],
        },
        { model: Favorites },
        { model: Votes },
      ],
      attributes: { exclude: ['password'] },
    });
    if (userData.length == 0) {
      res.status(404).json({ message: 'No user found with that ID' });
      return;
    }
    const user = userData.get({ plain: true });
    res.render('profile', {...user});
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
    if(err){
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
      // res.status(200).json({ message: 'Login Success!' });
      // res.status(200).json(req.session);
      res.redirect('/profile');
    });
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
    res.status(404).end();
  }
});
module.exports = router;

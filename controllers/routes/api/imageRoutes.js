const router = require('express').Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../../../utils/auth');
const {
  Designs,
  Favorites,
  Images,
  Instructions,
  Users,
  Videos,
  Votes,
} = require('../../../models');


// FUTURE DELEVOPMENT


router.get('/', async (req, res) => {
  try {
    const imageData = await Images.findAll({

    });

    const image = await imageData.map((x) => x.get({ plain: true }));

    res.status(200).json(image);
    // res.render("posts", { image });
  } catch (err) {
    res.status(500).json(err);
  }
  // try {
  //   const imageData = await Images.findAll({
  //     include: [{ model: Designs }],
  //   });
  //   if (imageData.length == 0) {
  //     res.status(404).json({ message: 'No images found' });
  //     return;
  //   }
  //   res.status(200).json(imageData);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

router.get('/:id', async (req, res) => {
  try {
    const imageData = await Images.findByPk(req.params.id, {
      include: [{ model: Designs }],
    });
    if (!imageData) {
      res.status(404).json({ message: 'No images found' });
      return;
    }
    res.status(200).json(imageData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

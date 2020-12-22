const router = require('express').Router();
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

router.get('/', async (req, res) => {
  try {
    const designData = await Designs.findAll({
      include: [
        { model: Favorites },
        { model: Images },
        { model: Instructions },
        { model: Users, attributes: { exclude: ['password'] } },
        { model: Videos },
        { model: Votes },
      ],
    });
    if (designData.length == 0) {
      res.status(404).json({ message: 'No Designs found' });
      return;
    }
    res.status(200).json(designData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

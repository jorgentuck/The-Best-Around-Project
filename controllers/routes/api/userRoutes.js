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
    const userData = await Users.findAll({
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
      res.status(404).json({ message: 'No Users found' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

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
      res.status(404).json({ message: 'No designs found' });
      return;
    }
    res.status(200).json(designData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
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
    res.status(200).json(designData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/top4', async (req, res) => {
  try {
    const designData = await Designs.findAll({
      limit: 4,
      order: 'rating DESC'
    });
    if (!designData) {
      res.status(404).json({ message: 'No designs found' });
      return;
    }
    res.status(200).json(designData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    
    const newDesign = req.body;
    const designData = await Designs.create(newDesign);
    designData.design_id = designData.id;
    await Instructions.bulkCreate(newDesign, {
      individualHooks: true,
      returning: true,
    });
    await Videos.bulkCreate(newDesign, {
      individualHooks: true,
      returning: true,
    });
    res.status(200).json({ message: 'Design added!' })
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;

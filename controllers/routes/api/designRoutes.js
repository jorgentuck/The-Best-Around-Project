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
    newDesign.user_id = req.session.user_id;
    const designData = await Designs.create(newDesign);
    newDesign.design_id = designData.id;
    // await Instructions.bulkCreate(newDesign, {
    //   individualHooks: true,
    //   returning: true,
    // });
    await Videos.create(newDesign);
    res.status(200).json({ 
      message: 'Design added!',
      id: newDesign.design_id,
   });
    // res.redirect(307, `/edit/${newDesign.design_id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/id/:id', async (req, res) => {
  try {

    const newDesign = req.body;
    newDesign.user_id = req.session.user_id;
    newDesign.design_id = parseInt(req.params.id);
    console.log(newDesign)
    await Designs.update(newDesign, {
      where: {
        id: newDesign.design_id
      }
    });
    if (newDesign.video_link === '') {
      await Videos.destroy({
        where: {
          design_id: newDesign.design_id
        }
      })
    } else {
      const videoData = await Videos.findOne({
        where: { design_id: newDesign.design_id }
      });
      console.log('.get')
      if (videoData) {
        const videos = videoData.map((video) => video.get({ plain: true }));
        console.log(videos);

        console.log('update');
        await Videos.update(newDesign, {
          where: {
            id: videos.id
          }
        });
      }
      else {
        console.log('create')
        await Videos.create(newDesign);
      }
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

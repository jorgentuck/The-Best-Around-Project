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
      res.status(404).json({ message: 'No users found' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
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
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/name/:user_name', async (req, res) => {
  try {
    console.log(req.params.user_name)
    const userData = await Users.findAndCountAll({
      where: { user_name: req.params.user_name }
    });
    if (!userData.count == 0) {
      res.status(200).json({ message: 'That Username is in use' });
      return;
    }
    res.status(200).json({ message: 'That Username is free' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/email/', async (req, res) => {
  try {
    console.log(req.body.email_address)
    const userData = await Users.findAndCountAll({
      where: { email_address: req.body.email_address }
    });
    if (!userData.count == 0) {
      res.status(200).json({ message: 'That Email is in use' });
      return;
    }
    res.status(200).json({ message: 'That Email is free' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = req.body;

    newUser.password = await bcrypt.hash(req.body.password, 10);

    newUser.full_name = newUser.first_name.concat(' ', newUser.last_name);

    const createdUser = await Users.create(newUser);

    const userData = await Users.findByPk(createdUser.id, {
      attributes: { exclude: ['password'] },
    });

    // res.status(200).json(userData);
    req.session.save(() => {
      req.session.user_id = createdUser.id;
      req.session.logged_in = true;
      res.redirect('/profile');
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const newUser = req.body;

    const userData = await Users.update(newUser, {
      where: {
        id: req.params.id,
      },
    });
    if (!userData) {
      res.status(404).json({ message: 'No user found with that ID' });
      return;
    }
    res.status(200).json({ message: 'User ' + req.params.id + ' updated!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userData = await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!userData) {
      res.status(404).json({ message: 'No user found with that ID' });
      return;
    }
    res.status(200).json({ message: 'User ' + req.params.id + ' deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

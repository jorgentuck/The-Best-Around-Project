const router = require('express').Router();
const userRoutes = require('./userRoutes');
const designRoutes = require('./designRoutes');
const imageRoutes = require('./imageRoutes');

router.use('/user', userRoutes);
router.use('/design', designRoutes);
router.use('/image', imageRoutes);

module.exports = router;
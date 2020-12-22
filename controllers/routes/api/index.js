const router = require('express').Router();
const userRoutes = require('./userRoutes');
const designRoutes = require('./designRoutes');

router.use('/user', userRoutes);
router.use('/design', designRoutes);

module.exports = router;
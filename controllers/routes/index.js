const router = require('express').Router();
const homeRoutes = require('./routes/homeRoutes');

router.use('/', homeRoutes);

module.exports = router;

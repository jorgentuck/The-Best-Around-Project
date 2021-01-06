const router = require('express').Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../../../utils/auth');
const multer  = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
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
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// const uploadS3 = multer({
//   storage: multerS3({
//     s3: s3,
//     acl: 'public-read',
//     bucket: process.env.S3_BUCKET,
//     metadata: (req, file, cb) => {
//       cb(null, {fieldName: file.fieldname})
//     },
//     key: (req, file, cb) => {
//       cb(null, Date.now().toString() + '-' + file.originalname)
//     }
//   })
// });

// router.post('/upload', uploadS3.single('file'),(req, res) => {
//   console.log(req.file);
//   res.status(200).json({ message: 'file uploaded!'});
// });

router.get('/', async (req, res) => {
  try {
    const imageData = await Images.findAll({
      include: [{ model: Designs }],
    });
    if (imageData.length == 0) {
      res.status(404).json({ message: 'No images found' });
      return;
    }
    res.status(200).json(imageData);
  } catch (err) {
    res.status(500).json(err);
  }
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

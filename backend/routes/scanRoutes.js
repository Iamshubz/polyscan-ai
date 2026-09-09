const express = require('express');
const router = express.Router();
const { analyzeScan, getScans, getScanById, deleteScan } = require('../controllers/scanController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authMiddleware);

router.post('/analyze', upload.single('image'), analyzeScan);
router.get('/', getScans);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);

module.exports = router;

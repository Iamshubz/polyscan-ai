const express = require('express');
const router = express.Router();
const { getPolymers, getPolymerByCode } = require('../controllers/polymerController');

router.get('/', getPolymers);
router.get('/:code', getPolymerByCode);

module.exports = router;

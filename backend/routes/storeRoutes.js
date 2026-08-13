const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { submitRatingRules } = require('../middleware/validators');
const { listStores, getStore, submitRating } = require('../controllers/storeController');

const router = express.Router();

router.use(authenticate, authorize('user', 'admin'));

router.get('/', listStores);
router.get('/:id', getStore);
router.post('/:id/rate', submitRatingRules, submitRating);

module.exports = router;

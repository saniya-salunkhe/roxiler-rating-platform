const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard } = require('../controllers/ownerController');

const router = express.Router();

router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { createUserRules, createStoreRules } = require('../middleware/validators');
const {
  getDashboard,
  listUsers,
  getUserDetail,
  createUser,
  listStores,
  createStore,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.post('/users', createUserRules, createUser);
router.get('/stores', listStores);
router.post('/stores', createStoreRules, createStore);

module.exports = router;

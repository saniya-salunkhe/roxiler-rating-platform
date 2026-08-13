const express = require('express');
const { authenticate } = require('../middleware/auth');
const { signupRules, loginRules, updatePasswordRules } = require('../middleware/validators');
const { signup, login, getProfile, changePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupRules, signup);
router.post('/login', loginRules, login);
router.get('/me', authenticate, getProfile);
router.put('/password', authenticate, updatePasswordRules, changePassword);

module.exports = router;

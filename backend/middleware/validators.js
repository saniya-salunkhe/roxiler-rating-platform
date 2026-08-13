const { body, validationResult } = require('express-validator');

/** Express middleware that collects validator errors and returns them as a 422. */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

/* ------------------------------------------------------------------ */
/* Re-usable field validators                                         */
/* ------------------------------------------------------------------ */

const nameRules = () =>
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

const emailRules = () =>
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();

const addressRules = () =>
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters');

/**
 * Password: 8-16 chars, at least one uppercase letter and one special character.
 * Stored as a bcrypt hash, so the original string length constraint is checked
 * on the plain-text value before hashing.
 */
const passwordRules = () =>
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=/\\\[\]~`';]/)
    .withMessage('Password must include at least one special character');

const ratingRules = () =>
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5');

const roleRules = () =>
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner');

/* ------------------------------------------------------------------ */
/* Composite rule sets                                                */
/* ------------------------------------------------------------------ */

const signupRules = [nameRules(), emailRules(), addressRules(), passwordRules(), handleValidationErrors];
const loginRules = [emailRules(), body('password').notEmpty().withMessage('Password is required'), handleValidationErrors];
const createUserRules = [nameRules(), emailRules(), addressRules(), passwordRules(), roleRules(), handleValidationErrors];
const createStoreRules = [
  nameRules(),
  emailRules(),
  addressRules(),
  body('owner_id').optional({ nullable: true }).isInt().withMessage('owner_id must be an integer'),
  handleValidationErrors,
];
const submitRatingRules = [ratingRules(), handleValidationErrors];
const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=/\\\[\]~`';]/)
    .withMessage('Password must include at least one special character'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  signupRules,
  loginRules,
  createUserRules,
  createStoreRules,
  submitRatingRules,
  updatePasswordRules,
  roleRules,
};

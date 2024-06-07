import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendVerificationKey, resetPassword ,verifyKey } from '../controllers/passwordReset.controller.js';

const router = express.Router();

router.post(
  '/send-verification-key',
  body('email').isEmail().withMessage('Invalid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
 sendVerificationKey
);

router.post(
  '/verify-key',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('verificationKey').isLength({ min: 8, max: 8 }).withMessage('Invalid verification key'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
    console.log("Hello...........................................")
  },
  verifyKey,
);

router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('verificationKey').isLength({ min: 8, max: 8 }).withMessage('Invalid verification key'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least one special character'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  resetPassword
);

export default router;

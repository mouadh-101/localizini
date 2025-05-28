import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import passport from '../config/passportConfig.js'; // Import configured passport
import * as authService from '../services/authService.js'; // For generating token

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// Example for a protected route that might live here or in userRoutes.js
// For now, getProfile is handled separately as per plan.
// router.get('/profile', authMiddleware, authController.getProfile);

// @route   GET /api/auth/profile
// @desc    Get current user's profile
// @access  Private (requires token)
router.get('/profile', authMiddleware, authController.getProfile);

// --- Google OAuth Routes ---

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth authentication
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback URL
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`, // Redirect on failure
    session: false, // We are using JWTs, not sessions
  }),
  (req, res) => {
    // Successful authentication, req.user contains the authenticated user from strategy's done(null, user)
    if (!req.user) {
      // This case should ideally be handled by failureRedirect, but as a fallback:
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=authentication_failed`);
    }
    
    // Generate JWT for this user
    const token = authService.generateToken(req.user);
    
    // Redirect to frontend with the token
    const frontendRedirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
    res.redirect(frontendRedirectUrl);
  }
);

export default router;

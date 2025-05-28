import express from 'express';
import * as placeController from '../controllers/placeController.js';
import * as commentController from '../controllers/commentController.js'; // Import comment controller
import authMiddleware from '../middleware/authMiddleware.js'; // Import auth middleware

const router = express.Router();

// @route   GET /api/places
// @desc    Get all places with optional filters
// @access  Public
router.get('/', placeController.getPlaces);

// @route   GET /api/places/:id
// @desc    Get a single place by ID
// @access  Public
router.get('/:id', placeController.getPlaceById);

// --- Comment Routes Nested Under Places ---

// @route   GET /api/places/:placeId/comments
// @desc    Get all comments for a specific place
// @access  Public
router.get('/:placeId/comments', commentController.getCommentsForPlace);

// @route   POST /api/places/:placeId/comments
// @desc    Create a new comment for a specific place
// @access  Private (requires token)
router.post('/:placeId/comments', authMiddleware, commentController.createNewComment);

export default router;

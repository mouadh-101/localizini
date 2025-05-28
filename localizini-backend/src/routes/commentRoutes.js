import express from 'express';
import * as commentController from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment by its ID
// @access  Private (requires token and ownership)
router.delete('/:commentId', authMiddleware, commentController.deleteExistingComment);

export default router;

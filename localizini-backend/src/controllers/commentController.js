import * as commentService from '../services/commentService.js';
import db from '../models/index.js'; // Import db to access User model for include

export const getCommentsForPlace = async (req, res, next) => {
  try {
    const { placeId } = req.params; 
    
    if (!placeId) {
        return res.status(400).json({ message: 'Place ID is required.' });
    }

    const comments = await commentService.getCommentsByPlaceId(placeId);
    res.status(200).json({ comments }); // API consistency: return { comments: [...] }
  } catch (error) {
    console.error('GetCommentsForPlace error:', error);
    next(error);
  }
};

export const createNewComment = async (req, res, next) => {
  try {
    const { placeId } = req.params; 
    const { text, rating } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!text) { 
      return res.status(400).json({ message: 'Comment text is required.' });
    }
     if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    const createdCommentInstance = await commentService.createComment({
      userId,
      placeId,
      text,
      rating,
    });
    
    // Fetch the comment again to include commenter details
    const newCommentWithDetails = await commentService.findCommentById(createdCommentInstance.id, {
         include: [{ model: db.User, as: 'commenter', attributes: ['id', 'name', 'avatarUrl'] }]
    });

    res.status(201).json({ comment: newCommentWithDetails || createdCommentInstance }); 
  } catch (error) {
    console.error('CreateNewComment error:', error);
    if (error.message === 'User not found' || error.message === 'Place not found') {
        return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteExistingComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const comment = await commentService.findCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.userId !== userId) {
      // Add admin role check here later if needed
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments.' });
    }

    await commentService.deleteCommentById(commentId);
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('DeleteExistingComment error:', error);
    if (error.message === 'Comment not found') { 
        return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

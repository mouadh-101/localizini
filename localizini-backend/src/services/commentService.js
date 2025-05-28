import db from '../models/index.js';
import { Op } from 'sequelize';

const { Comment, User, Place } = db;

export const getCommentsByPlaceId = async (placeId) => {
  return Comment.findAll({
    where: { placeId },
    include: [
      {
        model: User,
        as: 'commenter',
        attributes: ['id', 'name', 'avatarUrl'], // Only include necessary user fields
      },
    ],
    order: [['createdAt', 'DESC']], // Show newest comments first
  });
};

export const createComment = async (commentData) => {
  const { userId, placeId, text, rating } = commentData;

  // Optional: Validate that userId and placeId exist before creating comment
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found'); // Or a custom error object
  }
  const place = await Place.findByPk(placeId);
  if (!place) {
    throw new Error('Place not found');
  }

  return Comment.create({
    userId,
    placeId,
    text,
    rating,
  });
};

export const findCommentById = async (commentId, options = {}) => { // Added options for include
  return Comment.findByPk(commentId, options);
};

export const deleteCommentById = async (commentId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  await comment.destroy();
  return { message: 'Comment deleted successfully.' };
};

import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined for socket authentication.');
}

const setupSocketAuth = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.query?.token; // Get token from query params

    if (!token || typeof token !== 'string') { // Ensure token is a string
      console.log('Socket Auth: No token provided or token is not a string.');
      return next(new Error('Authentication error: No token provided or invalid token format.'));
    }

    if (!JWT_SECRET) { 
        console.log('Socket Auth: JWT_SECRET not configured on server.');
        return next(new Error('Server configuration error.'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (typeof decoded !== 'object' || !decoded.id) { // Check if decoded is an object and has id
        console.log('Socket Auth: Invalid token payload.');
        return next(new Error('Authentication error: Invalid token payload.'));
      }
      
      const user = await User.findByPk(decoded.id);
      if (!user) {
        console.log(`Socket Auth: User ${decoded.id} not found.`);
        return next(new Error('Authentication error: User not found.'));
      }

      socket.user = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }; 
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Socket Auth: Token expired.');
        return next(new Error('Authentication error: Token expired.'));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        console.log('Socket Auth: Invalid token.');
        return next(new Error('Authentication error: Invalid token.'));
      }
      console.error('Socket Auth: Unknown error during token verification.', error);
      return next(new Error('Authentication error: Could not verify token.'));
    }
  });
};

export default setupSocketAuth;

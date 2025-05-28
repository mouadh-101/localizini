import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // To potentially fetch full user object

const { User } = db; // User might not be defined if not yet initialized in index.js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // This check is already in authService, but good for defensive programming
  console.error('FATAL ERROR: JWT_SECRET is not defined in authMiddleware.');
  // process.exit(1); // Or handle more gracefully depending on app stage
}

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const tokenParts = authHeader.split(' '); // Expect "Bearer <token>"

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format. Expected "Bearer <token>".' });
  }

  const token = tokenParts[1];

  if (!JWT_SECRET) {
    // This additional check handles the case where JWT_SECRET was not available at module load time
    // but is still not available when the middleware runs.
    console.error('Critical: JWT_SECRET is missing when trying to verify token.');
    return res.status(500).json({ message: 'Authentication configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach decoded payload (which contains id, email) to request
    req.user = decoded; 

    // Optional: Fetch the full user object from DB if needed for subsequent operations
    // This ensures the user still exists and is not, e.g., banned.
    // This is commented out by default as per the instructions.
    /*
    if (User) { // Check if User model is available
      const userFromDb = await User.findByPk(decoded.id);
      if (!userFromDb) {
        return res.status(401).json({ message: 'User not found.' });
      }
      // Attach plain user object, not Sequelize instance
      req.user = userFromDb.get({ plain: true }); 
    } else {
      // If User model is not available, req.user remains the decoded token payload.
      // This might happen if models/index.js hasn't fully initialized User yet,
      // or if there's a circular dependency issue (less likely with current structure).
      console.warn('User model not available in authMiddleware for DB lookup. Using token payload for req.user.');
    }
    */
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error instanceof jwt.JsonWebTokenError) { // Covers malformed, invalid signature etc.
      return res.status(401).json({ message: 'Invalid token.' });
    }
    // For other errors, pass to global error handler
    console.error("Error in authMiddleware:", error);
    // It's often better to send a generic 500 or a specific error if known,
    // rather than passing a potentially sensitive error object to the global handler.
    // For now, we'll return a generic 401 for unexpected auth errors.
    return res.status(401).json({ message: 'Authentication failed.' });
    // next(error); // Or pass to a more generic global error handler if configured
  }
};

export default authMiddleware;

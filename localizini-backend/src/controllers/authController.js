import * as authService from '../services/authService.js';
import db from '../models/index.js'; // For accessing User model directly if needed for shaping response

const { User } = db;

// Helper function to shape user data for responses (excluding password)
const shapeUserData = (userInstance) => {
  if (!userInstance) return null;
  // Ensure userInstance.get is a function, which it should be for Sequelize instances
  if (typeof userInstance.get !== 'function') {
    console.error("shapeUserData: userInstance.get is not a function. Input was:", userInstance);
    // Fallback or throw error, depending on how strict you want to be.
    // For now, return the object as is, but without password if it exists.
    const { password, ...userData } = userInstance; // Simple destructuring if not a Sequelize instance
    return userData;
  }
  const { password, ...userData } = userInstance.get({ plain: true });
  return userData;
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) { 
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const newUser = await authService.createUser({ name, email, password });
    const token = authService.generateToken(newUser);
    
    res.status(201).json({
      message: 'User created successfully!',
      accessToken: token, // Changed 'token' to 'accessToken' for clarity with frontend
      user: shapeUserData(newUser),
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Check if it's a known error type, e.g., validation from Sequelize
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(422).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    next(error); // Pass to global error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password: plainPassword } = req.body;

    if (!email || !plainPassword) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); 
    }

    if (!user.password) { // Check if user has a password (might be an OAuth user)
        return res.status(401).json({ message: 'Login with your social provider or set a password for email login.' });
    }

    const isMatch = await authService.comparePassword(plainPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); 
    }

    const token = authService.generateToken(user);

    res.status(200).json({
      message: 'Logged in successfully!',
      accessToken: token, // Changed 'token' to 'accessToken'
      user: shapeUserData(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error); 
  }
};

// Controller action for fetching user profile
export const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by the authenticateToken middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }
    
    const userInstance = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'googleId'] } // Explicitly exclude sensitive fields
    });
    if (!userInstance) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    
    // shapeUserData will also exclude password, but this ensures googleId is also out
    res.status(200).json({ user: shapeUserData(userInstance) }); 
  } catch (error) {
    console.error('Get Profile error:', error);
    next(error);
  }
};

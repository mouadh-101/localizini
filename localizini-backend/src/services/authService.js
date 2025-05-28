import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // Sequelize models

const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  // This will log during server startup if the variable is missing
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  // Consider exiting the process if JWT_SECRET is critical for app functionality
  // process.exit(1); 
}

export const hashPassword = async (password) => {
  const saltRounds = 10; // Or a configurable value
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!hashedPassword) { // Handle cases where user might not have a password (e.g. OAuth only)
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (user) => {
  if (!JWT_SECRET) {
    console.error('Error generating token: JWT_SECRET is not defined.');
    throw new Error('Token generation failed due to missing secret.'); 
  }
  const payload = {
    id: user.id,
    email: user.email,
    // name: user.name, // Optionally include other non-sensitive info
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '1h' }); // Default expiresIn if not set
};

export const createUser = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);
  return User.create({
    ...userData,
    password: hashedPassword,
    // Ensure other fields like googleId, avatarUrl, discoveryStreak have defaults or are handled
    googleId: userData.googleId || null,
    avatarUrl: userData.avatarUrl || null,
    discoveryStreak: userData.discoveryStreak || 0,
  });
};

export const findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

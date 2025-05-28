import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: process.cwd() + '/localizini-backend/.env' }); // Adjusted path for .env

const app = express();

// --- Global Middleware ---
// Enable CORS for all routes and origins (adjust for production later)
app.use(cors()); 

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
import passport from './config/passportConfig.js'; // Import configured passport
app.use(passport.initialize());

// --- Basic Routes (for testing setup) ---
app.get('/', (req, res) => {
  res.send('Localizini Backend is running!');
});

// --- API Routes ---
import authRoutes from './routes/authRoutes.js'; 
import placeRoutes from './routes/placeRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js'; // Import comment routes
app.use('/api/auth', authRoutes); 
app.use('/api/places', placeRoutes); // Handles GET /:placeId/comments and POST /:placeId/comments
app.use('/api/comments', commentRoutes); // Handles DELETE /:commentId

// --- Global Error Handler (placeholder, to be implemented later) ---
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

export default app;

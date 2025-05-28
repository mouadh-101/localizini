import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: process.cwd() + '/.env' }); // Ensure .env from root is loaded

const app = express();

// --- Global Middleware ---
// Enable CORS for all routes and origins (adjust for production later)
app.use(cors()); 

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- Basic Routes (for testing setup) ---
app.get('/', (req, res) => {
  res.send('Localizini Backend is running!');
});

// Placeholder for API routes (to be added later)
// import authRoutes from './routes/authRoutes.js';
// app.use('/api/auth', authRoutes);

// --- Global Error Handler (placeholder, to be implemented later) ---
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

export default app;

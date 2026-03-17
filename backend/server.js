import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import { connectDB, sequelize } from './config/db.js';

// Import Routes & Controllers
import userRoute from './routes/user.route.js';
import qrRoute from './routes/qrcode.route.js';
import analyticsRoute from './routes/analytics.route.js';
import { redirectQR } from './controllers/qrcode.controller.js';

// Import Models so Sequelize knows to create the tables
import './models/qrcode.model.js';
import './models/scanEvent.model.js';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// === API Routes ===
app.use('/api/users', userRoute);
app.use('/api/qrcodes', qrRoute); // Used by the React frontend to create QRs
app.use('/api/analytics', analyticsRoute); // Scan analytics pipeline

// === Public Scanning Route ===
// This intercepts the scan and redirects to the targetUrl
app.get('/q/:shortId', redirectQR); 

const PORT = process.env.PORT || 5000;

connectDB();

// Add { alter: true } inside the sync() function
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log(`🚀 NexusQR Server running on port ${PORT}`));
});
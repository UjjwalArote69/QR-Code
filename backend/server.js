import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/db.js';

// Import Routes & Controllers
import userRoute from './routes/user.route.js';
import qrRoute from './routes/qrcode.route.js';
import { redirectQR } from './controllers/qrcode.controller.js';

// Import Model so Sequelize knows to create the table
import './models/qrcode.model.js'; 

dotenv.config();
const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// === API Routes ===
app.use('/api/users', userRoute);
app.use('/api/qrcodes', qrRoute); // Used by the React frontend to create QRs

// === Public Scanning Route ===
// This intercepts the scan and redirects to the targetUrl
app.get('/q/:shortId', redirectQR); 

const PORT = process.env.PORT || 5000;

connectDB();

// Add { alter: true } inside the sync() function
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log(`🚀 NexusQR Server running on port ${PORT}`));
});
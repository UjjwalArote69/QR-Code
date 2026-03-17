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
import logger from './config/logger.js';
import requestLogger from './middleware/requestLogger.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

// Import Routes & Controllers
import userRoute from './routes/user.route.js';
import qrRoute from './routes/qrcode.route.js';
import analyticsRoute from './routes/analytics.route.js';
import templateRoute from './routes/template.route.js';
import { redirectQR } from './controllers/qrcode.controller.js';

// Import Models so Sequelize knows to create the tables
import './models/qrcode.model.js';
import './models/scanEvent.model.js';
import './models/template.model.js';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// HTTP request logging
app.use(requestLogger);

// === API Routes ===
app.use('/api/users', userRoute);
app.use('/api/qrcodes', qrRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/templates', templateRoute);

// === Public Scanning Route ===
app.get('/q/:shortId', redirectQR);

// === Centralized Error Handler (must be after routes) ===
app.use(errorHandler);

// === Uncaught exception & rejection handlers ===
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { message: reason?.message || reason, stack: reason?.stack });
});

const PORT = process.env.PORT || 5000;

connectDB();

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => logger.info(`NexusQR Server running on port ${PORT}`));
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/db.js';
import userRoute from './routes/user.route.js';

dotenv.config();
const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 5000;

connectDB();
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`🚀 NexusQR Server (ESM) running on port ${PORT}`));
});
import express from 'express';
import { 
  createQRCode, 
  getUserQRCodes, 
  updateQRCode, 
  deleteQRCode, 
  createQRWithFile,
  getPublicQR
} from '../controllers/qrcode.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/create', protect, createQRCode);
router.post('/create-with-file', protect, upload.single('file'), createQRWithFile);
router.get('/my-qrs', protect, getUserQRCodes);

router.get('/public/:shortId', getPublicQR);

// NEW: Update and Delete routes
router.put('/:id', protect, updateQRCode);
router.delete('/:id', protect, deleteQRCode);

export default router;
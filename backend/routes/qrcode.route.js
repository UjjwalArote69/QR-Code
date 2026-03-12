import express from 'express';
import { 
  createQRCode, 
  getUserQRCodes, 
  updateQRCode, 
  deleteQRCode 
} from '../controllers/qrcode.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.post('/create', protect, createQRCode);
router.get('/my-qrs', protect, getUserQRCodes);

// NEW: Update and Delete routes
router.put('/:id', protect, updateQRCode);
router.delete('/:id', protect, deleteQRCode);

export default router;
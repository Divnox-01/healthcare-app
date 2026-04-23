import { Router } from 'express';
import multer from 'multer';
import { uploadPrescription } from '../controllers/ocr.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('prescription'), uploadPrescription);

export default router;

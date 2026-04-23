import { Router } from 'express';
import { saveSymptomHistory, getSymptomHistory } from '../controllers/symptom.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateUser, saveSymptomHistory);
router.get('/', authenticateUser, getSymptomHistory);

export default router;

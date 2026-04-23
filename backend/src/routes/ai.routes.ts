import { Router } from 'express';
import { triageSymptom, smartSearch } from '../controllers/ai.controller';

const router = Router();

router.post('/symptom-check', triageSymptom);
router.post('/search', smartSearch);

export default router;

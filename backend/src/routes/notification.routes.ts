import { Router } from 'express';
import { scheduleMedicineReminder } from '../controllers/notification.controller';

const router = Router();

router.post('/reminders', scheduleMedicineReminder);

export default router;

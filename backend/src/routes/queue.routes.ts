import { Router } from 'express';
import { getQueueStatus } from '../controllers/queue.controller';

const router = Router();

router.get('/:appointmentId', getQueueStatus);

export default router;

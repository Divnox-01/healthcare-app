import { Router } from 'express';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '../controllers/doctors.controller';
import { authenticateUser, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getDoctors);

// Admin only routes
router.post('/', authenticateUser, requireRole(['ADMIN']), addDoctor);
router.patch('/:id', authenticateUser, requireRole(['ADMIN']), updateDoctor);
router.delete('/:id', authenticateUser, requireRole(['ADMIN']), deleteDoctor);

export default router;

import { Router } from 'express';
import { getPatientDashboard, getDoctorDashboard, getAdminDashboard } from '../controllers/dashboard.controller';
import { authenticateUser, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/patient', authenticateUser, requireRole(['PATIENT']), getPatientDashboard);
router.get('/doctor', authenticateUser, requireRole(['DOCTOR']), getDoctorDashboard);
router.get('/admin', authenticateUser, requireRole(['ADMIN']), getAdminDashboard);

export default router;

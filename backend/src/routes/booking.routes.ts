import { Router } from 'express';
import { bookAppointment, getPatientBookings, getDoctorBookings, cancelBooking, confirmBooking } from '../controllers/booking.controller';
import { authenticateUser, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', bookAppointment);
router.get('/patient', authenticateUser, requireRole(['PATIENT']), getPatientBookings);
router.get('/doctor', authenticateUser, requireRole(['DOCTOR']), getDoctorBookings);
router.patch('/:id/cancel', authenticateUser, cancelBooking);
router.patch('/:id/confirm', authenticateUser, confirmBooking);

export default router;

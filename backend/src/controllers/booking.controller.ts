import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { io } from '../index';

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId, patientId, date, timeSlot } = req.body;

    // Concurrency control: check if slot is already booked
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        timeSlot,
        status: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      res.status(400).json({ message: "Slot is not available" });
      return;
    }

    // Calculate queue number
    const queueAhead = await prisma.appointment.count({
      where: {
        doctorId,
        date: new Date(date),
        timeSlot: { lt: timeSlot },
        status: { in: ['BOOKED', 'WAITING', 'IN_CONSULTATION'] }
      }
    });

    // Mock Payment Processor
    const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate
    if (!isPaymentSuccessful) {
      res.status(400).json({ message: "Payment failed. Please try again." });
      return;
    }

    const mockPaymentId = 'txn_' + Math.random().toString(36).substr(2, 9);

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: new Date(date),
        timeSlot,
        status: 'BOOKED',
        queueNum: queueAhead + 1,
        paymentStatus: 'SUCCESS',
        paymentId: mockPaymentId
      },
    });

    // Emit real-time queue update and slot booking
    io.emit('slotBooked', { doctorId, date, timeSlot });
    io.emit('queueUpdated', { doctorId, date, queueAhead: queueAhead + 1 });

    // Dummy Notification Trigger (bullMQ representation)
    console.log(`Notification sent to ${patientId}: Appointment Confirmed`);

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await prisma.patientProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Patient profile not found" });
      return;
    }
    const appointments = await prisma.appointment.findMany({
      where: { patientId: profile.id },
      include: { doctor: true },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Doctor profile not found" });
      return;
    }
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: profile.id },
      include: { patient: true },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'COMPLETED' } // or whatever state means confirmed/completed. Let's use COMPLETED or keep BOOKED and add confirm logic
    });
    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

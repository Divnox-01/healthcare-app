import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { io } from '../index';

export const getQueueStatus = async (req: Request, res: Response) => {
  try {
    const appointmentId = Array.isArray(req.params.appointmentId)
      ? req.params.appointmentId[0]
      : req.params.appointmentId;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true }
    });

    if (!appointment) return res.status(404).json({ message: "Not found" });

    // Calculate how many people have queueNum less than this user's queueNum for the same date and doctor.
    const patientsAhead = await prisma.appointment.count({
      where: {
        doctorId: appointment.doctorId,
        date: appointment.date,
        status: { in: ['WAITING', 'IN_CONSULTATION'] },
        queueNum: { lt: appointment.queueNum ?? 999 }
      }
    });

    res.status(200).json({ patientsAhead, queueNum: appointment.queueNum });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

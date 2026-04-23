import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getPatientDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        appointments: {
          include: { doctor: true },
          orderBy: { date: 'desc' },
          take: 5
        },
        records: true,
        medicines: true,
        prescriptions: {
          include: { doctor: true }
        }
      }
    });
    
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        appointments: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          },
          include: { patient: true },
          orderBy: { timeSlot: 'asc' }
        },
        queries: {
          where: { status: 'OPEN' },
          include: { patient: true }
        }
      }
    });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    // Mock Earnings
    const totalAppointments = await prisma.appointment.count({
      where: { doctorId: profile.id, status: 'COMPLETED' }
    });
    const earnings = totalAppointments * profile.fees;

    res.status(200).json({ profile, earnings, todayAppointments: profile.appointments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalPatients = await prisma.patientProfile.count();
    const totalDoctors = await prisma.doctorProfile.count();
    const totalAppointments = await prisma.appointment.count();
    const recentAppointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { patient: true, doctor: true }
    });

    res.status(200).json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      recentAppointments
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

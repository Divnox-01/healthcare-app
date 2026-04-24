import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { search, specialization, location } = req.query;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (specialization) {
      filters.specialization = { contains: specialization as string, mode: 'insensitive' };
    }
    if (location) {
      filters.location = { contains: location as string, mode: 'insensitive' };
    }

    const doctors = await prisma.doctorProfile.findMany({
      where: filters,
      orderBy: { rating: 'desc' }
    });

    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, specialization, experience, fees, location } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: 'default123', // Admin sets default password
        role: 'DOCTOR'
      }
    });

    const doctor = await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        specialization,
        experience: Number(experience) || 0,
        fees: Number(fees) || 0,
        location: location || 'Remote',
      }
    });

    res.status(201).json(doctor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { firstName, lastName, specialization, experience, fees, location } = req.body;

    const doctor = await prisma.doctorProfile.update({
      where: { id },
      data: { firstName, lastName, specialization, experience: Number(experience), fees: Number(fees), location }
    });

    res.status(200).json(doctor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const doctor = await prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }
    await prisma.doctorProfile.delete({ where: { id } });
    await prisma.user.delete({ where: { id: doctor.userId } });
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

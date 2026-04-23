import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123!';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
       res.status(400).json({ message: "User already exists" });
       return;
    }

    // Hash password in production - basic version here for scaffold
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // replace with bcrypt later
        role
      }
    });

    // Create profile
    if (role === 'PATIENT') {
      await prisma.patientProfile.create({
        data: { userId: user.id, firstName, lastName }
      });
    } else if (role === 'DOCTOR') {
      await prisma.doctorProfile.create({
        data: { userId: user.id, firstName, lastName, specialization: 'General', location: 'Remote' }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({ user, token, role: user.role, message: "Registered successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password) {
       res.status(401).json({ message: "Invalid credentials" });
       return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ user, token, role: user.role, message: "Logged in successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
        doctorProfile: true,
        adminProfile: true
      }
    });
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

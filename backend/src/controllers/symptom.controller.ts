import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const saveSymptomHistory = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { symptoms, predictedSpecialization, riskLevel, confidenceScore } = req.body;

    const history = await prisma.symptomHistory.create({
      data: {
        userId,
        symptoms: Array.isArray(symptoms) ? symptoms.join(', ') : String(symptoms),
        predictedSpecialization,
        riskLevel,
        confidenceScore: Number(confidenceScore) || 0
      }
    });

    res.status(201).json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSymptomHistory = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const history = await prisma.symptomHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

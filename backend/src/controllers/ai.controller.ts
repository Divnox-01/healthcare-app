import { Request, Response } from 'express';
import { prisma } from '../utils/db';

const symptomSpecialtyMap: Record<string, string> = {
  'heart pain': 'Cardiologist',
  'chest pain': 'Cardiologist',
  'palpitations': 'Cardiologist',
  'headache': 'Neurologist',
  'migraine': 'Neurologist',
  'dizziness': 'Neurologist',
  'skin rash': 'Dermatologist',
  'acne': 'Dermatologist',
  'itchy skin': 'Dermatologist',
  'bone pain': 'Orthopedic',
  'joint pain': 'Orthopedic',
  'fracture': 'Orthopedic',
  'stomach ache': 'Gastroenterologist',
  'acid reflux': 'Gastroenterologist',
  'fever': 'General Physician',
  'cold': 'General Physician',
  'cough': 'General Physician',
  'toothache': 'Dentist',
  'eye pain': 'Ophthalmologist',
  'blur vision': 'Ophthalmologist'
};

const mapSymptomsToSpecialty = (symptoms: string[]): string => {
  const counts: Record<string, number> = {};
  for (const symptom of symptoms) {
    const s = symptom.toLowerCase();
    for (const key in symptomSpecialtyMap) {
      if (s.includes(key) || key.includes(s)) {
        const spec = symptomSpecialtyMap[key];
        counts[spec] = (counts[spec] || 0) + 1;
      }
    }
  }
  let best = 'General Physician';
  let maxCount = 0;
  for (const spec in counts) {
    if (counts[spec] > maxCount) {
      maxCount = counts[spec];
      best = spec;
    }
  }
  return best;
};

export const triageSymptom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symptoms, severity, durationDays, age } = req.body;
    
    // symptoms: array of strings, severity: 1-5, durationDays: number, age: number
    const suggestedSpecialist = mapSymptomsToSpecialty(symptoms || []);
    
    // Calculate risk score (0 to 100)
    let riskScore = (severity || 1) * 15;
    if (age > 60) riskScore += 10;
    if (age < 5) riskScore += 10;
    if (durationDays > 7) riskScore += 15;
    if (durationDays > 30) riskScore += 10;
    
    if (riskScore > 100) riskScore = 100;
    
    // Health score is inversely proportional to risk score
    const healthScore = Math.max(0, 100 - riskScore);
    
    let riskLevel = 'Low';
    let suggestedAction = 'Routine consultation';
    
    if (riskScore >= 75) {
      riskLevel = 'High';
      suggestedAction = 'Immediate medical attention required (SOS)';
    } else if (riskScore >= 40) {
      riskLevel = 'Moderate';
      suggestedAction = 'Consult a doctor within 24 hours';
    }
    
    // Fetch suggested doctors
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        specialization: { contains: suggestedSpecialist, mode: 'insensitive' }
      },
      orderBy: { rating: 'desc' },
      take: 5
    });

    // Calculate a mock confidence score based on how many symptoms were mapped
    const confidenceScore = Math.min(98, 70 + (symptoms.length * 5));

    res.status(200).json({
      recommendedDoctorType: suggestedSpecialist,
      riskLevel,
      riskScore,
      healthScore,
      suggestedAction,
      confidenceScore,
      doctors
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const smartSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
       res.status(400).json({ message: "Query is required" });
       return;
    }
    
    const suggestedSpecialist = mapSymptomsToSpecialty([query]);
    
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        OR: [
          { specialization: { contains: suggestedSpecialist, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ]
      },
      orderBy: { rating: 'desc' },
      take: 10
    });
    
    res.status(200).json({
      intentDetected: suggestedSpecialist,
      results: doctors
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

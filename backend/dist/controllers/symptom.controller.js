"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymptomHistory = exports.saveSymptomHistory = void 0;
const db_1 = require("../utils/db");
const saveSymptomHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const { symptoms, predictedSpecialization, riskLevel, confidenceScore } = req.body;
        const history = await db_1.prisma.symptomHistory.create({
            data: {
                userId,
                symptoms: Array.isArray(symptoms) ? symptoms.join(', ') : String(symptoms),
                predictedSpecialization,
                riskLevel,
                confidenceScore: Number(confidenceScore) || 0
            }
        });
        res.status(201).json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.saveSymptomHistory = saveSymptomHistory;
const getSymptomHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const history = await db_1.prisma.symptomHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSymptomHistory = getSymptomHistory;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctor = exports.addDoctor = exports.getDoctors = void 0;
const db_1 = require("../utils/db");
const getDoctors = async (req, res) => {
    try {
        const { search, specialization, location } = req.query;
        const filters = {};
        if (search) {
            filters.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (specialization) {
            filters.specialization = { contains: specialization, mode: 'insensitive' };
        }
        if (location) {
            filters.location = { contains: location, mode: 'insensitive' };
        }
        const doctors = await db_1.prisma.doctorProfile.findMany({
            where: filters,
            orderBy: { rating: 'desc' }
        });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDoctors = getDoctors;
const addDoctor = async (req, res) => {
    try {
        const { firstName, lastName, email, specialization, experience, fees, location } = req.body;
        const user = await db_1.prisma.user.create({
            data: {
                email,
                passwordHash: 'default123', // Admin sets default password
                role: 'DOCTOR'
            }
        });
        const doctor = await db_1.prisma.doctorProfile.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addDoctor = addDoctor;
const updateDoctor = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { firstName, lastName, specialization, experience, fees, location } = req.body;
        const doctor = await db_1.prisma.doctorProfile.update({
            where: { id },
            data: { firstName, lastName, specialization, experience: Number(experience), fees: Number(fees), location }
        });
        res.status(200).json(doctor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const doctor = await db_1.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }
        await db_1.prisma.doctorProfile.delete({ where: { id } });
        await db_1.prisma.user.delete({ where: { id: doctor.userId } });
        res.status(200).json({ message: "Doctor deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteDoctor = deleteDoctor;

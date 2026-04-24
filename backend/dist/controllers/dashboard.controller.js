"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = exports.getDoctorDashboard = exports.getPatientDashboard = void 0;
const db_1 = require("../utils/db");
const getPatientDashboard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const profile = await db_1.prisma.patientProfile.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPatientDashboard = getPatientDashboard;
const getDoctorDashboard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const profile = await db_1.prisma.doctorProfile.findUnique({
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
        const totalAppointments = await db_1.prisma.appointment.count({
            where: { doctorId: profile.id, status: 'COMPLETED' }
        });
        const earnings = totalAppointments * profile.fees;
        res.status(200).json({ profile, earnings, todayAppointments: profile.appointments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDoctorDashboard = getDoctorDashboard;
const getAdminDashboard = async (req, res) => {
    try {
        const totalPatients = await db_1.prisma.patientProfile.count();
        const totalDoctors = await db_1.prisma.doctorProfile.count();
        const totalAppointments = await db_1.prisma.appointment.count();
        const recentAppointments = await db_1.prisma.appointment.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAdminDashboard = getAdminDashboard;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmBooking = exports.cancelBooking = exports.getDoctorBookings = exports.getPatientBookings = exports.bookAppointment = void 0;
const db_1 = require("../utils/db");
const index_1 = require("../index");
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, patientId, date, timeSlot } = req.body;
        // Concurrency control: check if slot is already booked
        const existing = await db_1.prisma.appointment.findFirst({
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
        const queueAhead = await db_1.prisma.appointment.count({
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
        const appointment = await db_1.prisma.appointment.create({
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
        index_1.io.emit('slotBooked', { doctorId, date, timeSlot });
        index_1.io.emit('queueUpdated', { doctorId, date, queueAhead: queueAhead + 1 });
        // Dummy Notification Trigger (bullMQ representation)
        console.log(`Notification sent to ${patientId}: Appointment Confirmed`);
        res.status(201).json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.bookAppointment = bookAppointment;
const getPatientBookings = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const profile = await db_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!profile) {
            res.status(404).json({ message: "Patient profile not found" });
            return;
        }
        const appointments = await db_1.prisma.appointment.findMany({
            where: { patientId: profile.id },
            include: { doctor: true },
            orderBy: { date: 'desc' }
        });
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPatientBookings = getPatientBookings;
const getDoctorBookings = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const profile = await db_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!profile) {
            res.status(404).json({ message: "Doctor profile not found" });
            return;
        }
        const appointments = await db_1.prisma.appointment.findMany({
            where: { doctorId: profile.id },
            include: { patient: true },
            orderBy: { date: 'desc' }
        });
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDoctorBookings = getDoctorBookings;
const cancelBooking = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const appointment = await db_1.prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
        res.status(200).json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.cancelBooking = cancelBooking;
const confirmBooking = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const appointment = await db_1.prisma.appointment.update({
            where: { id },
            data: { status: 'COMPLETED' } // or whatever state means confirmed/completed. Let's use COMPLETED or keep BOOKED and add confirm logic
        });
        res.status(200).json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.confirmBooking = confirmBooking;

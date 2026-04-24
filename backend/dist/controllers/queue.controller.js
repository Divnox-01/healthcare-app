"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueStatus = void 0;
const db_1 = require("../utils/db");
const getQueueStatus = async (req, res) => {
    try {
        const appointmentId = Array.isArray(req.params.appointmentId)
            ? req.params.appointmentId[0]
            : req.params.appointmentId;
        const appointment = await db_1.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { doctor: true }
        });
        if (!appointment)
            return res.status(404).json({ message: "Not found" });
        // Calculate how many people have queueNum less than this user's queueNum for the same date and doctor.
        const patientsAhead = await db_1.prisma.appointment.count({
            where: {
                doctorId: appointment.doctorId,
                date: appointment.date,
                status: { in: ['WAITING', 'IN_CONSULTATION'] },
                queueNum: { lt: appointment.queueNum ?? 999 }
            }
        });
        res.status(200).json({ patientsAhead, queueNum: appointment.queueNum });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getQueueStatus = getQueueStatus;

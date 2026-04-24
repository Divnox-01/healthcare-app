"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123!';
const register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;
        // Check if user exists
        const existing = await db_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Hash password in production - basic version here for scaffold
        const user = await db_1.prisma.user.create({
            data: {
                email,
                passwordHash: password, // replace with bcrypt later
                role
            }
        });
        // Create profile
        if (role === 'PATIENT') {
            await db_1.prisma.patientProfile.create({
                data: { userId: user.id, firstName, lastName }
            });
        }
        else if (role === 'DOCTOR') {
            await db_1.prisma.doctorProfile.create({
                data: { userId: user.id, firstName, lastName, specialization: 'General', location: 'Remote' }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(201).json({ user, token, role: user.role, message: "Registered successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user || user.passwordHash !== password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ user, token, role: user.role, message: "Logged in successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                patientProfile: true,
                doctorProfile: true,
                adminProfile: true
            }
        });
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMe = getMe;

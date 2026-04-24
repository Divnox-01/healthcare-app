"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctors_controller_1 = require("../controllers/doctors.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', doctors_controller_1.getDoctors);
// Admin only routes
router.post('/', auth_middleware_1.authenticateUser, (0, auth_middleware_1.requireRole)(['ADMIN']), doctors_controller_1.addDoctor);
router.patch('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.requireRole)(['ADMIN']), doctors_controller_1.updateDoctor);
router.delete('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.requireRole)(['ADMIN']), doctors_controller_1.deleteDoctor);
exports.default = router;

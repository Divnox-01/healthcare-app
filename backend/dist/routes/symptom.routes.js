"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const symptom_controller_1 = require("../controllers/symptom.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticateUser, symptom_controller_1.saveSymptomHistory);
router.get('/', auth_middleware_1.authenticateUser, symptom_controller_1.getSymptomHistory);
exports.default = router;

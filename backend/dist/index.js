"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const doctors_routes_1 = __importDefault(require("./routes/doctors.routes"));
const symptom_routes_1 = __importDefault(require("./routes/symptom.routes"));
const queue_routes_1 = __importDefault(require("./routes/queue.routes"));
const ocr_routes_1 = __importDefault(require("./routes/ocr.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
app.use('/api/doctors', doctors_routes_1.default);
app.use('/api/symptom-history', symptom_routes_1.default);
app.use('/api/queue', queue_routes_1.default);
app.use('/api/ocr', ocr_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/dashboards', dashboard_routes_1.default);
// Real-time socket setup
exports.io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

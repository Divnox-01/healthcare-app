"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMedicineReminder = void 0;
const OneSignal = __importStar(require("onesignal-node"));
// Initialize OneSignal Client
const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID || "MOCK_APP_ID", process.env.ONESIGNAL_REST_API_KEY || "MOCK_REST_KEY");
const scheduleMedicineReminder = async (req, res) => {
    try {
        const { patientId, medicineName, dosage, time } = req.body;
        // We can use OneSignal's send_after property to schedule the push, 
        // or send it immediately if testing. For robust tracking, an external cron is used, 
        // but OneSignal handles delayed delivery natively easily.
        // Convert time to a future UTC timestamp for send_after, or just test immediately.
        // Let's send an immediate notification for testing the integration.
        const notification = {
            contents: {
                'en': `Time to take your medicine: ${medicineName} (${dosage})`,
                'hi': `अपनी दवा लेने का समय आ गया है: ${medicineName}`,
                'ta': `உங்கள் மருந்து எடுக்க வேண்டிய நேரம்: ${medicineName}`,
                'bn': `আপনার ওষুধ নেওয়ার সময় হয়েছে: ${medicineName}`
            },
            included_segments: ['Subscribed Users'], // Or target specific patientId via external_id
            // send_after: '2026-04-14 18:00:00 GMT+0530' // Example of delayed sending
        };
        const response = await client.createNotification(notification);
        res.status(200).json({
            message: 'Reminder notification successfully pushed to OneSignal',
            oneSignalResponse: response
        });
    }
    catch (error) {
        console.error('OneSignal Error:', error);
        res.status(500).json({ error: error.message || 'Notification failed' });
    }
};
exports.scheduleMedicineReminder = scheduleMedicineReminder;

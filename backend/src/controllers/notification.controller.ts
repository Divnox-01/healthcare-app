import { Request, Response } from 'express';
import * as OneSignal from 'onesignal-node';

// Initialize OneSignal Client
const client = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID || "MOCK_APP_ID",
  process.env.ONESIGNAL_REST_API_KEY || "MOCK_REST_KEY"
);

export const scheduleMedicineReminder = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('OneSignal Error:', error);
    res.status(500).json({ error: error.message || 'Notification failed' });
  }
};

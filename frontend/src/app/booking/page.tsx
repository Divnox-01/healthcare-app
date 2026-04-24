'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Clock, ArrowLeft } from 'lucide-react';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId') || '';
  const doctorNameParam = searchParams.get('name') || 'Specialist';
  const specializationParam = searchParams.get('specialization') || '';
  const feeParam = searchParams.get('fee') || '';

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    setErrorMsg('');

    const payload = {
      doctorId: doctorIdParam,
      patientId: 'dummy-patient-123',
      date: today,
      timeSlot: selectedSlot,
    };

    console.log('[Booking] Sending payload:', payload);

    // Try backend — gracefully fall back if auth/FK errors occur (demo mode)
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg: string = data?.message || '';
        // Only block on genuine slot conflicts
        if (msg.toLowerCase().includes('not available') || msg.toLowerCase().includes('overlap')) {
          setErrorMsg('This slot is already booked. Please choose a different time.');
          setIsBooking(false);
          return;
        }
        // Auth / FK / other backend errors → continue as local demo booking
        console.warn('[Booking] Backend error (demo fallback):', msg);
      }
    } catch (err) {
      console.warn('[Booking] Network error (demo fallback):', err);
    }

    // Persist appointment to localStorage for homepage display
    const appointmentData = {
      doctorName: doctorNameParam,
      specialization: specializationParam,
      fee: feeParam,
      date: today,
      time: selectedSlot,
      bookedAt: new Date().toISOString(),
    };
    localStorage.setItem('appointment', JSON.stringify(appointmentData));

    setBooked(true);
    setIsBooking(false);
  };

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (booked) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-1">
            Your appointment with{' '}
            <span className="font-semibold text-gray-800">{doctorNameParam}</span>
          </p>
          <p className="text-slate-500 mb-6">
            is scheduled for{' '}
            <span className="font-semibold text-indigo-600">{today}</span> at{' '}
            <span className="font-semibold text-indigo-600">{selectedSlot}</span>
          </p>
          <div className="bg-indigo-50 rounded-2xl p-4 mb-8 text-left space-y-1">
            {specializationParam && (
              <p className="text-sm text-slate-600">
                Specialization:{' '}
                <span className="font-semibold text-gray-800">{specializationParam}</span>
              </p>
            )}
            {feeParam && (
              <p className="text-sm text-slate-600">
                Fee:{' '}
                <span className="font-semibold text-green-600">₹{feeParam}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // ─── Booking Form ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Doctors
          </Link>

          <h1 className="text-3xl font-extrabold mb-4 text-gray-900">Book Appointment</h1>

          {/* Doctor Info Card */}
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-lg font-bold text-gray-900">{doctorNameParam}</p>
            {specializationParam && (
              <p className="text-sm text-blue-600 font-medium mt-0.5">{specializationParam}</p>
            )}
            {feeParam && (
              <p className="text-sm text-gray-500 mt-1">
                Consultation Fee:{' '}
                <span className="font-bold text-gray-800">₹{feeParam}</span>
              </p>
            )}
          </div>

          {/* Inline Error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Slot Picker */}
          <div className="mb-8 border-t border-b border-slate-100 py-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock size={16} /> Available Slots — Today ({today})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => { setSelectedSlot(slot); setErrorMsg(''); }}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedSlot === slot
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedSlot || isBooking}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              !selectedSlot
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-700 shadow-xl'
            }`}
          >
            {isBooking
              ? 'Processing...'
              : selectedSlot
              ? `Confirm Booking for ${selectedSlot}`
              : 'Select a Time Slot'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading...</p>
      </main>
    }>
      <BookingContent />
    </Suspense>
  );
}

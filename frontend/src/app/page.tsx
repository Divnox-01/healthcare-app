'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/components/DoctorCard';
import { CalendarCheck, Clock, X } from 'lucide-react';

interface AppointmentData {
  doctorName: string;
  specialization: string;
  fee: string;
  date: string;
  time: string;
}

export default function Home() {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('appointment');
      if (stored) setAppointment(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const dismissAppointment = () => {
    localStorage.removeItem('appointment');
    setAppointment(null);
  };

  const doctors = [
    {
      id: 'doc_1',
      name: 'Dr. Rahul Sharma',
      specialization: 'Cardiologist',
      experience: '15 years',
      rating: '4.9',
      responseTime: 'Responds in 10 mins',
      fee: 500,
    },
    {
      id: 'doc_2',
      name: 'Dr. Priya Mehta',
      specialization: 'Neurologist',
      experience: '10 years',
      rating: '4.7',
      responseTime: 'Responds in 15 mins',
      fee: 700,
    },
    {
      id: 'doc_3',
      name: 'Dr. Amit Verma',
      specialization: 'Orthopedic',
      experience: '12 years',
      rating: '4.8',
      responseTime: 'Responds in 8 mins',
      fee: 600,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-10">

      {/* ── Appointment Banner ─────────────────────────────── */}
      {appointment && (
        <div className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl relative">
          <button
            onClick={dismissAppointment}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss appointment"
          >
            <X size={20} />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <CalendarCheck size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">
                Your Upcoming Appointment
              </p>
              <h2 className="text-xl font-bold text-white">{appointment.doctorName}</h2>
              {appointment.specialization && (
                <p className="text-indigo-200 text-sm">{appointment.specialization}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                  <CalendarCheck size={14} />
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                  <Clock size={14} />
                  {appointment.time}
                </span>
                {appointment.fee && (
                  <span className="bg-white/10 px-3 py-1 rounded-full">
                    ₹{appointment.fee}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Doctor Listing ─────────────────────────────────── */}
      <h1 className="text-4xl font-bold text-center mb-10">
        Top Doctors Near You
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} {...doc} />
        ))}
      </div>

    </main>
  );
}

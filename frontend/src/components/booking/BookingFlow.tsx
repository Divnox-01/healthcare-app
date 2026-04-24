'use client';
import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle, X } from 'lucide-react';

interface BookingFlowProps {
  doctor: any;
  onClose: () => void;
}

export default function BookingFlow({ doctor, onClose }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  const [bookingStatus, setBookingStatus] = useState<'BOOKED' | 'CONFIRMED' | 'CANCELLED'>('BOOKED');

  const handleBookingAction = async (action: 'confirm' | 'cancel') => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${successData.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.ok) {
        setBookingStatus(action === 'confirm' ? 'CONFIRMED' : 'CANCELLED');
      } else {
        const data = await res.json();
        setError(data.message || `Failed to ${action} booking`);
      }
    } catch (err) {
      setError('An error occurred while updating the booking status.');
    }
  };

  const handlePayment = async () => {
    if (!date || !time) return setError('Please select date and time');
    
    setLoading(true);
    setError('');
    
    try {
      // We assume user is logged in and token is in cookies. PatientId would be inferred by backend ideally, or sent if we have it in Context.
      // For this demo, let's just assume we need to send patientId='mock-patient-id' if backend strictly needs it, 
      // but in reality our backend should infer from JWT.
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          patientId: 'dummy-patient-id', // Assuming backend uses this or infers from token
          date,
          timeSlot: time
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessData(data);
        setStep(3);
      } else {
        setError(data.message || 'Payment or Booking Failed');
      }
    } catch (err) {
      setError('An error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <p className="text-blue-100 mt-1">with Dr. {doctor.name}</p>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={18} className="text-blue-500" /> Select Date
                </label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={18} className="text-blue-500" /> Select Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`p-2 text-sm font-medium rounded-xl border transition-all ${time === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!date || !time}
                className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-bold text-gray-900">₹{doctor.fee}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="font-bold text-gray-900">₹49</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total to Pay</span>
                  <span className="font-bold text-blue-600 text-xl">₹{doctor.fee + 49}</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-500 flex flex-col items-center">
                <CreditCard size={32} className="mb-2 text-gray-400" />
                <p>Mock Payment Gateway</p>
                <p className="text-sm">Clicking pay will simulate a transaction.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 flex-1">Back</button>
                <button onClick={handlePayment} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex-[2] flex justify-center items-center">
                  {loading ? 'Processing...' : `Pay ₹${doctor.fee + 49}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 animate-in zoom-in">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your appointment is scheduled for<br/><strong className="text-gray-900">{date} at {time}</strong></p>
              
              <div className="bg-gray-50 p-4 rounded-xl text-left mb-8">
                <p className="text-sm text-gray-500 mb-1">Queue Number:</p>
                <p className="text-2xl font-black text-blue-600">#{successData?.queueNum}</p>
                <p className="text-xs text-gray-400 mt-2">Payment ID: {successData?.paymentId}</p>
                {bookingStatus !== 'BOOKED' && (
                  <p className={`text-sm font-bold mt-2 ${bookingStatus === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {bookingStatus}
                  </p>
                )}
              </div>

              {bookingStatus === 'BOOKED' ? (
                <div className="flex gap-3">
                  <button onClick={() => handleBookingAction('cancel')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all border border-red-200">
                    Cancel Appointment
                  </button>
                  <button onClick={() => handleBookingAction('confirm')} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
                    Confirm Appointment
                  </button>
                </div>
              ) : (
                <button onClick={onClose} className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all mt-4">
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface DoctorCardProps {
  id?: string;
  name: string;
  specialization: string;
  experience: string;
  rating: string;
  fee: number;
  imageUrl?: string;
  responseTime?: string;
}

export default function DoctorCard({
  id = '1',
  name,
  specialization,
  experience,
  rating,
  fee,
  imageUrl,
  responseTime = "Usually responds in 15 mins"
}: DoctorCardProps) {
  const router = useRouter();

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Hover glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-800 shrink-0 shadow-inner">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-100">{name}</h3>
            <span className="bg-blue-500/20 text-blue-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1 font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified
            </span>
          </div>
          <p className="text-purple-300 font-medium text-sm mt-1">{specialization}</p>
          <div className="flex items-center gap-3 mt-3 text-gray-400 text-sm">
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="font-medium text-gray-200">{rating}</span>
            </span>
            <span>•</span>
            <span>{experience} exp.</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-end justify-between relative z-10">
        <div>
          <p className="text-xs text-gray-400 mb-1">{responseTime}</p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-400">Fee:</span>
            <p className="text-xl font-bold text-white">₹{fee.toLocaleString()}</p>
          </div>
        </div>
        <button 
          onClick={() => router.push(
            `/booking?doctorId=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&specialization=${encodeURIComponent(specialization)}&fee=${fee}`
          )}
          className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 transform group-hover:scale-[1.03] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] block text-center w-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

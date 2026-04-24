'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, MapPin, Award, MessageSquare } from 'lucide-react';

export default function DoctorProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // In a real app, you would fetch doctor details using this ID:
  // const res = await fetch(`http://localhost:5000/api/doctors/${id}`);
  // const doctor = await res.json();
  
  // Mock Data for now
  const doctor = {
    id: id,
    firstName: "Rahul",
    lastName: "Sharma",
    specialization: "Cardiologist",
    experience: 15,
    rating: 4.9,
    fees: 500,
    location: "Mumbai Medical Center",
    about: "Dr. Rahul Sharma is a highly experienced Cardiologist with over 15 years of experience in treating various heart conditions. He is known for his patient-centric approach and advanced diagnostic skills."
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Doctors
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative"></div>
          
          <div className="px-8 pb-8 relative">
            {/* Profile Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-white p-2 absolute -top-16 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-700 text-4xl font-black">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </div>
            </div>
            
            <div className="mt-20 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</h1>
                <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.specialization}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg font-bold">
                    <Star size={16} className="mr-1 fill-current" /> {doctor.rating} Rating
                  </span>
                  <span className="flex items-center">
                    <Award size={16} className="mr-1.5 text-gray-400" /> {doctor.experience} Years Exp.
                  </span>
                  <span className="flex items-center">
                    <MapPin size={16} className="mr-1.5 text-gray-400" /> {doctor.location}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-center min-w-[150px]">
                <p className="text-gray-500 text-sm mb-1">Consultation Fee</p>
                <p className="text-2xl font-black text-gray-900">₹{doctor.fees}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About Doctor</h2>
              <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>
            
            {/* Action Buttons Placeholders */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push(`/booking?doctorId=${id}&name=${encodeURIComponent(`${doctor.firstName} ${doctor.lastName}`)}`)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <Clock size={20} />
                Book Appointment
              </button>
              <button className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all border border-indigo-100 flex items-center justify-center gap-2 hover:-translate-y-1">
                <MessageSquare size={20} />
                Chat Consult
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

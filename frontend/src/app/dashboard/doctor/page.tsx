'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboards/doctor', {
          credentials: 'include'
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) router.push('/login');
          throw new Error('Failed to fetch');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Doctor Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Error loading dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {data.profile.lastName}</h1>
        <p className="text-gray-500 mt-1">Here is your schedule for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Calendar size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Appts</p>
            <p className="text-2xl font-bold text-gray-900">{data.todayAppointments?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Est. Earnings</p>
            <p className="text-2xl font-bold text-gray-900">₹{data.earnings || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><MessageCircle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Open Queries</p>
            <p className="text-2xl font-bold text-gray-900">{data.profile.queries?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
            {data.todayAppointments?.length > 0 ? (
              <div className="space-y-4">
                {data.todayAppointments.map((apt: any) => (
                  <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {apt.patient.firstName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{apt.patient.firstName} {apt.patient.lastName}</p>
                        <p className="text-sm text-gray-500">Queue: #{apt.queueNum}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="bg-gray-50 px-4 py-2 rounded-lg font-mono font-bold text-gray-700">
                        {apt.timeSlot}
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex-1 sm:flex-none">
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p>No appointments scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Queries */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Queries</h2>
            {data.profile.queries?.length > 0 ? (
              <div className="space-y-4">
                {data.profile.queries.map((q: any) => (
                  <div key={q.id} className="p-4 border border-gray-100 rounded-xl">
                    <p className="text-sm font-semibold text-gray-900">{q.patient.firstName}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{q.query}</p>
                    <button className="mt-3 text-sm font-bold text-blue-600 hover:underline">Reply</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">You're all caught up!</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { Users, Activity, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboards/admin', {
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

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Admin Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Error loading dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users size={32} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalPatients}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl text-green-600"><Activity size={32} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalDoctors}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><FileText size={32} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Appointments</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalAppointments}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Doctor</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentAppointments?.map((apt: any) => (
                <tr key={apt.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-900 font-medium">{apt.patient.firstName} {apt.patient.lastName}</td>
                  <td className="py-4 text-gray-600">Dr. {apt.doctor.lastName}</td>
                  <td className="py-4 text-gray-600">{new Date(apt.date).toLocaleDateString()} {apt.timeSlot}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

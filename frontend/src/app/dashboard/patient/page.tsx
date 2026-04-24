'use client';
import React, { useEffect, useState } from 'react';
import { Activity, Calendar, Pill, FileText, HeartPulse } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const [data, setData] = useState<any>(null);
  const [healthInsights, setHealthInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboards/patient', {
          credentials: 'include'
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login');
          }
          throw new Error('Failed to fetch');
        }
        const json = await res.json();
        setData(json);

        const insightsRes = await fetch('http://localhost:5000/api/symptom-history', {
          credentials: 'include'
        });
        if (insightsRes.ok) {
          const insightsJson = await insightsRes.json();
          setHealthInsights(insightsJson);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Patient Dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Error loading dashboard</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Health Score */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {data.firstName}</h1>
          <p className="text-gray-500 mt-1">Here is your digital health overview.</p>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-4 rounded-xl border border-green-100">
          <HeartPulse size={40} className="text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-800">Health Score</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-green-600">{data.healthScore || 85}</span>
              <span className="text-sm text-green-600 font-medium mb-1">/ 100</span>
            </div>
            {/* Progress bar */}
            <div className="w-32 h-2 bg-green-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.healthScore || 85}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Appointments */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-500" /> Recent Appointments
            </h2>
            {data.appointments?.length > 0 ? (
              <div className="space-y-4">
                {data.appointments.map((apt: any) => (
                  <div key={apt.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-bold text-gray-900">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No recent appointments.</p>
            )}
          </div>
        </div>

        {/* Right Column: Medicines & Records */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="text-purple-500" /> Reminders
            </h2>
            {data.medicines?.length > 0 ? (
              <div className="space-y-3">
                {data.medicines.map((med: any) => (
                  <div key={med.id} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div>
                      <p className="font-bold text-purple-900">{med.medicineName}</p>
                      <p className="text-xs text-purple-600">{med.dosage}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-purple-700">{med.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No active reminders.</p>
            )}
            <button className="mt-4 w-full text-sm font-bold text-purple-600 border border-purple-200 rounded-lg py-2 hover:bg-purple-50 transition-colors">
              + Add Reminder
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="text-orange-500" /> Prescriptions
            </h2>
            {data.prescriptions?.length > 0 ? (
              <div className="space-y-3">
                {data.prescriptions.map((px: any) => (
                  <div key={px.id} className="p-3 border border-gray-100 rounded-lg hover:border-orange-200 transition-colors cursor-pointer">
                    <p className="font-semibold text-gray-900">Dr. {px.doctor.lastName}</p>
                    <p className="text-xs text-gray-500">{new Date(px.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No prescriptions found.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="text-blue-500" /> Your Health Insights
            </h2>
            {healthInsights.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {healthInsights.map((insight: any) => (
                  <div key={insight.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-gray-500">{new Date(insight.createdAt).toLocaleDateString()}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        insight.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        insight.riskLevel === 'Moderate' || insight.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {insight.riskLevel === 'High' ? '🔴' : insight.riskLevel === 'Moderate' || insight.riskLevel === 'Medium' ? '🟡' : '🟢'} 
                        {insight.riskLevel === 'Moderate' ? 'Medium' : insight.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1"><span className="text-gray-500 font-normal">Symptoms:</span> {insight.symptoms}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-bold text-blue-600">Spec: {insight.predictedSpecialization}</p>
                      <p className="text-xs font-bold text-gray-400">Confidence: {insight.confidenceScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No health insights recorded yet. Use our AI Symptom Checker!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

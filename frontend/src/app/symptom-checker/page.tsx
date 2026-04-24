'use client';
import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, UserCircle2 } from 'lucide-react';
import DoctorCard from '../../components/DoctorCard';
import Link from 'next/link';

export default function SymptomChecker() {
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('3');
  const [duration, setDuration] = useState('1');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const symptomArray = symptoms.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('http://localhost:5000/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(age),
          symptoms: symptomArray,
          severity: Number(severity),
          durationDays: Number(duration)
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to analyze symptoms');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <Activity size={48} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900">AI Symptom Checker</h1>
          <p className="mt-2 text-lg text-gray-600">Enter your symptoms and let our smart triage system guide you to the right care.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Patient Age</label>
                <input 
                  type="number" 
                  required 
                  min="0" 
                  max="120"
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="e.g. 34" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Symptoms (comma separated)</label>
                <textarea 
                  required 
                  value={symptoms} 
                  onChange={e => setSymptoms(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]" 
                  placeholder="e.g. headache, fever, chest pain" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Severity (1-5)</label>
                  <input 
                    type="range" 
                    min="1" max="5" 
                    value={severity} 
                    onChange={e => setSeverity(e.target.value)} 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2" 
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Days)</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="e.g. 3" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-lg"
              >
                {loading ? 'Analyzing...' : 'Check Symptoms'} <ArrowRight size={20} />
              </button>

            </form>
          </div>

          {/* Results */}
          <div>
            {!result && !loading && (
              <div className="h-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-blue-400 min-h-[400px]">
                <Activity size={64} className="mb-4 opacity-50" />
                <p className="font-medium">Awaiting your symptoms...</p>
              </div>
            )}

            {loading && (
              <div className="h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-medium text-gray-500 animate-pulse">Running AI Triage Models...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className={`p-6 rounded-3xl border-2 ${
                  result.riskLevel === 'High' ? 'bg-red-50 border-red-200' :
                  result.riskLevel === 'Moderate' ? 'bg-orange-50 border-orange-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-4">
                    {result.riskLevel === 'High' ? <AlertTriangle size={32} className="text-red-500 shrink-0" /> : <Activity size={32} className="text-green-500 shrink-0" />}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Based on your symptoms, you should consult a <span className="text-blue-600 font-black">{result.recommendedDoctorType}</span>.
                      </h2>
                      <div className="mt-4 mb-2">
                        <span className={`px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 ${
                          result.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          result.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Risk Level: {result.riskLevel === 'Moderate' ? 'Medium' : result.riskLevel}
                          {result.riskLevel === 'High' ? '🔴' : result.riskLevel === 'Moderate' ? '🟡' : '🟢'}
                        </span>
                        {result.confidenceScore && (
                          <span className="px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 bg-blue-100 text-blue-800 ml-2">
                            Confidence: {result.confidenceScore}%
                          </span>
                        )}
                      </div>
                      <p className={`font-medium mt-2 ${
                        result.riskLevel === 'High' ? 'text-red-700' :
                        result.riskLevel === 'Moderate' ? 'text-orange-700' :
                        'text-green-700'
                      }`}>{result.suggestedAction}</p>
                    </div>
                  </div>
                </div>

                {result.doctors && result.doctors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <UserCircle2 className="text-blue-500" /> Recommended Specialists
                    </h3>
                    {result.doctors.map((doc: any) => (
                      <div key={doc.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Dr. {doc.firstName} {doc.lastName}</h4>
                          <p className="text-sm text-gray-500">{doc.specialization} • {doc.experience} Yrs Exp.</p>
                        </div>
                        <Link href={`/search`} className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

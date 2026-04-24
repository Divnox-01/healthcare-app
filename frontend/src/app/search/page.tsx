'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  location: string;
  rating: number;
}

export default function SearchPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/doctors?search=${searchQuery}`);
      setDoctors(res.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors(query);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-indigo-600 dark:text-indigo-400">CareConnect</Link>
          <Link href="/symptom-checker" className="text-sm font-semibold text-indigo-600 hover:underline">Symptom Checker (AI)</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">Find a Specialist</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Book appointments with top-rated professionals.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Symptoms, Specialty, or Name" 
              className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 w-full md:w-80 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <Button variant="default" type="submit" className="rounded-full px-8 py-3 h-auto drop-shadow-md bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
          </div>
        </form>

        <h2 className="text-xl font-bold mb-6">Top Rated Near You</h2>
        
        {loading ? (
           <p className="text-slate-500">Loading specialists...</p>
        ) : doctors.length === 0 ? (
           <p className="text-slate-500">No doctors found matching "{query}". Check spelling or try different filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4 shrink-0 overflow-hidden">
                     <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-slate-700 dark:to-slate-800"></div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                    ★ {doc.rating}
                  </div>
                </div>
                <h3 className="text-lg font-bold">Dr. {doc.firstName} {doc.lastName}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-1">{doc.specialization}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {doc.location}
                </p>
                
                <div className="mt-auto">
                  <Link href={`/booking?doctorId=${doc.id}&name=${doc.firstName}`} className="block w-full text-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors">
                    Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

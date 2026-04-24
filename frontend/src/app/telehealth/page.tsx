'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function TelehealthPage() {
  const [inCall, setInCall] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (inCall && videoRef.current) {
      // Mocking WebRTC behavior by requesting local media stream
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
             videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("WebRTC Error:", err));
    }
  }, [inCall]);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white font-medium flex items-center gap-2">
        &larr; Exit
      </Link>
      
      {!inCall ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center max-w-lg shadow-2xl">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Telehealth Consultation</h1>
          <p className="text-slate-400 mb-8">Ready to join your scheduled virtual appointment with Dr. Rahul Sharma?</p>
          <button 
            onClick={() => setInCall(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Join Call
          </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl h-[80vh] bg-black rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex">
          {/* Main Video (Doctor Mock) */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <span className="text-slate-500 text-xl font-medium animate-pulse">Waiting for Doctor to join...</span>
            </div>
            
            {/* Top Bar overlay */}
            <div className="absolute top-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
               <span className="text-white font-semibold flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 Recording • 00:00
               </span>
               <span className="bg-slate-800/80 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md">End-to-End Encrypted</span>
            </div>

            {/* Local Video overlay (User PIP) */}
            <div className="absolute bottom-6 right-6 w-48 h-64 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg z-10">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover transform -scale-x-100"
              />
            </div>
            
            {/* Controls Bar */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
              <button className="w-14 h-14 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button className="w-14 h-14 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
              <button onClick={() => setInCall(false)} className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 transition-all ml-4">
                <svg className="w-8 h-8 transform rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 11l7-7 7 7M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

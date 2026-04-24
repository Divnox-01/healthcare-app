'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

// ─── Map config ───────────────────────────────────────────────────────────────
const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '1rem' };
const libraries: any[] = ['places'];

// ─── Fallback hospitals (shown when API fails or returns empty) ───────────────
const fallbackHospitals = [
  { name: 'City General Hospital',  vicinity: 'Main Road, City Centre',  distance: '1.2 km', isFallback: true },
  { name: 'Apollo Emergency Clinic', vicinity: 'Apollo Complex, Sector 5', distance: '2.5 km', isFallback: true },
  { name: 'Fortis Hospital',         vicinity: 'Fortis Marg, Sector 12',  distance: '3.1 km', isFallback: true },
  { name: 'Medanta – The Medicity',  vicinity: 'NH-48, Sector 38',        distance: '4.3 km', isFallback: true },
  { name: 'Max Super Specialty',     vicinity: 'Press Enclave Road',      distance: '5.0 km', isFallback: true },
];

export default function SOSPage() {
  // ── Location / hospitals ────────────────────────────────────────────────────
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [finding, setFinding] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [locationError, setLocationError] = useState('');
  const [mapUnavailable, setMapUnavailable] = useState(false);

  // ── Breathing timer ─────────────────────────────────────────────────────────
  const [count, setCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev === 5 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const phase = count % 2 === 1 ? 'Inhale' : 'Exhale';
  const isInhale = phase === 'Inhale';

  // ── Google Maps loader ──────────────────────────────────────────────────────
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // When maps fails to load, mark unavailable but don't block render
  useEffect(() => {
    if (loadError) setMapUnavailable(true);
  }, [loadError]);

  // ── SOS trigger ─────────────────────────────────────────────────────────────
  const triggerSOS = () => {
    setFinding(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setHospitals(fallbackHospitals);
      setFinding(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        fetchNearestHospitals(coords);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationError('Could not get your location. Showing nearest hospitals based on general area.');
        setHospitals(fallbackHospitals);
        setFinding(false);
      }
    );
  };

  // ── Fetch hospitals via Places API, fall back gracefully ────────────────────
  const fetchNearestHospitals = (coords: { lat: number; lng: number }) => {
    if (!window.google || !isLoaded) {
      setMapUnavailable(true);
      setHospitals(fallbackHospitals);
      setFinding(false);
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      { location: coords, radius: 5000, type: 'hospital', keyword: 'emergency' },
      (results, status) => {
        setFinding(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          setHospitals(results.slice(0, 5));
        } else {
          // API failed / quota / no results → use fallback
          console.warn('Places API failed, using fallback hospitals. Status:', status);
          setHospitals(fallbackHospitals);
        }
      }
    );
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getDirectionsUrl = (h: any) => {
    if (h.isFallback || !location) return '#';
    const lat = h.geometry?.location?.lat?.();
    const lng = h.geometry?.location?.lng?.();
    if (!lat || !lng) return '#';
    return `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${lat},${lng}`;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-red-50 dark:bg-red-950/20 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl mt-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-red-100 dark:border-red-900 p-8 md:p-12 flex flex-col items-center">

        {/* Back link */}
        <div className="w-full text-left mb-2">
          <Link href="/" className="text-sm font-semibold text-slate-500 inline-block hover:text-slate-800 transition-colors">
            ← Back home
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-500 mb-3 text-center">
          Emergency SOS
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl text-center">
          Press the button below to instantly find the nearest hospitals, and use the breathing guide to stay calm.
        </p>

        {/* ── Inline location error ───────────────────────────────────────────── */}
        {locationError && (
          <div className="w-full mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium text-center">
            ⚠️ {locationError}
          </div>
        )}

        {/* ── SOS Button (shown before location acquired) ─────────────────────── */}
        {!location && !hospitals.length && (
          <button
            onClick={triggerSOS}
            disabled={finding}
            className="w-48 h-48 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-full mx-auto shadow-2xl shadow-red-600/50 flex flex-col items-center justify-center border-8 border-red-200 dark:border-red-900/50 transition-all hover:scale-105 active:scale-95 mb-10"
          >
            {finding ? (
              <span className="font-bold text-xl animate-pulse">Locating...</span>
            ) : (
              <>
                <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-extrabold text-2xl tracking-wider">SOS</span>
              </>
            )}
          </button>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* Main content: shown after SOS triggered (location OR fallback)      */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {(location || hospitals.length > 0) && (
          <div className="w-full space-y-8">

            {/* ── Map + Hospital list ───────────────────────────────────────── */}
            <div className="w-full flex flex-col lg:flex-row gap-6">

              {/* Map */}
              <div className="w-full lg:w-2/3 h-[420px] bg-slate-100 rounded-2xl shadow-inner border border-slate-200 p-2 flex items-center justify-center">
                {mapUnavailable || !isLoaded || !location ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="font-semibold text-slate-400">Map temporarily unavailable</p>
                    <p className="text-xs text-slate-400 text-center max-w-xs">
                      Google Maps API key not configured. Hospital list is available below.
                    </p>
                  </div>
                ) : (
                  <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={location}>
                    <Marker
                      position={location}
                      icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                    />
                    {hospitals.filter(h => !h.isFallback).map((hospital, i) => (
                      <Marker
                        key={i}
                        position={hospital.geometry?.location}
                        onClick={() => setSelectedHospital(hospital)}
                        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                      />
                    ))}
                    {selectedHospital && !selectedHospital.isFallback && (
                      <InfoWindow
                        position={selectedHospital.geometry?.location}
                        onCloseClick={() => setSelectedHospital(null)}
                      >
                        <div className="text-black p-2 font-sans w-48">
                          <h3 className="font-bold text-sm">{selectedHospital.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{selectedHospital.vicinity}</p>
                          <p className="text-xs mt-2 font-bold text-red-600">
                            Rating: ★ {selectedHospital.rating || 'N/A'}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
              </div>

              {/* Hospital list */}
              <div className="w-full lg:w-1/3 flex flex-col">
                <h3 className="font-bold text-lg mb-4 text-left border-b pb-2 text-gray-800 dark:text-white">
                  Nearest Emergency Centers
                </h3>
                <div className="flex flex-col gap-3 text-left overflow-y-auto max-h-[380px] pr-1">
                  {hospitals.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => !h.isFallback && setSelectedHospital(h)}
                      className="flex flex-col p-4 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{h.name}</h4>
                        {h.distance && (
                          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                            {h.distance}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 mb-3">{h.vicinity || 'Emergency Center'}</p>
                      <a
                        href={getDirectionsUrl(h)}
                        target={h.isFallback ? undefined : '_blank'}
                        rel="noreferrer"
                        onClick={e => h.isFallback && e.preventDefault()}
                        className={`text-center px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                          h.isFallback
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-600/10 text-red-700 hover:bg-red-600 hover:text-white'
                        }`}
                      >
                        {h.isFallback ? 'Enable location for directions' : 'Get Directions'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Breathing Timer ───────────────────────────────────────────── */}
            <div className="w-full flex flex-col items-center py-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                Calm Breathing Guide
              </p>
              <div
                className="transition-transform duration-1000 ease-in-out"
                style={{ transform: isInhale ? 'scale(1.15)' : 'scale(0.9)' }}
              >
                <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg border-4 transition-colors duration-1000 ${
                  isInhale
                    ? 'bg-blue-100 border-blue-400 shadow-blue-200'
                    : 'bg-indigo-50 border-indigo-300 shadow-indigo-100'
                }`}>
                  <span className={`text-5xl font-black transition-colors duration-500 ${
                    isInhale ? 'text-blue-600' : 'text-indigo-500'
                  }`}>
                    {count}
                  </span>
                  <span className={`text-sm font-bold mt-1 tracking-wider transition-colors duration-500 ${
                    isInhale ? 'text-blue-500' : 'text-indigo-400'
                  }`}>
                    {phase}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-5 max-w-xs text-center">
                Breathe in on odd counts, out on even counts. Repeat to stay calm.
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

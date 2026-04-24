'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, Activity, AlertCircle } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Activity size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">HealthCare<span className="text-blue-600">+</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/sos" className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold transition-colors">
              <AlertCircle size={18} />
              {t('emergency')}
            </Link>
            
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
            >
              {i18n.language.toUpperCase()}
            </button>

            <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md shadow-blue-200">
              <User size={18} />
              {t('login')}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link href="/sos" className="block px-3 py-2 text-base font-bold text-red-500 hover:bg-red-50 rounded-md">
            {t('emergency')}
          </Link>
          <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
            {t('login')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

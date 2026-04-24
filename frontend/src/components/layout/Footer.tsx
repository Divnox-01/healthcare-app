import React from 'react';
import Link from 'next/link';
import { Activity, Globe, Mail, MessageCircle, Video, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Activity size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">HealthCare<span className="text-blue-600">+</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Reimagining healthcare with intelligent, accessible, and empathetic digital solutions for everyone.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><Video size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/doctors" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Find a Doctor</Link></li>
              <li><Link href="/triage" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Symptom Checker</Link></li>
              <li><Link href="/hospitals" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Hospitals Near Me</Link></li>
              <li><Link href="/sos" className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors">SOS Emergency</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">About Us</Link>
                <div className="mt-1 space-y-0.5 pl-1">
                  <p className="text-xs text-gray-400">Founder: <span className="font-medium text-gray-500">Divyanshi</span></p>
                  <p className="text-xs text-gray-400">Co-Founder: <span className="font-medium text-gray-500">Vartika</span></p>
                </div>
              </li>
              <li>
                <Link href="/careers" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Careers</Link>
                <p className="text-xs text-gray-400 mt-1 pl-1">Full Stack Engineer</p>
              </li>
              <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/press" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HealthCare+. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-current" /> for better health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

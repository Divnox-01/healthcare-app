'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Activity, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX feedback
    await new Promise(r => setTimeout(r, 400));

    try {
      if (!isLogin) {
        // ── REGISTER ──────────────────────────────────────────────────────
        if (!firstName.trim() || !lastName.trim()) {
          setError('Please enter your first and last name.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }

        // Check if email already registered
        const existingRaw = localStorage.getItem('users');
        const users: any[] = existingRaw ? JSON.parse(existingRaw) : [];
        if (users.find((u: any) => u.email === email)) {
          setError('An account with this email already exists. Please sign in.');
          return;
        }

        // Save new user
        const newUser = { firstName, lastName, email, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Show success and switch to login tab
        setError('');
        setIsLogin(true);
        setPassword('');
        setFirstName('');
        setLastName('');
        // Briefly show success (reuse error slot with green style via state trick)
        setError('✅ Registration successful! Please sign in.');
      } else {
        // ── LOGIN ─────────────────────────────────────────────────────────
        const existingRaw = localStorage.getItem('users');
        const users: any[] = existingRaw ? JSON.parse(existingRaw) : [];
        const matched = users.find(
          (u: any) => u.email === email && u.password === password
        );

        if (!matched) {
          setError('Invalid email or password. Please try again.');
          return;
        }

        // Store session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          firstName: matched.firstName,
          lastName: matched.lastName,
          email: matched.email,
          role: matched.role,
        }));

        // Redirect based on role
        if (matched.role === 'DOCTOR') router.push('/dashboard/doctor');
        else if (matched.role === 'ADMIN') router.push('/dashboard/admin');
        else router.push('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-blue-600 text-white relative">
          <div className="absolute inset-0 bg-blue-600 opacity-50 pattern-grid-lg"></div>
          <Activity size={48} className="mx-auto mb-4 relative z-10" />
          <h2 className="text-3xl font-bold relative z-10">{isLogin ? 'Welcome Back' : 'Join HealthCare+'}</h2>
          <p className="text-blue-100 mt-2 relative z-10">{isLogin ? 'Sign in to your account' : 'Create an account to continue'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
              error.startsWith('✅')
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <AlertCircle size={20} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="John" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="px-8 pb-8 text-center bg-white pt-2">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-2 text-blue-600 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

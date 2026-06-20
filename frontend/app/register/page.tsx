"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      Cookies.set('token', res.data.token);
      
      // Save account for Switcher UI
      const current = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
      const filtered = current.filter((a: any) => a.email !== res.data.user.email);
      const updated = [{email: res.data.user.email, name: res.data.user.name}, ...filtered];
      localStorage.setItem('savedAccounts', JSON.stringify(updated));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Create Account</h2>
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input type="text" required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-slate-600 text-sm">
          Already have an account? <Link href="/login" className="text-brand-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

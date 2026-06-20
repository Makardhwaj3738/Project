"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { UserCircle, ChevronLeft, Plus } from 'lucide-react';

interface SavedAccount {
  email: string;
  name: string;
}

export default function Login() {
  const router = useRouter();
  
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [showFullForm, setShowFullForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    setSavedAccounts(accounts);
    setIsLoaded(true);
  }, []);

  const saveAccountToLocal = (user: {email: string, name: string}) => {
    const current = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    const filtered = current.filter((a: any) => a.email !== user.email);
    const updated = [{email: user.email, name: user.name}, ...filtered];
    localStorage.setItem('savedAccounts', JSON.stringify(updated));
    setSavedAccounts(updated);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Use the selected account's email if we are in password-only mode
    const loginEmail = selectedAccount ? selectedAccount.email : email;

    try {
      const res = await api.post('/auth/login', { email: loginEmail, password });
      Cookies.set('token', res.data.token);
      
      // Save account for future switcher use
      saveAccountToLocal(res.data.user);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        
        {/* State 1: Show saved accounts list */}
        {savedAccounts.length > 0 && !selectedAccount && !showFullForm && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">Choose an account</h2>
            <div className="space-y-3">
              {savedAccounts.map((acc, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedAccount(acc)}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <UserCircle className="w-10 h-10 text-brand-500" />
                  <div>
                    <div className="font-bold text-slate-800">{acc.name}</div>
                    <div className="text-sm text-slate-500">{acc.email}</div>
                  </div>
                </button>
              ))}
              <button 
                onClick={() => setShowFullForm(true)}
                className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-600"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-medium">Add another account</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Password-only form for a selected account */}
        {selectedAccount && (
          <div>
            <button 
              onClick={() => { setSelectedAccount(null); setPassword(''); setError(''); }}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to accounts
            </button>
            <div className="text-center mb-8">
              <UserCircle className="w-16 h-16 text-brand-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-slate-500">{selectedAccount.email}</p>
            </div>
            
            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input 
                  type="password" 
                  required 
                  autoFocus
                  className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                Log in
              </button>
            </form>
          </div>
        )}

        {/* State 3: Full login form */}
        {((savedAccounts.length === 0) || showFullForm) && !selectedAccount && (
          <div>
            {savedAccounts.length > 0 && (
              <button 
                onClick={() => { setShowFullForm(false); setEmail(''); setPassword(''); setError(''); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Welcome Back</h2>
            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input type="email" required autoFocus className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" required className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-slate-600 text-sm">
              Don't have an account? <Link href="/register" className="text-brand-600 hover:underline">Register</Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

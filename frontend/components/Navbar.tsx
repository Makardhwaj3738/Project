"use client";
import Link from 'next/link';
import { Compass, User, LogOut, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleSwitchAccount = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (Cookies.get('token')) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-white/50 backdrop-blur-md border-b border-slate-200">
      <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
        <Compass className="w-8 h-8 text-brand-600" />
        <span className="text-xl font-bold text-slate-800">Trao Planner</span>
      </a>
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-brand-600 transition-colors font-medium">
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            <button onClick={handleSwitchAccount} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-brand-600 transition-colors font-medium">
              <Users className="w-4 h-4" />
              Switch Account
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 text-slate-600 hover:text-brand-600 transition-colors font-medium">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Plus, MapPin, Calendar, Trash2, Edit2, Check, X } from 'lucide-react';

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameVal, setEditNameVal] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchUser();
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent link navigation
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip');
    }
  };

  const handleEditNameSave = async () => {
    try {
      const res = await api.put('/auth/me', { name: editNameVal });
      setUser(res.data);
      setIsEditingName(false);
    } catch (error) {
      alert("Failed to update name");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 border-b pb-6">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-800">Welcome back,</h1>
              <input 
                type="text" 
                value={editNameVal} 
                onChange={(e) => setEditNameVal(e.target.value)} 
                className="text-3xl font-extrabold text-brand-600 border-b-2 border-brand-300 focus:border-brand-600 outline-none bg-transparent w-auto"
                autoFocus
              />
              <button onClick={handleEditNameSave} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg ml-2"><Check className="w-5 h-5" /></button>
              <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
              <h1 className="text-3xl font-extrabold text-slate-800">! 👋</h1>
            </div>
          ) : (
            <h1 className="text-3xl font-extrabold text-slate-800 group flex items-center gap-2 w-fit">
              Welcome back{user ? `, ${user.name}` : ''}! 👋
              {user && (
                <button 
                  onClick={() => { setEditNameVal(user.name); setIsEditingName(true); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600 p-1"
                  title="Edit Name"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </h1>
          )}
          <p className="text-slate-500 mt-2">Here is a summary of your planned adventures.</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Your Trips</h2>
          <Link href="/plan" className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">You haven't planned any trips yet.</p>
            <Link href="/plan" className="text-brand-600 font-semibold hover:underline">
              Create your first itinerary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <Link href={`/trip/${trip._id}`} key={trip._id} className="block group">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-brand-500 w-5 h-5 shrink-0 mt-0.5" />
                      <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{trip.destination}</h2>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteTrip(e, trip._id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.days} Days Itinerary</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">
                      {trip.budgetType} Budget
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

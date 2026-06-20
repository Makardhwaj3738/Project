"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

export default function PlanTrip() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budgetType, setBudgetType] = useState('Medium');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/trips', { destination, days, budgetType, interests });
      router.push(`/trip/${res.data._id}`);
    } catch (error) {
      console.error('Error generating trip:', error);
      alert('Failed to generate trip');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Plan Your Next Adventure</h1>
          <p className="text-slate-500 mb-8">Tell us about your trip, and our AI will generate a personalized itinerary.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input type="text" required placeholder="e.g., Tokyo, Japan" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Days</label>
                <input type="number" min="1" max="30" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={days} onChange={e => setDays(parseInt(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget Type</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={budgetType} onChange={e => setBudgetType(e.target.value)}>
                  <option value="Low">Budget / Backpacker</option>
                  <option value="Medium">Medium / Standard</option>
                  <option value="High">High / Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Interests (Press Enter to add)</label>
              <input type="text" placeholder="e.g., Food, Museums, Hiking" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={handleAddInterest} />
              
              <div className="flex flex-wrap gap-2 mt-3">
                {interests.map((interest, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                    {interest}
                    <button type="button" onClick={() => removeInterest(idx)} className="text-brand-500 hover:text-brand-900">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-bold text-lg mt-8 flex justify-center items-center gap-2">
              {loading ? (
                <><Loader2 className="animate-spin w-5 h-5" /> Generating Itinerary...</>
              ) : (
                'Generate Itinerary'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

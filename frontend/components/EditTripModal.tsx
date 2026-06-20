import { X, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budgetType: string, interests: string[]) => void;
  loading: boolean;
  error: string | null;
  currentBudget: string;
  currentInterests: string[];
}

export default function EditTripModal({ isOpen, onClose, onSubmit, loading, error, currentBudget, currentInterests }: EditTripModalProps) {
  const [budgetType, setBudgetType] = useState(currentBudget || 'Medium');
  const [interestsText, setInterestsText] = useState((currentInterests || []).join(', '));

  useEffect(() => {
    if (isOpen) {
      setBudgetType(currentBudget || 'Medium');
      setInterestsText((currentInterests || []).join(', '));
    }
  }, [isOpen, currentBudget, currentInterests]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const interestsArray = interestsText.split(',').map(i => i.trim()).filter(i => i !== '');
    onSubmit(budgetType, interestsArray);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500" />
            Edit Trip Settings
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-600">
            Adjusting these parameters will automatically regenerate your itinerary, hotel recommendations, and estimated budget to match your new constraints.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Budget Level</label>
            <select 
              value={budgetType}
              onChange={e => setBudgetType(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="Low">Budget / Cheap (Backpacker)</option>
              <option value="Medium">Moderate (Standard)</option>
              <option value="High">Luxury (Premium)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Interests (comma separated)</label>
            <textarea
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none transition-all"
              rows={3}
              placeholder="E.g., Museums, Hiking, Fine Dining..."
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
            {loading ? 'Recalculating Trip...' : 'Save & Regenerate'}
          </button>
        </div>
      </div>
    </div>
  );
}

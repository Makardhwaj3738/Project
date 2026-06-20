import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  loading: boolean;
  error: string | null;
  dayIndex: number | null;
}

export default function RegenerateModal({ isOpen, onClose, onSubmit, loading, error, dayIndex }: RegenerateModalProps) {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Regenerate Day {dayIndex}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Not happy with this day's itinerary? Tell the AI exactly what you'd prefer instead, and it will rebuild the day for you.
          </p>
          
          <textarea
            className="w-full border border-slate-300 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-all shadow-sm"
            rows={4}
            placeholder="E.g., Make it more relaxing, focus on museums, add a beach trip..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            autoFocus
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
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
            onClick={() => onSubmit(prompt)}
            disabled={!prompt.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Regenerating...' : 'Regenerate Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { usePDF } from 'react-to-pdf';
import { MapPin, Calendar, DollarSign, Hotel, Package, RefreshCw, Download, Edit2, Check, X, Settings, Sparkles } from 'lucide-react';
import RegenerateModal from '@/components/RegenerateModal';
import EditTripModal from '@/components/EditTripModal';

export default function TripDetail() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDayIndex, setModalDayIndex] = useState<number | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Edit State
  const [editingActivity, setEditingActivity] = useState<{day: number, idx: number} | null>(null);
  const [editVal, setEditVal] = useState("");

  // Global Trip Edit State
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [isRegeneratingTrip, setIsRegeneratingTrip] = useState(false);
  const [editTripError, setEditTripError] = useState<string | null>(null);

  const { toPDF, targetRef } = usePDF({filename: 'AI-Travel-Itinerary.pdf'});

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trips/${params.id}`);
        setTrip(res.data);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchTrip();
  }, [params.id]);

  const openRegenerateModal = (dayIndex: number) => {
    setModalDayIndex(dayIndex);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleRegenerateSubmit = async (prompt: string) => {
    if (modalDayIndex === null) return;
    setRegeneratingDay(modalDayIndex);
    setModalError(null);
    
    try {
      const res = await api.post(`/trips/${params.id}/regenerate-day`, { dayIndex: modalDayIndex, userPrompt: prompt });
      setTrip(res.data);
      setIsModalOpen(false);
      alert('The day has been updated');
    } catch (error) {
      setModalError("Failed to regenerate day. Please try again.");
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleEditTripSubmit = async (budgetType: string, interests: string[]) => {
    setIsRegeneratingTrip(true);
    setEditTripError(null);
    try {
      const res = await api.post(`/trips/${params.id}/regenerate-trip`, { budgetType, interests });
      setTrip(res.data);
      setIsEditTripModalOpen(false);
    } catch (error) {
      setEditTripError("Failed to regenerate trip. Please try again.");
    } finally {
      setIsRegeneratingTrip(false);
    }
  };

  const startEdit = (day: number, idx: number, currentDesc: string) => {
    setEditingActivity({day, idx});
    setEditVal(currentDesc);
  };

  const cancelEdit = () => {
    setEditingActivity(null);
    setEditVal("");
  };

  const saveEdit = async (dayIndex: number, actIndex: number) => {
    try {
      // Create a deep copy of the trip to mutate
      const updatedTrip = JSON.parse(JSON.stringify(trip));
      const dayData = updatedTrip.itinerary.find((d: any) => d.day === dayIndex);
      if (dayData) {
        dayData.activities[actIndex].description = editVal;
        
        // Save to backend
        const res = await api.put(`/trips/${params.id}`, updatedTrip);
        setTrip(res.data);
      }
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      cancelEdit();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center">Trip not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-end gap-3">
        <button 
          onClick={() => setIsEditTripModalOpen(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm font-semibold"
        >
          <Settings className="w-5 h-5" /> Edit Settings
        </button>
        <button 
          onClick={() => toPDF()} 
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-sm font-semibold"
        >
          <Download className="w-5 h-5" /> Download as PDF
        </button>
      </div>

      <div ref={targetRef} className="bg-slate-50 pb-10">
        <div className="bg-brand-900 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-brand-400" /> {trip.destination}
            </h1>
          <div className="flex gap-6 text-brand-100">
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {trip.days} Days</span>
            <span className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> {trip.budgetType} Budget</span>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {trip.interests.map((int: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-brand-800 text-sm rounded-full">{int}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Itinerary</h2>
            <div className="space-y-6">
              {trip.itinerary.map((day: any) => (
                <div key={day.day} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-brand-700">Day {day.day}</h3>
                    <button 
                      onClick={() => openRegenerateModal(day.day)}
                      disabled={regeneratingDay === day.day}
                      className="text-sm flex items-center gap-1 text-slate-500 hover:text-brand-600"
                    >
                      <RefreshCw className={`w-4 h-4 ${regeneratingDay === day.day ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  </div>
                  {day.updateMessage && (
                    <div className="mb-4 p-3 bg-brand-50 border border-brand-200 text-brand-800 rounded-lg text-sm flex items-start gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{day.updateMessage}</p>
                    </div>
                  )}
                  <ul className="space-y-4 relative border-l-2 border-slate-100 ml-3 pl-4 mb-4">
                    {day.activities.map((act: any, i: number) => {
                      const isEditing = editingActivity?.day === day.day && editingActivity?.idx === i;
                      return (
                      <li key={i} className="relative group">
                        <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[23px] top-1.5 border-4 border-white"></div>
                        <span className="font-semibold text-slate-700 mr-2 w-20 inline-block align-top">{act.time}</span>
                        
                        {isEditing ? (
                          <div className="inline-flex items-center gap-2 w-[calc(100%-6rem)]">
                            <input 
                              type="text" 
                              value={editVal} 
                              onChange={(e) => setEditVal(e.target.value)}
                              className="flex-1 p-1 px-2 border border-brand-300 rounded outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                              autoFocus
                            />
                            <button onClick={() => saveEdit(day.day, i)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-4 h-4" /></button>
                            <button onClick={cancelEdit} className="text-red-500 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <span className="text-slate-600 inline-block align-top max-w-[calc(100%-8rem)]">
                            {act.description}
                            <button 
                              onClick={() => startEdit(day.day, i, act.description)}
                              className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-brand-600 transition-opacity"
                            >
                              <Edit2 className="w-3 h-3 inline" />
                            </button>
                          </span>
                        )}
                      </li>
                      );
                    })}
                  </ul>

                  {(day.placesSuggestions || day.foodSuggestions || day.menuSuggestions) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {day.placesSuggestions && day.placesSuggestions.length > 0 && (
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                          <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-1">📍 Places</h4>
                          <ul className="text-xs text-blue-700/80 space-y-1 list-disc pl-4">
                            {day.placesSuggestions.map((place: string, idx: number) => <li key={idx}>{place}</li>)}
                          </ul>
                        </div>
                      )}
                      {day.foodSuggestions && day.foodSuggestions.length > 0 && (
                        <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                          <h4 className="font-semibold text-orange-800 text-sm mb-2 flex items-center gap-1">🍽️ Food</h4>
                          <ul className="text-xs text-orange-700/80 space-y-1 list-disc pl-4">
                            {day.foodSuggestions.map((food: string, idx: number) => <li key={idx}>{food}</li>)}
                          </ul>
                        </div>
                      )}
                      {day.menuSuggestions && day.menuSuggestions.length > 0 && (
                        <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                          <h4 className="font-semibold text-green-800 text-sm mb-2 flex items-center gap-1">🧾 Menu</h4>
                          <ul className="text-xs text-green-700/80 space-y-1 list-disc pl-4">
                            {day.menuSuggestions.map((menu: string, idx: number) => <li key={idx}>{menu}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Estimated Budget
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Flights</span><span>${trip.estimatedBudget.flights}</span></div>
              <div className="flex justify-between"><span>Accommodation</span><span>${trip.estimatedBudget.accommodation}</span></div>
              <div className="flex justify-between"><span>Food</span><span>${trip.estimatedBudget.food}</span></div>
              <div className="flex justify-between"><span>Activities</span><span>${trip.estimatedBudget.activities}</span></div>
              <div className="pt-3 border-t font-bold text-slate-800 flex justify-between text-base">
                <span>Total</span><span>${trip.estimatedBudget.total}</span>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-blue-500" /> Hotel Suggestions
            </h2>
            <div className="space-y-4">
              {trip.hotels.map((hotel: any, i: number) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-800">{hotel.name}</h4>
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>{hotel.rating}</span>
                    <span>{hotel.estimatedPrice}</span>
                  </div>
                  <p className="text-xs text-slate-600">{hotel.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-brand-50 p-6 rounded-2xl shadow-sm border border-brand-100">
            <h2 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-600" /> AI Packing List
            </h2>
            <div className="space-y-4 text-sm">
              {trip.packingList.map((category: any, i: number) => (
                <div key={i}>
                  <h4 className="font-semibold text-brand-800 mb-1">{category.category}</h4>
                  <ul className="list-disc pl-5 text-brand-700/80">
                    {category.items.map((item: string, j: number) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      </div>

      <RegenerateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegenerateSubmit}
        loading={regeneratingDay !== null}
        error={modalError}
        dayIndex={modalDayIndex}
      />

      <EditTripModal
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        onSubmit={handleEditTripSubmit}
        loading={isRegeneratingTrip}
        error={editTripError}
        currentBudget={trip?.budgetType}
        currentInterests={trip?.interests}
      />
    </div>
  );
}

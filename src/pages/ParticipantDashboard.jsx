import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { api } from '../utils/api';
import {
  Ticket,
  Calendar,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Tag,
  Search,
  Filter,
  DollarSign,
  Award
} from 'lucide-react';

export const ParticipantDashboard = ({
  onSelectEvent,
  onRegisterToggle,
  onShowQR,
  onShowCertificate
}) => {
  const { currentUser } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all-participant-events'); // 'all-participant-events' | 'my-events'
  const [feeFilter, setFeeFilter] = useState('all'); // 'all' | 'free' | 'paid'

  useEffect(() => {
    loadEvents();
  }, [currentUser]);

  const loadEvents = async () => {
    setLoading(true);
    const events = await api.getEvents();
    setAllEvents(events || []);
    setLoading(false);
  };

  // Events open for participation
  const participantEnabledEvents = (allEvents || []).filter(e => e && e.allowParticipant !== false);

  // User's registered participant events
  const registeredParticipantEvents = (allEvents || []).filter(e => 
    e && e.registeredParticipants?.includes(currentUser?.id)
  );

  // Calculate total fees paid by user for participation
  const totalFeesPaid = registeredParticipantEvents.reduce((acc, e) => {
    return acc + Number(e.participantFee !== undefined ? e.participantFee : (e.registrationFee || 0));
  }, 0);

  // Filter events based on active tab and fee filter
  const displayedEvents = (activeTab === 'my-events' ? registeredParticipantEvents : participantEnabledEvents)
    .filter(e => {
      const fee = Number(e.participantFee !== undefined ? e.participantFee : (e.registrationFee || 0));
      if (feeFilter === 'free') return fee === 0;
      if (feeFilter === 'paid') return fee > 0;
      return true;
    });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Participant Portal Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-800 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide">
                <Ticket className="w-3.5 h-3.5 text-amber-300" />
                Participant Portal
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome, {currentUser?.name || 'Participant'}!
              </h1>
              <p className="text-xs text-slate-200 font-medium">
                Explore social drives, register as a participant, get entry passes, and attend events.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="p-3 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">{registeredParticipantEvents.length} Drives</div>
              <div className="text-xs font-semibold text-slate-200">Registered Participations</div>
            </div>
          </div>

        </div>
      </div>

      {/* Participant Impact & Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Ticket className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {registeredParticipantEvents.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">My Participation Drives</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalFeesPaid > 0 ? `₹${totalFeesPaid}` : 'Free Entry'}
            </div>
            <div className="text-xs font-semibold text-slate-500">Total Registration Fees Paid</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {participantEnabledEvents.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Available Open Drives</div>
          </div>
        </div>
      </div>

      {/* Tabs & Fee Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Main View Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('my-events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-events'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            My Registered Drives ({registeredParticipantEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('all-participant-events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all-participant-events'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Explore Participation Drives ({participantEnabledEvents.length})
          </button>
        </div>

        {/* Fee Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Fee Filter:</span>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setFeeFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                feeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFeeFilter('free')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                feeFilter === 'free'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setFeeFilter('paid')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                feeFilter === 'paid'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

      </div>

      {/* Events List Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          {activeTab === 'my-events' ? 'My Registered Participation Drives' : 'All Drives Accepting Participants'}
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map(evt => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                onRegisterToggle={onRegisterToggle}
                onShowQR={onShowQR}
                onShowCertificate={onShowCertificate}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">
              {activeTab === 'my-events' 
                ? 'You have not registered as a participant for any drives yet.'
                : 'No participation drives match your current fee filter.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

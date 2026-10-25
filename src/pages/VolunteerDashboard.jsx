import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { api } from '../utils/api';
import { INITIAL_BADGES } from '../../server/data/seedData.js';
import {
  Award,
  Clock,
  TreePine,
  Droplets,
  CheckCircle2,
  Sparkles,
  Calendar,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';

export const VolunteerDashboard = ({
  onSelectEvent,
  onRegisterToggle,
  onShowQR,
  onShowCertificate
}) => {
  const { currentUser } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    const events = await api.getEvents();
    setAllEvents(events || []);

    const recs = await api.getAIRecommendations(currentUser?.interests || ['Tree Plantation', 'Cleanliness Drives']);
    setAiRecommendations(recs || []);
    setLoading(false);
  };

  const registeredEvents = (allEvents || []).filter(e => e && e.registeredVolunteers?.includes(currentUser?.id));
  const attendedEvents = (allEvents || []).filter(e => e && e.attendedVolunteers?.includes(currentUser?.id));

  // User Badges unlocked
  const unlockedBadges = INITIAL_BADGES.filter(b => currentUser?.badges?.includes(b.id));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Volunteer Profile & Level Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Community Impact Volunteer
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome Back, {currentUser?.name}!
              </h1>
              <p className="text-xs text-slate-200 font-medium">
                {currentUser?.organization || 'Greenfield Volunteer Club'} • Level 3 Contributor
              </p>
            </div>
          </div>

          {/* Quick Hours Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="p-3 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">{currentUser?.hours || 32} Hrs</div>
              <div className="text-xs font-semibold text-slate-200">Total Volunteer Hours</div>
            </div>
          </div>

        </div>
      </div>

      {/* Impact Statistics Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Real-World Social Impact Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <TreePine className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentUser?.treesPlanted || 14}
              </div>
              <div className="text-xs font-semibold text-slate-500">Trees Planted</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentUser?.bloodDonatedUnits || 2} Units
              </div>
              <div className="text-xs font-semibold text-slate-500">Blood Donated</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentUser?.cleanupsAttended || 4}
              </div>
              <div className="text-xs font-semibold text-slate-500">Cleanliness Drives</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {unlockedBadges.length} Badges
              </div>
              <div className="text-xs font-semibold text-slate-500">Achievements</div>
            </div>
          </div>

        </div>
      </div>

      {/* Earned Badges & Leveling Row */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Your Unlocked Volunteer Badges
            </h3>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            {unlockedBadges.length} / {INITIAL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {INITIAL_BADGES.map(badge => {
            const isUnlocked = currentUser?.badges?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl text-center space-y-1.5 border transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{badge.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Personalized Event Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            AI Recommended Drives For You
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
            Based on interests & history
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiRecommendations.map(evt => (
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
      </div>

      {/* My Registered Drives & Past Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            My Registered & Attended Drives ({registeredEvents.length})
          </h3>
        </div>

        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map(evt => (
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
            <p className="text-xs text-slate-500">You have not registered for any drives yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

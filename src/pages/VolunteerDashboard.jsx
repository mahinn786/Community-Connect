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
      <div className="rounded-3xl bg-[#783F46] text-white p-6 md:p-8 shadow-xl relative overflow-hidden border border-[#D9D1C7]/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wide text-[#F6F3EF]">
                <Sparkles className="w-3 h-3 text-[#D9D1C7]" />
                Community Impact Volunteer
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Welcome Back, {currentUser?.name}!
              </h1>
              <p className="text-xs text-[#D9D1C7] font-medium">
                {currentUser?.organization || 'Greenfield Volunteer Club'} • Level 3 Contributor
              </p>
            </div>
          </div>

          {/* Quick Hours Pill */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="p-3 rounded-xl bg-[#F6F3EF] text-[#783F46] font-black shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{currentUser?.hours || 32} Hrs</div>
              <div className="text-xs font-semibold text-[#D9D1C7]">Total Volunteer Hours</div>
            </div>
          </div>

        </div>
      </div>

      {/* Impact Statistics Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#342C2D] uppercase tracking-wider">
          Real-World Social Impact Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
              <TreePine className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#342C2D]">
                {currentUser?.treesPlanted || 14}
              </div>
              <div className="text-xs font-semibold text-[#B59A8C]">Trees Planted</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#342C2D]">
                {currentUser?.bloodDonatedUnits || 2} Units
              </div>
              <div className="text-xs font-semibold text-[#B59A8C]">Blood Donated</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#342C2D]">
                {currentUser?.cleanupsAttended || 4}
              </div>
              <div className="text-xs font-semibold text-[#B59A8C]">Cleanliness Drives</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#342C2D]">
                {unlockedBadges.length} Badges
              </div>
              <div className="text-xs font-semibold text-[#B59A8C]">Achievements</div>
            </div>
          </div>

        </div>
      </div>

      {/* Earned Badges & Leveling Row */}
      <div className="p-6 rounded-3xl bg-white border border-[#D9D1C7] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#783F46]" />
            <h3 className="text-base font-bold text-[#342C2D]">
              Your Unlocked Volunteer Badges
            </h3>
          </div>
          <span className="text-xs text-[#783F46] font-bold">
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
                    ? 'bg-[#F6F3EF] border-[#783F46]/50 shadow-sm'
                    : 'bg-[#F6F3EF]/30 border-[#D9D1C7] opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="text-xs font-bold text-[#342C2D] truncate">{badge.name}</div>
                <div className="text-[10px] text-[#B59A8C] line-clamp-1">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Personalized Event Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#783F46]" />
          <h3 className="text-base font-bold text-[#342C2D]">
            AI Recommended Drives For You
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
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
          <h3 className="text-base font-bold text-[#342C2D] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#783F46]" />
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
          <div className="py-12 text-center bg-white rounded-3xl border border-[#D9D1C7] space-y-2">
            <p className="text-xs text-[#B59A8C]">You have not registered for any drives yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

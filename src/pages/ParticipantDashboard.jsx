import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { api } from '../utils/api';
import { INITIAL_BADGES } from '../../server/data/seedData.js';
import {
  Ticket,
  Calendar,
  Clock,
  Award,
  Heart,
  Sparkles,
  TreePine,
  Droplets,
  CheckCircle2,
  QrCode,
  Search,
  Settings,
  ChevronRight,
  Filter,
  User,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';

export const ParticipantDashboard = ({
  onSelectEvent,
  onRegisterToggle,
  onShowQR,
  onShowCertificate
}) => {
  const { currentUser, savedEvents, isEventSaved, updateProfile, updateUserStats } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'volunteer' | 'saved' | 'recommended' | 'history' | 'profile'
  const [dashSearchQuery, setDashSearchQuery] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Profile edit form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileOrg, setProfileOrg] = useState(currentUser?.organization || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  useEffect(() => {
    loadEvents();
  }, [currentUser]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await api.getEvents();
    setAllEvents(data || []);

    const recs = await api.getAIRecommendations(currentUser?.interests || ['Tree Plantation', 'Workshops']);
    setAiRecommendations(recs || []);
    setLoading(false);
  };

  // Participant's registrations (either as volunteer or participant)
  const myRegisteredEvents = (allEvents || []).filter(e => {
    if (!e || !currentUser) return false;
    const isVol = e.registeredVolunteers?.includes(currentUser.id);
    const isPart = e.registeredParticipants?.includes(currentUser.id);
    return isVol || isPart;
  });

  // Upcoming registrations (active drives)
  const upcomingRegistrations = myRegisteredEvents.filter(e => !e.isCompleted);
  // Past / completed registrations
  const historyRegistrations = myRegisteredEvents.filter(e => e.isCompleted);

  // Saved / Bookmarked events
  const bookmarkedEvents = (allEvents || []).filter(e => e && savedEvents?.includes(e.id));

  // Unlocked badges for this participant
  const unlockedBadges = INITIAL_BADGES.filter(b => currentUser?.badges?.includes(b.id));

  // Handle Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      organization: profileOrg
    });
    setProfileSavedMsg('Profile updated successfully!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  // Filtered upcoming events with search query
  const displayedUpcoming = upcomingRegistrations.filter(e => {
    if (dashSearchQuery) {
      const q = dashSearchQuery.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-20 text-left">
      
      {/* Personalized Greeting Header (Deep Burgundy dark section per spec) */}
      <div className="relative rounded-3xl bg-[#783F46] text-[#F6F3EF] p-6 sm:p-8 shadow-subtle overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#D9D1C7]/40 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#D9D1C7] border-2 border-[#783F46] rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#F6F3EF]/15 text-[#F6F3EF] border border-[#F6F3EF]/20">
                <Ticket className="w-3 h-3 text-[#D9D1C7]" />
                <span>Participant & Volunteer Account</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[#F6F3EF]">
                Welcome back, {currentUser?.name || 'Friend'}!
              </h1>
              <p className="text-xs text-[#F6F3EF]/85 font-normal">
                {currentUser?.organization || 'Community Member'} • Track registrations, passes & impact hours
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge Pill */}
          <div className="flex items-center gap-3 bg-[#342C2D]/40 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-[#F6F3EF]/20 self-start md:self-auto">
            <div className="p-3 rounded-xl bg-[#F6F3EF] text-[#783F46] font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#F6F3EF]">
                {currentUser?.hours || 32} hrs
              </div>
              <div className="text-[11px] text-[#F6F3EF]/80 font-medium">
                Certified Volunteer Impact
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D9D1C7] dark:border-[#4D4344]">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming Registrations ({upcomingRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'volunteer'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Volunteering & Badges ({unlockedBadges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved Drives ({bookmarkedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'recommended'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recommended For You</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>History & Certificates</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#783F46] text-white shadow-sm'
              : 'text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: Upcoming Registrations */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
                My Upcoming Registered Drives
              </h3>
              <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                Events you are registered to attend or volunteer at. Click on any card to view passes.
              </p>
            </div>

            {/* In-tab search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 w-3.5 h-3.5 text-[#342C2D]/40" />
              <input
                type="text"
                placeholder="Search my registered drives..."
                value={dashSearchQuery}
                onChange={(e) => setDashSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/50 focus:outline-none focus:ring-1 focus:ring-[#783F46]"
              />
            </div>
          </div>

          {displayedUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedUpcoming.map(evt => (
                <div key={evt.id} className="relative group space-y-2">
                  <EventCard
                    event={evt}
                    onSelect={onSelectEvent}
                  />
                  {/* Quick pass trigger button */}
                  <button
                    onClick={() => onShowQR && onShowQR(evt)}
                    className="w-full py-2 px-3 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#783F46] text-[#783F46] dark:text-[#D9D1C7] text-xs font-bold hover:bg-[#D9D1C7]/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Entry QR Pass</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-3">
              <Calendar className="w-10 h-10 text-[#342C2D]/40 mx-auto" />
              <h4 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                No upcoming registered events
              </h4>
              <p className="text-xs text-[#342C2D]/60 max-w-sm mx-auto">
                You haven't registered for any active drives yet. Explore upcoming community drives and get involved!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Volunteering & Badges */}
      {activeTab === 'volunteer' && (
        <div className="space-y-6">
          {/* Volunteer Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] border border-[#D9D1C7]">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">
                  {currentUser?.hours || 32} Hrs
                </div>
                <div className="text-xs text-[#342C2D]/60">Verified Volunteer Time</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] border border-[#D9D1C7]">
                <TreePine className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">
                  {currentUser?.treesPlanted || 14}
                </div>
                <div className="text-xs text-[#342C2D]/60">Trees Planted</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] border border-[#D9D1C7]">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">
                  {currentUser?.bloodDonatedUnits || 2} Units
                </div>
                <div className="text-xs text-[#342C2D]/60">Blood Donated</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] border border-[#D9D1C7]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">
                  {currentUser?.cleanupsAttended || 4}
                </div>
                <div className="text-xs text-[#342C2D]/60">Cleanups Attended</div>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#783F46]" />
                <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                  Unlocked Volunteer Achievement Badges
                </h3>
              </div>
              <span className="text-xs font-bold text-[#783F46]">
                {unlockedBadges.length} of {INITIAL_BADGES.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {INITIAL_BADGES.map(badge => {
                const isUnlocked = currentUser?.badges?.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl text-center space-y-1.5 border transition-all ${
                      isUnlocked
                        ? 'bg-[#F6F3EF] dark:bg-[#342C2D] border-[#783F46] shadow-sm'
                        : 'bg-white/40 dark:bg-[#2A2324]/40 border-[#D9D1C7] opacity-40 grayscale'
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="text-xs font-bold text-[#342C2D] dark:text-[#F6F3EF] truncate">
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-[#342C2D]/60 line-clamp-2">
                      {badge.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Saved Drives */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="space-y-0.5">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
              Saved & Bookmarked Drives ({bookmarkedEvents.length})
            </h3>
            <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              Community drives you have bookmarked to review or register for later.
            </p>
          </div>

          {bookmarkedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedEvents.map(evt => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onSelect={onSelectEvent}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-3">
              <Heart className="w-10 h-10 text-[#342C2D]/40 mx-auto" />
              <h4 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                No saved drives yet
              </h4>
              <p className="text-xs text-[#342C2D]/60 max-w-sm mx-auto">
                Click the heart icon on any event card while exploring to bookmark it here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Recommended for You */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          <div className="space-y-0.5">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#783F46]" />
              <span>Recommended Drives Based on Your Interests</span>
            </h3>
            <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              Personalized suggestions tuned to your favorite categories: {currentUser?.interests?.join(', ') || 'Tree Plantation, Workshops'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendations.map(evt => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Registration History & Certificates */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="space-y-0.5">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
              Completed Drives & Verified Certificates
            </h3>
            <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              Download your verified participation and volunteer certificates for past events.
            </p>
          </div>

          {historyRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyRegistrations.map(evt => (
                <div key={evt.id} className="space-y-2">
                  <EventCard
                    event={evt}
                    onSelect={onSelectEvent}
                  />
                  <button
                    onClick={() => onShowCertificate && onShowCertificate(evt)}
                    className="w-full py-2 px-3 rounded-xl bg-[#783F46] text-white text-xs font-bold hover:bg-[#623339] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Impact Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-3">
              <Award className="w-10 h-10 text-[#342C2D]/40 mx-auto" />
              <h4 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                No completed drives in history yet
              </h4>
              <p className="text-xs text-[#342C2D]/60 max-w-sm mx-auto">
                Once an event you attended concludes and attendance is verified, your certificates will be generated here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl space-y-6">
          <div className="space-y-0.5">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
              Participant Profile Settings
            </h3>
            <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              Update your personal display name, organization affiliation, and interests.
            </p>
          </div>

          {profileSavedMsg && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#783F46] text-[#783F46] text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
              <span>{profileSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                Display Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                Email (Account Identifier)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#D9D1C7]/30 dark:bg-[#342C2D]/50 text-[#342C2D]/60 text-sm font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                Organization / College
              </label>
              <input
                type="text"
                value={profileOrg}
                onChange={(e) => setProfileOrg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#783F46] hover:bg-[#623339] shadow-sm transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

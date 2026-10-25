import React, { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { api } from '../utils/api';
import { INITIAL_CATEGORIES } from '../../server/data/seedData.js';
import {
  Search,
  Filter,
  MapPin,
  Grid,
  Map as MapIcon,
  Sparkles,
  TreePine,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const ExploreEvents = ({
  searchQuery,
  setSearchQuery,
  onSelectEvent,
  onRegisterToggle,
  onShowQR,
  onShowCertificate
}) => {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedCity, searchQuery, showCompleted]);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await api.getEvents({
      category: selectedCategory,
      search: searchQuery,
      city: selectedCity,
      isCompleted: showCompleted
    });
    setEvents(data || []);
    setLoading(false);
  };

  const cities = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune'];

  // Unified Filter Function: Applies Role, Fee, City, Category, and Search simultaneously
  const filteredEvents = (events || []).filter(e => {
    if (!e) return false;
    // Role filter
    if (selectedRoleFilter === 'Volunteer' && e.allowVolunteer === false) return false;
    if (selectedRoleFilter === 'Participant' && e.allowParticipant === false) return false;

    // Fee structure filter
    const volFee = Number(e.volunteerFee || 0);
    const partFee = Number(e.participantFee !== undefined ? e.participantFee : (e.registrationFee || 0));
    
    if (selectedFeeFilter === 'Free') {
      if (volFee > 0 || partFee > 0) return false;
    }
    if (selectedFeeFilter === 'Paid') {
      if (volFee === 0 && partFee === 0) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white p-8 md:p-12 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Social Impact Event Management Platform
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Connect, Volunteer & Create Real-World Impact
          </h1>
          
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
            Empowering NGOs, colleges, social organizations, and local communities to organize drives while volunteers easily discover, register, scan QR attendance, and log certified impact hours.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/20 text-left">
            <div>
              <div className="text-2xl font-black text-amber-300">1,420+</div>
              <div className="text-xs text-slate-200 font-medium">Trees Planted</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-300">380+</div>
              <div className="text-xs text-slate-200 font-medium">Blood Units Donated</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-300">96+</div>
              <div className="text-xs text-slate-200 font-medium">Cleanliness Drives</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-200">4,850</div>
              <div className="text-xs text-slate-200 font-medium">Certified Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified All-in-One Filter Control Center */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Unified Filter Control Center
              </h3>
              <p className="text-[10px] text-slate-500">Apply City, Role Type, Fee Structure & Category filters simultaneously</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(selectedCategory !== 'All' || selectedCity !== 'All' || selectedRoleFilter !== 'All' || selectedFeeFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCity('All');
                  setSelectedRoleFilter('All');
                  setSelectedFeeFilter('All');
                  setSearchQuery('');
                }}
                className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition-colors"
              >
                Reset All Filters
              </button>
            )}

            {/* Grid vs Map View Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map Pins</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. City Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/50"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* 2. Role Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Role Type
            </label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="All">All Roles (Volunteer & Participant)</option>
              <option value="Volunteer">Open for Volunteers</option>
              <option value="Participant">Open for Participants</option>
            </select>
          </div>

          {/* 3. Fee Structure Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Fee Structure
            </label>
            <select
              value={selectedFeeFilter}
              onChange={(e) => setSelectedFeeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="All">All Entry Types (Free & Paid)</option>
              <option value="Free">Free Drives Only</option>
              <option value="Paid">Paid Entry Drives Only</option>
            </select>
          </div>

          {/* 4. Drive Status Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-teal-500" /> Drive Status
            </label>
            <select
              value={showCompleted ? 'Completed' : 'Upcoming'}
              onChange={(e) => setShowCompleted(e.target.value === 'Completed')}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="Upcoming">Upcoming Drives</option>
              <option value="Completed">Completed Drives</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Category Filter
            </label>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {filteredEvents.length} Drives Matching
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {INITIAL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Events Container */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap events={filteredEvents} onSelectEvent={onSelectEvent} />
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
            💡 Click on any map marker pin above to inspect drive details and register.
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(evt => (
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
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Volunteer Drives Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your city, role, fee, or category filter options.
          </p>
        </div>
      )}

    </div>
  );
};

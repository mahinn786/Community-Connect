import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  SlidersHorizontal,
  Calendar,
  Sparkles,
  Ticket,
  UserCheck,
  RotateCcw
} from 'lucide-react';

export const ExploreEvents = ({
  searchQuery,
  setSearchQuery,
  onSelectEvent,
  initialCategory = 'All'
}) => {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All'); // 'All' | 'Weekend' | 'Month'
  const [selectedFeeFilter, setSelectedFeeFilter] = useState('All'); // 'All' | 'Free' | 'Paid'
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState('All'); // 'All' | 'vol-available' | 'part-available'
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc' | 'date-desc' | 'rating'
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedCity, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await api.getEvents({
      category: selectedCategory,
      search: searchQuery,
      city: selectedCity,
    });
    setEvents(data || []);
    setLoading(false);
  };

  const cities = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune'];

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCity('All');
    setSelectedDateFilter('All');
    setSelectedFeeFilter('All');
    setSelectedAvailabilityFilter('All');
    setSortBy('date-asc');
    if (setSearchQuery) setSearchQuery('');
  };

  // Advanced multi-criteria filtering
  const filteredEvents = (events || []).filter(e => {
    if (!e) return false;

    // Fee structure filter
    const volFee = Number(e.volunteerFee || 0);
    const partFee = Number(e.participantFee !== undefined ? e.participantFee : (e.registrationFee || 0));
    
    if (selectedFeeFilter === 'Free') {
      if (volFee > 0 || partFee > 0) return false;
    }
    if (selectedFeeFilter === 'Paid') {
      if (volFee === 0 && partFee === 0) return false;
    }

    // Availability filter
    if (selectedAvailabilityFilter === 'vol-available') {
      const volLimit = e.volunteerLimit || 50;
      const volCount = e.registeredVolunteers?.length || 0;
      if (volLimit - volCount <= 0 || e.allowVolunteer === false) return false;
    }
    if (selectedAvailabilityFilter === 'part-available') {
      const partLimit = e.participantLimit || 150;
      const partCount = e.registeredParticipants?.length || 0;
      if (partLimit - partCount <= 0 || e.allowParticipant === false) return false;
    }

    // Date filter
    if (selectedDateFilter !== 'All' && e.date) {
      const eventDate = new Date(e.date);
      const today = new Date();
      if (selectedDateFilter === 'Weekend') {
        const day = eventDate.getDay();
        const isWeekend = day === 0 || day === 6;
        if (!isWeekend) return false;
      } else if (selectedDateFilter === 'Month') {
        const isCurrentMonth = eventDate.getMonth() === today.getMonth();
        if (!isCurrentMonth) return false;
      }
    }

    return true;
  });

  // Sort logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    (selectedFeeFilter !== 'All' ? 1 : 0) +
    (selectedDateFilter !== 'All' ? 1 : 0) +
    (selectedAvailabilityFilter !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6 pb-20 text-left">
      
      {/* Exploration Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#783F46] dark:text-[#D4A8B0]">
            Event Discovery
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#342C2D] dark:text-[#F6F3EF]">
            Explore Community Drives
          </h1>
          <p className="text-xs sm:text-sm text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
            Discover workshops, college campaigns, social welfare drives, and volunteering initiatives.
          </p>
        </div>

        {/* View Mode Toggle (Grid vs Map) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#783F46] text-white shadow-sm'
                  : 'text-[#342C2D] dark:text-[#F6F3EF]/80 hover:text-[#783F46]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#783F46] text-white shadow-sm'
                  : 'text-[#342C2D] dark:text-[#F6F3EF]/80 hover:text-[#783F46]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter Bar Container */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-4">
        
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40 dark:text-[#F6F3EF]/40" />
            <input
              type="text"
              placeholder="Search drives by name, cause, tree plantation, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D]/40 border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/50 dark:placeholder-[#F6F3EF]/50 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-[#342C2D]/40 hover:text-[#783F46]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] text-[#783F46] dark:text-[#D9D1C7] text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>

        {/* Desktop Filter Controls */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-[11px] font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
            >
              <option value="All">All Categories</option>
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-[11px] font-semibold">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>
              ))}
            </select>
          </div>

          {/* Fee Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-[11px] font-semibold">Fee:</span>
            <select
              value={selectedFeeFilter}
              onChange={(e) => setSelectedFeeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
            >
              <option value="All">All Pricing</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>
          </div>

          {/* Slots Availability Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-[11px] font-semibold">Availability:</span>
            <select
              value={selectedAvailabilityFilter}
              onChange={(e) => setSelectedAvailabilityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
            >
              <option value="All">All Slots</option>
              <option value="vol-available">Volunteer Slots Open</option>
              <option value="part-available">Participant Slots Open</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-[11px] font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] font-medium focus:outline-none focus:ring-1 focus:ring-[#783F46]"
            >
              <option value="date-asc">Date (Earliest)</option>
              <option value="date-desc">Date (Latest)</option>
              <option value="rating">Popularity / Top Rated</option>
            </select>
          </div>

          {/* Reset Filters button if any active */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-[#783F46] hover:bg-[#D9D1C7]/30 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60 pt-1 border-t border-[#D9D1C7] dark:border-[#4D4344]">
          <span>
            Showing <strong className="text-[#342C2D] dark:text-[#F6F3EF] font-bold">{sortedEvents.length}</strong> community drives
          </span>

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7]">
              Filter: {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Main Content: Map or Grid View */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-subtle border border-[#D9D1C7] dark:border-[#4D4344]">
            <InteractiveMap events={sortedEvents} onSelectEvent={onSelectEvent} />
          </div>
          <p className="text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60 text-center">
            Click on any event map marker to view event summary and directions.
          </p>
        </div>
      ) : loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-[#D9D1C7]/30 animate-pulse border border-[#D9D1C7]"
            />
          ))}
        </div>
      ) : sortedEvents.length > 0 ? (
        /* Event Cards Grid */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedEvents.map(evt => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
            />
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
              No matching community drives found
            </h3>
            <p className="text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60 max-w-sm mx-auto">
              We couldn't find any events matching your selected filter criteria. Try resetting or adjusting filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#783F46] hover:bg-[#623339] transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Mobile Filters Slide-out Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-[#F6F3EF] dark:bg-[#2A2324] h-full shadow-2xl p-6 space-y-6 overflow-y-auto z-10 text-left border-l border-[#D9D1C7]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D1C7]">
                <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                  Filter Drives
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-[#342C2D]/50 hover:text-[#783F46]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#342C2D] border border-[#D9D1C7] text-xs font-medium"
                >
                  <option value="All">All Categories</option>
                  {INITIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">City / Region</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#342C2D] border border-[#D9D1C7] text-xs font-medium"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>
                  ))}
                </select>
              </div>

              {/* Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Registration Fee</label>
                <select
                  value={selectedFeeFilter}
                  onChange={(e) => setSelectedFeeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#342C2D] border border-[#D9D1C7] text-xs font-medium"
                >
                  <option value="All">All</option>
                  <option value="Free">Free Only</option>
                  <option value="Paid">Paid Only</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Slot Availability</label>
                <select
                  value={selectedAvailabilityFilter}
                  onChange={(e) => setSelectedAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#342C2D] border border-[#D9D1C7] text-xs font-medium"
                >
                  <option value="All">All Slots</option>
                  <option value="vol-available">Volunteer Slots Open</option>
                  <option value="part-available">Participant Slots Open</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#342C2D] border border-[#D9D1C7] text-xs font-medium"
                >
                  <option value="date-asc">Date (Earliest)</option>
                  <option value="date-desc">Date (Latest)</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#783F46] text-white font-semibold text-xs shadow-md hover:bg-[#623339]"
                >
                  Apply Filters ({sortedEvents.length} results)
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full py-2 rounded-xl border border-[#D9D1C7] text-[#342C2D] dark:text-[#F6F3EF] text-xs font-semibold hover:bg-[#D9D1C7]/30"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

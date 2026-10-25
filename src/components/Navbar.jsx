import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  UserCheck,
  Ticket,
  Building2,
  ShieldCheck,
  Trophy,
  Sun,
  Moon,
  Search,
  Sparkles,
  Filter,
  X
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
  const { currentUser, activeRole, switchRole, darkMode, toggleDarkMode } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const inputRef = useRef(null);

  const navItems = [
    { id: 'explore', label: 'Explore Drives', icon: Calendar },
    { id: 'volunteer-dash', label: 'Volunteer Portal', icon: UserCheck, role: 'Volunteer' },
    { id: 'participant-dash', label: 'Participant Portal', icon: Ticket, role: 'Participant' },
    { id: 'organizer-dash', label: 'Organizer Hub', icon: Building2, role: 'Organizer' },
    { id: 'admin-dash', label: 'Admin Portal', icon: ShieldCheck, role: 'Admin' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (activeTab !== 'explore') setActiveTab('explore');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('explore')} 
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <img 
              src="/logo.jpg" 
              alt="CommunityConnect Logo" 
              className="w-12 h-12 rounded-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform object-cover"
            />
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                CommunityConnect
              </span>
              <p className="hidden sm:block text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Social Impact Platform
              </p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-xs sm:max-w-md relative flex items-center"
          >
            <button
              type="submit"
              className="absolute left-2.5 p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              title="Click to search"
            >
              <Search className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              placeholder="Search drives, tree plantation, city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'explore') setActiveTab('explore');
              }}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.role) switchRole(item.role);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role Switcher Pill & Controls */}
          <div className="flex items-center gap-2">
            
            {/* Interactive Role View Filter & Selector */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/50 text-[11px] font-medium shadow-sm">
              <span className="px-2 py-0.5 text-slate-600 dark:text-slate-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                Role Filter:
              </span>
              {['Volunteer', 'Participant', 'Organizer', 'Admin'].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    if (r === 'Volunteer') setActiveTab('volunteer-dash');
                    else if (r === 'Participant') setActiveTab('participant-dash');
                    else if (r === 'Organizer') setActiveTab('organizer-dash');
                    else if (r === 'Admin') setActiveTab('admin-dash');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold flex items-center gap-1 ${
                    activeRole === r
                      ? r === 'Volunteer'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : r === 'Participant'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : r === 'Organizer'
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                        : 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                  }`}
                  title={`Filter portal view & edit active role as ${r}`}
                >
                  <span>{r}</span>
                </button>
              ))}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
            </div>

          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800/60 overflow-x-auto gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.role) switchRole(item.role);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

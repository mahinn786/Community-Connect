import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Compass,
  HelpCircle,
  Info,
  Sun,
  Moon,
  LogOut,
  User,
  Building2,
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  LayoutDashboard,
  Ticket,
  Sparkles
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenCreateEvent
}) => {
  const { currentUser, role, logout, darkMode, toggleDarkMode } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOrganizer = role === 'Organizer';
  const isParticipant = role === 'Participant';

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-subtle py-2.5'
          : 'bg-[#F6F3EF]/95 dark:bg-[#252021]/95 backdrop-blur-md border-b border-[#D9D1C7] dark:border-[#3D3536] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Community Connect"
                className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-105 transition-transform object-cover border border-[#D9D1C7]"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#783F46] border-2 border-[#F6F3EF] dark:border-[#252021] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg tracking-tight text-[#342C2D] dark:text-[#F6F3EF] transition-colors">
                  Community<span className="text-[#783F46]">Connect</span>
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60 font-medium tracking-wider uppercase">
                Events & Social Impact
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                  : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                  : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#783F46]" />
              <span>Explore Events</span>
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'how-it-works'
                  ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                  : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                  : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
              }`}
            >
              About Us
            </button>

            {/* If logged in as Participant, direct link to Participant Portal */}
            {isParticipant && (
              <button
                onClick={() => handleNavClick('participant-dash')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'participant-dash'
                    ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                    : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-[#783F46]" />
                <span>My Dashboard</span>
              </button>
            )}

            {/* If logged in as Organizer, direct link to Organizer Hub */}
            {isOrganizer && (
              <button
                onClick={() => handleNavClick('organizer-dash')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'organizer-dash'
                    ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold'
                    : 'text-[#342C2D] hover:text-[#783F46] hover:bg-[#D9D1C7]/20'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#783F46]" />
                <span>Organizer Hub</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-[#342C2D]/70 dark:text-[#F6F3EF]/70 hover:text-[#783F46] hover:bg-[#D9D1C7]/30 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#D9D1C7]" /> : <Moon className="w-4 h-4 text-[#783F46]" />}
            </button>

            {/* If NOT logged in: Show Login & Get Started CTAs */}
            {!currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('participant', 'login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] hover:bg-[#D9D1C7]/30 rounded-xl transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('participant', 'signup')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#783F46] hover:bg-[#623339] active:scale-[0.98] rounded-xl shadow-sm transition-all"
                >
                  Get Started
                </button>
              </div>
            ) : (
              /* User Profile Menu Pill */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] hover:border-[#783F46] shadow-sm transition-all text-left"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-xl object-cover ring-1 ring-[#D9D1C7]"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-[#342C2D] dark:text-[#F6F3EF] leading-none truncate max-w-[110px]">
                      {currentUser?.name}
                    </div>
                    <div className="text-[10px] text-[#783F46] dark:text-[#B59A8C] font-semibold leading-tight capitalize">
                      {role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#342C2D]/50 dark:text-[#F6F3EF]/50 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown shadow-premium border border-[#D9D1C7] p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-[#D9D1C7]">
                        <p className="font-bold text-[#342C2D] dark:text-[#F6F3EF] truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7]">
                          {isOrganizer ? 'Organizer Account' : 'Participant Account'}
                        </span>
                      </div>

                      <div className="py-1">
                        {isParticipant ? (
                          <button
                            onClick={() => handleNavClick('participant-dash')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] dark:hover:bg-[#342C2D] font-medium transition-colors text-left"
                          >
                            <Ticket className="w-4 h-4 text-[#783F46]" />
                            <span>My Dashboard & Tickets</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleNavClick('organizer-dash')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] dark:hover:bg-[#342C2D] font-medium transition-colors text-left"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#783F46]" />
                            <span>Organizer Dashboard</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleNavClick('explore')}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] dark:hover:bg-[#342C2D] font-medium transition-colors text-left"
                        >
                          <Compass className="w-4 h-4 text-[#783F46]" />
                          <span>Explore Community Drives</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-[#D9D1C7]">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            setActiveTab('home');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#783F46] hover:bg-[#F6F3EF] dark:hover:bg-[#342C2D] font-medium transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#D9D1C7]/30 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-3 border-t border-[#D9D1C7] space-y-2 bg-[#F6F3EF] dark:bg-[#252021]"
            >
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === 'home' ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold' : 'text-[#342C2D] hover:bg-[#D9D1C7]/30'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('explore')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === 'explore' ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold' : 'text-[#342C2D] hover:bg-[#D9D1C7]/30'
                }`}
              >
                <Compass className="w-4 h-4 text-[#783F46]" />
                Explore Events
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === 'how-it-works' ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold' : 'text-[#342C2D] hover:bg-[#D9D1C7]/30'
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === 'about' ? 'text-[#783F46] bg-[#D9D1C7]/40 font-bold' : 'text-[#342C2D] hover:bg-[#D9D1C7]/30'
                }`}
              >
                About Us
              </button>

              {isParticipant && (
                <button
                  onClick={() => handleNavClick('participant-dash')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#783F46] bg-[#D9D1C7]/30"
                >
                  <Ticket className="w-4 h-4 text-[#783F46]" />
                  Participant Portal
                </button>
              )}

              {isOrganizer && (
                <button
                  onClick={() => handleNavClick('organizer-dash')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#783F46] bg-[#D9D1C7]/30"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#783F46]" />
                  Organizer Hub
                </button>
              )}

              {!currentUser && (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('participant', 'login');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold border border-[#783F46] text-[#783F46] rounded-xl bg-[#F6F3EF]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('participant', 'signup');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-white bg-[#783F46] rounded-xl hover:bg-[#623339]"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

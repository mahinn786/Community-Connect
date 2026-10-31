import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ExploreEvents } from './pages/ExploreEvents';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { EventDetails } from './pages/EventDetails';
import { ParticipantDashboard } from './pages/ParticipantDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { QRCodeDisplayModal } from './components/QRCodeDisplayModal';
import { QRScannerModal } from './components/QRScannerModal';
import { CertificateModal } from './components/CertificateModal';
import { AuthModal } from './components/AuthModal';
import { api } from './utils/api';
import {
  Heart,
  ShieldCheck,
  Compass,
  Building2,
  Ticket,
  Mail,
  ArrowUp
} from 'lucide-react';

// URL pathname helper for HTML5 browser history
const getTabFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path === '/explore' || path.startsWith('/explore/')) return 'explore';
  if (path === '/how-it-works') return 'how-it-works';
  if (path === '/about' || path === '/about-us') return 'about';
  if (path === '/dashboard/organizer' || path === '/organizer-dash') return 'organizer-dash';
  if (path === '/dashboard/participant' || path === '/participant-dash' || path === '/dashboard') return 'participant-dash';
  if (path.startsWith('/event/')) return 'details';
  return 'home';
};

const AppContent = () => {
  const { currentUser, role, updateUserStats } = useAuth();
  
  // Active page tab ('home' | 'explore' | 'how-it-works' | 'about' | 'details' | 'participant-dash' | 'organizer-dash')
  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInitialCategory, setSelectedInitialCategory] = useState('All');
  const [allEvents, setAllEvents] = useState([]);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalPortal, setAuthModalPortal] = useState('participant'); // 'participant' | 'organizer'
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Other Modals State
  const [qrDisplayEvent, setQrDisplayEvent] = useState(null);
  const [qrScannerEvent, setQrScannerEvent] = useState(null);
  const [certificateEvent, setCertificateEvent] = useState(null);

  // Fetch all events on load
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await api.getEvents();
    setAllEvents(data || []);
  };

  // URL Path Synchronization & Browser History Navigation
  const navigateTo = (tab, params = {}) => {
    let targetPath = '/';
    if (tab === 'explore') targetPath = '/explore';
    else if (tab === 'how-it-works') targetPath = '/how-it-works';
    else if (tab === 'about') targetPath = '/about';
    else if (tab === 'participant-dash') targetPath = '/dashboard/participant';
    else if (tab === 'organizer-dash') targetPath = '/dashboard/organizer';
    else if (tab === 'details' && params.event) targetPath = `/event/${params.event.id}`;
    
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, eventId: params.event?.id }, '', targetPath);
    }
    setActiveTab(tab);
    if (tab === 'details' && params.event) {
      setSelectedEvent(params.event);
    } else if (tab !== 'details') {
      setSelectedEvent(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Support Browser Back and Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath();
      setActiveTab(tab);
      if (tab === 'details') {
        const match = window.location.pathname.match(/\/event\/([^/]+)/);
        if (match && match[1]) {
          const found = allEvents.find(e => String(e.id) === match[1]);
          if (found) setSelectedEvent(found);
        }
      } else {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allEvents]);

  // Deep-link resolution if refreshed on /event/:id
  useEffect(() => {
    const match = window.location.pathname.match(/\/event\/([^/]+)/);
    if (match && match[1] && allEvents.length > 0) {
      const found = allEvents.find(e => String(e.id) === match[1]);
      if (found) {
        setSelectedEvent(found);
        setActiveTab('details');
      }
    }
  }, [allEvents]);

  const handleSelectEvent = (evt, overrideTab) => {
    if (overrideTab) {
      navigateTo(overrideTab);
      return;
    }
    navigateTo('details', { event: evt });
  };

  const handleNavigateExplore = (category = 'All') => {
    setSelectedInitialCategory(category);
    navigateTo('explore');
  };

  const handleOpenAuth = (portal = 'participant', mode = 'login') => {
    setAuthModalPortal(portal);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedRole) => {
    if (authenticatedRole === 'Organizer') {
      navigateTo('organizer-dash');
    } else {
      navigateTo('participant-dash');
    }
    loadEvents();
  };

  // Dual Registration: can register as 'Volunteer' or 'Participant'
  const handleRegisterToggle = async (eventId, regRole = 'Volunteer') => {
    const res = await api.toggleRegistration(eventId, currentUser?.id, regRole);
    if (res?.event) {
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(res.event);
      }
      setAllEvents(prev => prev.map(e => e.id === eventId ? res.event : e));
      updateUserStats({});
    }
  };

  const handleAddComment = async (eventId, commentData) => {
    const newComment = await api.addDiscussion(eventId, commentData);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({
        ...prev,
        discussions: [...(prev.discussions || []), newComment]
      }));
    }
  };

  const handleVerifyAttendance = async (eventId, qrCode) => {
    const res = await api.verifyAttendance(eventId, currentUser?.id, qrCode);
    if (res?.success) {
      updateUserStats({
        hours: (currentUser?.hours || 0) + 4
      });
      loadEvents();
    }
    return res;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EF] dark:bg-[#252021] text-[#342C2D] dark:text-[#F6F3EF] selection:bg-[#783F46] selection:text-white transition-colors duration-200">
      
      {/* Sticky Navigation Bar with four dedicated tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => navigateTo(tab)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* 1. Landing Page (Home) — Concise, purposeful, compact */}
        {activeTab === 'home' && (
          <LandingPage
            events={allEvents}
            onSelectEvent={handleSelectEvent}
            onNavigateExplore={handleNavigateExplore}
            onNavigateHowItWorks={() => navigateTo('how-it-works')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* 2. Dedicated Explore Events Page */}
        {activeTab === 'explore' && (
          <ExploreEvents
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectEvent={handleSelectEvent}
            initialCategory={selectedInitialCategory}
          />
        )}

        {/* 3. Dedicated How It Works Page */}
        {activeTab === 'how-it-works' && (
          <HowItWorksPage
            onNavigateExplore={handleNavigateExplore}
            onOpenAuth={handleOpenAuth}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* 4. Dedicated About Us Page */}
        {activeTab === 'about' && (
          <AboutUsPage
            onNavigateExplore={handleNavigateExplore}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* Event Details Page */}
        {activeTab === 'details' && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onBack={() => navigateTo('explore')}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
            onAddComment={handleAddComment}
            onVerifyAttendance={handleVerifyAttendance}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* Participant Dashboard */}
        {activeTab === 'participant-dash' && (
          <ParticipantDashboard
            onSelectEvent={handleSelectEvent}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
          />
        )}

        {/* Organizer Dashboard */}
        {activeTab === 'organizer-dash' && (
          <OrganizerDashboard
            onOpenQRScanner={(evt) => setQrScannerEvent(evt)}
            onShowQRDisplay={(evt) => setQrDisplayEvent(evt)}
          />
        )}
      </main>

      {/* Clean, Non-Repeated Footer */}
      <footer className="w-full bg-white dark:bg-[#2A2324] border-t border-[#D9D1C7] dark:border-[#4D4344] pt-12 pb-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Info */}
            <div className="space-y-3 md:col-span-1">
              <div
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <img
                  src="/logo.jpg"
                  alt="Community Connect"
                  className="w-8 h-8 rounded-xl object-cover border border-[#D9D1C7]"
                />
                <span className="font-heading font-extrabold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                  Community<span className="text-[#783F46]">Connect</span>
                </span>
              </div>
              <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70 leading-relaxed font-normal">
                Connecting purpose-driven participants and volunteers with community drives, verified attendance passes, and authenticated impact.
              </p>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-2 text-xs">
              <h4 className="font-heading font-bold text-[#342C2D] dark:text-[#F6F3EF] uppercase tracking-wider text-[11px]">
                Navigation
              </h4>
              <ul className="space-y-2 text-[#342C2D]/75 dark:text-[#F6F3EF]/75">
                <li>
                  <button
                    onClick={() => navigateTo('home')}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('explore')}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    Explore Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('how-it-works')}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Portals */}
            <div className="space-y-2 text-xs">
              <h4 className="font-heading font-bold text-[#342C2D] dark:text-[#F6F3EF] uppercase tracking-wider text-[11px]">
                User Portals
              </h4>
              <ul className="space-y-2 text-[#342C2D]/75 dark:text-[#F6F3EF]/75">
                <li>
                  <button
                    onClick={() => {
                      if (currentUser && role === 'Participant') navigateTo('participant-dash');
                      else handleOpenAuth('participant', 'login');
                    }}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    Participant & Volunteer Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentUser && role === 'Organizer') navigateTo('organizer-dash');
                      else handleOpenAuth('organizer', 'login');
                    }}
                    className="hover:text-[#783F46] transition-colors cursor-pointer"
                  >
                    Event Organizer Hub
                  </button>
                </li>
              </ul>
            </div>

            {/* Safety & Trust */}
            <div className="space-y-2 text-xs">
              <h4 className="font-heading font-bold text-[#342C2D] dark:text-[#F6F3EF] uppercase tracking-wider text-[11px]">
                Safety & Trust
              </h4>
              <p className="text-[11px] text-[#342C2D]/70 dark:text-[#F6F3EF]/70 leading-relaxed font-normal">
                All host organizations are vetted for community safety. Volunteer hours are logged and verified through geo-tagged QR attendance check-ins.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#D9D1C7] dark:border-[#4D4344] text-center text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Community Connect. Designed for real-world social impact.</p>
            <div className="flex items-center gap-4 text-xs text-[#342C2D]/50 dark:text-[#F6F3EF]/50">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Community Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialPortal={authModalPortal}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />

      {qrDisplayEvent && (
        <QRCodeDisplayModal
          event={qrDisplayEvent}
          onClose={() => setQrDisplayEvent(null)}
          isVolunteerView={true}
        />
      )}

      {qrScannerEvent && (
        <QRScannerModal
          event={qrScannerEvent}
          onVerifyAttendance={handleVerifyAttendance}
          onClose={() => setQrScannerEvent(null)}
        />
      )}

      {certificateEvent && (
        <CertificateModal
          event={certificateEvent}
          onClose={() => setCertificateEvent(null)}
        />
      )}

    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#252021] text-[#F6F3EF] text-center font-sans">
          <div className="max-w-md w-full space-y-4 p-8 bg-[#2A2324] rounded-3xl border border-[#783F46] shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#783F46]/20 text-[#783F46] flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-[#F6F3EF]">Application State Reload Needed</h2>
            <p className="text-xs text-[#D9D1C7] leading-relaxed">
              Older cached data was detected. Click below to clear cache and restore the application cleanly.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full px-5 py-3 rounded-2xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Reset Cache & Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

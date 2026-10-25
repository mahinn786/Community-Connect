import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ExploreEvents } from './pages/ExploreEvents';
import { EventDetails } from './pages/EventDetails';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { ParticipantDashboard } from './pages/ParticipantDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { QRCodeDisplayModal } from './components/QRCodeDisplayModal';
import { QRScannerModal } from './components/QRScannerModal';
import { CertificateModal } from './components/CertificateModal';
import { api } from './utils/api';

const AppContent = () => {
  const { currentUser, updateUserStats } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Modals state
  const [qrDisplayEvent, setQrDisplayEvent] = useState(null);
  const [qrScannerEvent, setQrScannerEvent] = useState(null);
  const [certificateEvent, setCertificateEvent] = useState(null);

  const handleSelectEvent = (evt) => {
    setSelectedEvent(evt);
    setActiveTab('details');
  };

  const handleRegisterToggle = async (eventId, role = 'Volunteer') => {
    const res = await api.toggleRegistration(eventId, currentUser?.id, role);
    if (res?.event) {
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(res.event);
      }
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
    }
    return res;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'details') setSelectedEvent(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Router Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'explore' && (
          <ExploreEvents
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectEvent={handleSelectEvent}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
          />
        )}

        {activeTab === 'details' && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onBack={() => setActiveTab('explore')}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
            onAddComment={handleAddComment}
            onVerifyAttendance={handleVerifyAttendance}
          />
        )}

        {activeTab === 'volunteer-dash' && (
          <VolunteerDashboard
            onSelectEvent={handleSelectEvent}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
          />
        )}

        {activeTab === 'participant-dash' && (
          <ParticipantDashboard
            onSelectEvent={handleSelectEvent}
            onRegisterToggle={handleRegisterToggle}
            onShowQR={(evt) => setQrDisplayEvent(evt)}
            onShowCertificate={(evt) => setCertificateEvent(evt)}
          />
        )}

        {activeTab === 'organizer-dash' && (
          <OrganizerDashboard
            onOpenQRScanner={(evt) => setQrScannerEvent(evt)}
            onShowQRDisplay={(evt) => setQrDisplayEvent(evt)}
          />
        )}

        {activeTab === 'admin-dash' && (
          <AdminDashboard />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Community Connect Hub — Empowering Social Impact & Volunteer Engagement
          </p>
          <p>© 2026 Community Connect Hub. Built for Hackathons & Social Impact Innovation.</p>
        </div>
      </footer>

      {/* Modals */}
      {qrDisplayEvent && (
        <QRCodeDisplayModal
          event={qrDisplayEvent}
          onClose={() => setQrDisplayEvent(null)}
          isVolunteerView={currentUser?.role === 'Volunteer'}
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 text-center font-sans">
          <div className="max-w-md w-full space-y-4 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-extrabold text-slate-100">Application State Reload Needed</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Older cached data was detected in your browser local storage. Click below to clear cache and restore the application cleanly.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
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

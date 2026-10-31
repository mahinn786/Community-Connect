import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DiscussionSection } from '../components/DiscussionSection';
import { EventGalleryModal } from '../components/EventGalleryModal';
import { InteractiveMap } from '../components/InteractiveMap';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  QrCode,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Image,
  ShieldCheck,
  Star,
  Ticket,
  UserCheck,
  Check,
  AlertCircle,
  Heart
} from 'lucide-react';

export const EventDetails = ({
  event,
  onBack,
  onRegisterToggle,
  onShowQR,
  onShowCertificate,
  onAddComment,
  onVerifyAttendance,
  onOpenAuth
}) => {
  const { currentUser, role, isEventSaved, toggleSaveEvent } = useAuth();
  const [showGallery, setShowGallery] = useState(false);
  const [registeringRole, setRegisteringRole] = useState(null); // 'Volunteer' | 'Participant' | null
  const [toastMsg, setToastMsg] = useState('');

  if (!event) return null;

  const isVolRegistered = event.registeredVolunteers?.includes(currentUser?.id);
  const isPartRegistered = event.registeredParticipants?.includes(currentUser?.id);
  const hasAttended =
    event.attendedVolunteers?.includes(currentUser?.id) ||
    event.attendedParticipants?.includes(currentUser?.id);

  const volLimit = event.volunteerLimit || 50;
  const volRegisteredCount = event.registeredVolunteers?.length || 0;
  const volSlotsLeft = Math.max(0, volLimit - volRegisteredCount);

  const partLimit = event.participantLimit || 150;
  const partRegisteredCount = event.registeredParticipants?.length || 0;
  const partSlotsLeft = Math.max(0, partLimit - partRegisteredCount);

  const volFee = Number(event.volunteerFee || 0);
  const partFee = Number(event.participantFee !== undefined ? event.participantFee : (event.registrationFee || 0));

  const saved = isEventSaved ? isEventSaved(event.id) : false;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleRegisterAction = async (targetRole) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('participant', 'signup');
      return;
    }

    setRegisteringRole(targetRole);
    try {
      await onRegisterToggle(event.id, targetRole);
      const isNowReg = targetRole === 'Volunteer' ? !isVolRegistered : !isPartRegistered;
      showToast(
        isNowReg
          ? `Successfully registered as ${targetRole} for "${event.title}"!`
          : `Cancelled ${targetRole} registration for "${event.title}".`
      );
    } catch (e) {
      showToast('Registration update failed. Please try again.');
    } finally {
      setRegisteringRole(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 text-left">
      
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#342C2D] text-[#F6F3EF] shadow-2xl border border-[#D9D1C7] text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#D9D1C7] flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Row */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveEvent && toggleSaveEvent(event.id)}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] shadow-subtle transition-all"
            title={saved ? 'Remove bookmark' : 'Bookmark event'}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-[#783F46] text-[#783F46]' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Event link copied to clipboard!');
              }
            }}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] shadow-subtle transition-all"
            title="Share Drive"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle">
        
        {/* Banner Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#342C2D]">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#342C2D]/95 via-[#342C2D]/40 to-black/20" />

          {/* Badges on Top Banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7] shadow-md">
              {event.category}
            </span>

            {event.isCompleted ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9D1C7] text-[#342C2D] shadow-md">
                Completed Drive
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#783F46] text-white shadow-md">
                Registration Open
              </span>
            )}
          </div>

          {/* Bottom Title & Organizer info */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F6F3EF] tracking-tight leading-tight drop-shadow-md">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#F6F3EF]/90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D9D1C7]" />
                Organized by <strong className="text-white font-bold ml-1">{event.organizer}</strong>
              </span>

              {event.rating && (
                <span className="flex items-center gap-1 text-[#D9D1C7]">
                  <Star className="w-4 h-4 fill-[#D9D1C7] text-[#D9D1C7]" />
                  <span>{event.rating} ({event.feedbacksCount || 12} community reviews)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details, Description & Map */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Date, Time, Location Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D]/50 border border-[#D9D1C7] dark:border-[#4D4344] text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] text-[#783F46]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60">{event.time || '09:00 AM - 01:00 PM'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] text-[#783F46]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF] truncate max-w-[180px]">
                    {event.location}
                  </div>
                  <div className="text-[#342C2D]/60 dark:text-[#F6F3EF]/60">{event.city}</div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                About this Drive
              </h3>
              <p className="text-xs sm:text-sm text-[#342C2D]/80 dark:text-[#F6F3EF]/80 leading-relaxed font-normal whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#342C2D]/60 dark:text-[#F6F3EF]/60">Initiative Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7] dark:border-[#4D4344]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Event Location Pin Map */}
            <div className="space-y-2 pt-2">
              <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                Venue Location Map
              </h3>
              <div className="rounded-2xl overflow-hidden border border-[#D9D1C7] dark:border-[#4D4344] h-64">
                <InteractiveMap events={[event]} singleEventMode={true} />
              </div>
            </div>

            {/* Post-attendance QR & Certificate Actions */}
            {(isVolRegistered || isPartRegistered) && (
              <div className="p-5 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D]/50 border border-[#D9D1C7] dark:border-[#4D4344] space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#783F46]" />
                  <h4 className="font-heading font-bold text-sm text-[#342C2D] dark:text-[#F6F3EF]">
                    Your Registration Passes & Certificates
                  </h4>
                </div>
                <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                  Present your entry QR code to the organizer at the venue check-in desk.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={() => onShowQR && onShowQR(event)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#783F46] hover:bg-[#623339] transition-all cursor-pointer shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Attendance QR Pass</span>
                  </button>

                  <button
                    onClick={() => onShowCertificate && onShowCertificate(event)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#783F46] bg-white dark:bg-[#2A2324] border border-[#783F46] hover:bg-[#D9D1C7]/30 transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            )}

            {/* Discussion & Q&A Section */}
            <div className="pt-4 border-t border-[#D9D1C7] dark:border-[#4D4344]">
              <DiscussionSection
                event={event}
                onAddComment={(commentData) => onAddComment(event.id, commentData)}
              />
            </div>
          </div>

          {/* Right Column: Dual Registration Options Card */}
          <div className="md:col-span-5 space-y-6 sticky top-24">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
                  Registration Options
                </h3>
                <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                  Choose how you want to be involved. You can register as an Attendee or contribute as a Volunteer.
                </p>
              </div>

              {/* Option 1: Participant / Attendee Registration */}
              <div
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isPartRegistered
                    ? 'bg-[#F6F3EF] dark:bg-[#342C2D] border-[#783F46]'
                    : 'bg-[#F6F3EF]/60 dark:bg-[#342C2D]/40 border-[#D9D1C7] dark:border-[#4D4344]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#342C2D] dark:text-[#F6F3EF]">
                      <Ticket className="w-4 h-4 text-[#783F46]" />
                      <span>Participant Pass</span>
                    </div>
                    <div className="text-[11px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                      Attend the sessions, access workshops & network
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#342C2D] dark:text-[#F6F3EF]">
                      {partFee > 0 ? `₹${partFee}` : 'Free'}
                    </span>
                    <div className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                      {partSlotsLeft} slots left
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={registeringRole === 'Participant' || (!isPartRegistered && partSlotsLeft <= 0)}
                  onClick={() => handleRegisterAction('Participant')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    isPartRegistered
                      ? 'bg-white text-[#783F46] border border-[#783F46] hover:bg-[#D9D1C7]/30'
                      : 'bg-[#783F46] text-white hover:bg-[#623339] shadow-sm'
                  }`}
                >
                  {registeringRole === 'Participant' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isPartRegistered ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Registered as Participant (Click to Cancel)</span>
                    </>
                  ) : partSlotsLeft <= 0 ? (
                    'Participant Slots Full'
                  ) : (
                    'Register as Participant'
                  )}
                </button>
              </div>

              {/* Option 2: Volunteer Registration */}
              <div
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isVolRegistered
                    ? 'bg-[#F6F3EF] dark:bg-[#342C2D] border-[#783F46]'
                    : 'bg-[#F6F3EF]/60 dark:bg-[#342C2D]/40 border-[#D9D1C7] dark:border-[#4D4344]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#342C2D] dark:text-[#F6F3EF]">
                      <UserCheck className="w-4 h-4 text-[#783F46]" />
                      <span>Volunteer Registration</span>
                    </div>
                    <div className="text-[11px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                      Hands-on impact, volunteer hours & certificate
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#342C2D] dark:text-[#F6F3EF]">
                      {volFee > 0 ? `₹${volFee}` : 'Free'}
                    </span>
                    <div className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                      {volSlotsLeft} slots left
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={registeringRole === 'Volunteer' || (!isVolRegistered && volSlotsLeft <= 0)}
                  onClick={() => handleRegisterAction('Volunteer')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    isVolRegistered
                      ? 'bg-white text-[#783F46] border border-[#783F46] hover:bg-[#D9D1C7]/30'
                      : 'bg-[#783F46] text-white hover:bg-[#623339] shadow-sm'
                  }`}
                >
                  {registeringRole === 'Volunteer' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isVolRegistered ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Registered as Volunteer (Click to Cancel)</span>
                    </>
                  ) : volSlotsLeft <= 0 ? (
                    'Volunteer Slots Full'
                  ) : (
                    'Register as Volunteer'
                  )}
                </button>
              </div>

              {/* Slot Availability Live Counter */}
              <div className="pt-2 text-center text-[11px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60 space-y-1">
                <div>
                  Registration closes 24 hours prior to drive kickoff.
                </div>
                <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">
                  Actual registration data calculated directly from community database.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

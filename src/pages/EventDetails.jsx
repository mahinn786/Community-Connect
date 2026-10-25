import React, { useState } from 'react';
import { DiscussionSection } from '../components/DiscussionSection';
import { EventGalleryModal } from '../components/EventGalleryModal';
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
  Star
} from 'lucide-react';

export const EventDetails = ({
  event,
  onBack,
  onRegisterToggle,
  onShowQR,
  onShowCertificate,
  onAddComment,
  onVerifyAttendance
}) => {
  const { currentUser, activeRole } = useAuth();
  const [showGallery, setShowGallery] = useState(false);

  if (!event) return null;

  const isVolRegistered = event.registeredVolunteers?.includes(currentUser?.id);
  const isPartRegistered = event.registeredParticipants?.includes(currentUser?.id);
  const hasAttended = event.attendedVolunteers?.includes(currentUser?.id) || event.attendedParticipants?.includes(currentUser?.id);
  const isFull = (event.registeredVolunteers?.length || 0) >= event.volunteerLimit;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Back Button & Share Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Drive link copied to clipboard!');
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Share Drive"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Event Card Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg space-y-6">
        
        {/* Banner */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
              {event.category}
            </span>
            {Number(event.registrationFee) > 0 ? (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-600 text-white shadow-md">
                Registration Fee: ₹{event.registrationFee}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500 text-white shadow-md">
                Free Entry
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Organized by <strong className="text-white">{event.organizer}</strong>
              </span>
              {event.rating && (
                <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-0.5 rounded-full text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {event.rating} ({event.feedbacksCount} Feedbacks)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Key Specs */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 uppercase font-semibold text-[10px]">Date & Schedule</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{event.date}</div>
                <div className="text-[11px] text-slate-500">{event.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 uppercase font-semibold text-[10px]">Location</div>
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[180px]">{event.location}</div>
                <div className="text-[11px] text-slate-500">{event.city}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 uppercase font-semibold text-[10px]">Volunteers / Participants</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {event.registeredVolunteers?.length || 0} Vols / {event.registeredParticipants?.length || 0} Parts
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isFull ? 'Limit Reached' : 'Spots Available'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 uppercase font-semibold text-[10px]">2-Tier Fee Structure</div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  Vol: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{Number(event.volunteerFee) > 0 ? `₹${event.volunteerFee}` : 'Free'}</span> | Part: <span className="text-purple-600 dark:text-purple-400 font-extrabold">{Number(event.participantFee) > 0 ? `₹${event.participantFee}` : 'Free'}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Configured by NGO / Organizer
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              About This Drive
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              {!event.isCompleted && (
                <>
                  {event.allowVolunteer !== false && (
                    <button
                      onClick={() => onRegisterToggle(event.id, 'Volunteer')}
                      disabled={isFull && !isVolRegistered}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isVolRegistered
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300'
                          : isFull
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                      }`}
                    >
                      {isVolRegistered ? 'Cancel Volunteer Reg' : isFull ? 'Volunteer Drive Full' : Number(event.volunteerFee) > 0 ? `Register as Volunteer (₹${event.volunteerFee})` : 'Register as Volunteer (Free)'}
                    </button>
                  )}

                  {event.allowParticipant !== false && (
                    <button
                      onClick={() => onRegisterToggle(event.id, 'Participant')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isPartRegistered
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                      }`}
                    >
                      {isPartRegistered ? 'Cancel Participant Reg' : Number(event.participantFee) > 0 ? `Register as Participant (₹${event.participantFee})` : 'Register as Participant (Free)'}
                    </button>
                  )}
                </>
              )}

              {(isVolRegistered || isPartRegistered) && !hasAttended && (
                <button
                  onClick={() => onShowQR(event)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Check-in QR</span>
                </button>
              )}

              {hasAttended && (
                <button
                  onClick={() => onShowCertificate(event)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Download Verified Certificate</span>
                </button>
              )}

              {event.isCompleted && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Image className="w-4 h-4" />
                  <span>View Drive Gallery & AI Summary</span>
                </button>
              )}
            </div>

            {hasAttended && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Attendance Verified (+4 Hrs Logged)
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Community Q&A Section */}
      <DiscussionSection event={event} onAddComment={onAddComment} />

      {/* Gallery Modal */}
      {showGallery && (
        <EventGalleryModal event={event} onClose={() => setShowGallery(false)} />
      )}

    </div>
  );
};

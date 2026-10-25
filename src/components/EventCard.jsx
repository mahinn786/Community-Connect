import React from 'react';
import { Calendar, MapPin, Users, CheckCircle2, QrCode, Tag, Award, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EventCard = ({ event, onSelect, onRegisterToggle, onShowQR, onShowCertificate }) => {
  const { currentUser } = useAuth();
  if (!event) return null;
  
  const isVolRegistered = event.registeredVolunteers?.includes(currentUser?.id);
  const isPartRegistered = event.registeredParticipants?.includes(currentUser?.id);
  const hasAttended = event.attendedVolunteers?.includes(currentUser?.id) || event.attendedParticipants?.includes(currentUser?.id);
  const isFull = (event.registeredVolunteers?.length || 0) >= event.volunteerLimit;
  const percentage = Math.min(100, Math.round(((event.registeredVolunteers?.length || 0) / event.volunteerLimit) * 100));

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Tree Plantation': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Blood Donation': return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Cleanliness Drives': return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'Health Camps': return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      case 'Education': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'Animal Welfare': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Disaster Relief': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Others': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Banner & Badges */}
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          {/* Category & Fee Tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            
            <div className="flex flex-wrap gap-1">
              {Number(event.volunteerFee) > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white shadow-sm">
                  Vol: ₹{event.volunteerFee}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white shadow-sm backdrop-blur-md">
                  Vol: Free
                </span>
              )}

              {Number(event.participantFee) > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-sm">
                  Part: ₹{event.participantFee}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white shadow-sm backdrop-blur-md">
                  Part: Free
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {event.isCompleted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                Active Drive
              </span>
            )}
          </div>

          {/* Organizer overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-medium truncate drop-shadow-md">
              by {event.organizer}
            </span>
            {event.rating && (
              <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                {event.rating}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <h3 
            onClick={() => onSelect(event)}
            className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span className="truncate">{event.city || event.location}</span>
            </div>
          </div>

          {/* Volunteer / Participant Capacity Progress */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-500" />
                Capacity
              </span>
              <span>{event.registeredVolunteers?.length || 0} Vols / {event.registeredParticipants?.length || 0} Parts</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage >= 100 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer with Separate Registration Buttons */}
      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelect(event)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            View Details →
          </button>

          <div className="flex items-center gap-1.5">
            {hasAttended && (
              <button
                onClick={() => onShowCertificate && onShowCertificate(event)}
                className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
                title="Download Participation Certificate"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            )}

            {(isVolRegistered || isPartRegistered) && !hasAttended && !event.isCompleted && (
              <button
                onClick={() => onShowQR && onShowQR(event)}
                className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
                title="Show Attendance QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Action Buttons according to Organizer Choices */}
        {!event.isCompleted && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.allowVolunteer !== false && (
              <button
                onClick={() => onRegisterToggle(event.id, 'Volunteer')}
                disabled={isFull && !isVolRegistered}
                className={`flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                  isVolRegistered
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 hover:bg-rose-200'
                    : isFull
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                {isVolRegistered ? '✓ Volunteer' : isFull ? 'Full' : Number(event.volunteerFee) > 0 ? `Join Vol (₹${event.volunteerFee})` : 'Join as Volunteer'}
              </button>
            )}

            {event.allowParticipant !== false && (
              <button
                onClick={() => onRegisterToggle(event.id, 'Participant')}
                className={`flex-1 min-w-[120px] px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                  isPartRegistered
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 hover:bg-rose-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {isPartRegistered ? '✓ Participant' : Number(event.participantFee) > 0 ? `Join Part (₹${event.participantFee})` : 'Join as Participant'}
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

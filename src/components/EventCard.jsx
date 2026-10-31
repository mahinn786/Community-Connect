import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  UserCheck,
  CheckCircle2,
  Ticket,
  Star,
  Heart,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const EventCard = ({
  event,
  onSelect,
  featured = false
}) => {
  const { currentUser, isEventSaved, toggleSaveEvent } = useAuth();
  if (!event) return null;

  const isVolRegistered = event.registeredVolunteers?.includes(currentUser?.id);
  const isPartRegistered = event.registeredParticipants?.includes(currentUser?.id);
  const isUserRegistered = isVolRegistered || isPartRegistered;

  const volLimit = event.volunteerLimit || 50;
  const volRegisteredCount = event.registeredVolunteers?.length || 0;
  const volSlotsLeft = Math.max(0, volLimit - volRegisteredCount);

  const partLimit = event.participantLimit || 150;
  const partRegisteredCount = event.registeredParticipants?.length || 0;
  const partSlotsLeft = Math.max(0, partLimit - partRegisteredCount);

  const volFee = Number(event.volunteerFee || 0);
  const partFee = Number(event.participantFee !== undefined ? event.participantFee : (event.registrationFee || 0));

  const saved = isEventSaved ? isEventSaved(event.id) : false;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect && onSelect(event)}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#2A2324] rounded-3xl border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle hover:border-[#783F46]/50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div>
        {/* Event Banner */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#D9D1C7]/30">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Ambient shadow gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#342C2D]/85 via-transparent to-black/25" />

          {/* Top Bar on Banner */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            {/* Category Badge */}
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7] dark:border-[#4D4344] shadow-sm">
              {event.category}
            </span>

            {/* Bookmark & Registration Pill */}
            <div className="flex items-center gap-1.5">
              {isUserRegistered && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#783F46] text-white shadow-sm backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-[#D9D1C7]" />
                  {isVolRegistered && isPartRegistered
                    ? 'Attending & Volunteering'
                    : isVolRegistered
                    ? 'Volunteer'
                    : 'Participant'}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveEvent && toggleSaveEvent(event.id);
                }}
                className="p-2 rounded-full bg-[#F6F3EF]/90 dark:bg-[#342C2D]/90 backdrop-blur-md text-[#342C2D] dark:text-[#F6F3EF] hover:text-[#783F46] border border-[#D9D1C7] transition-all shadow-sm"
                title={saved ? 'Remove from saved' : 'Save event'}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${saved ? 'fill-[#783F46] text-[#783F46]' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Bottom Bar on Banner: Organizer & Rating */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
            <span className="font-medium flex items-center gap-1.5 drop-shadow-md truncate max-w-[200px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9D1C7] flex-shrink-0" />
              <span className="truncate">{event.organizer}</span>
            </span>

            {event.rating && (
              <span className="flex items-center gap-1 bg-[#342C2D]/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-[#D9D1C7] border border-[#D9D1C7]/30">
                <Star className="w-3 h-3 fill-[#D9D1C7] text-[#D9D1C7]" />
                {event.rating}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5">
          {/* Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#342C2D] dark:text-[#F6F3EF] group-hover:text-[#783F46] transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Meta Details: Date & Location */}
          <div className="space-y-1.5 text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#783F46] flex-shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}{' '}
                • {event.time || '09:00 AM'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#B59A8C] flex-shrink-0" />
              <span className="truncate">{event.location}, {event.city}</span>
            </div>
          </div>

          {/* Slot Availability Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9D1C7] dark:border-[#4D4344] text-[11px]">
            {/* Participant Slots */}
            <div className="p-2 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D]/50 border border-[#D9D1C7] dark:border-[#4D4344]">
              <div className="flex items-center justify-between text-[#342C2D]/70 dark:text-[#F6F3EF]/70 mb-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Ticket className="w-3 h-3 text-[#783F46]" />
                  Participant:
                </span>
                <span className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                  {partFee > 0 ? `₹${partFee}` : 'Free'}
                </span>
              </div>
              <div className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                {partSlotsLeft > 0 ? (
                  <span className="text-[#783F46] dark:text-[#D9D1C7] font-bold">{partSlotsLeft} slots left</span>
                ) : (
                  <span className="text-[#783F46] font-bold">Filled</span>
                )}
              </div>
            </div>

            {/* Volunteer Slots */}
            <div className="p-2 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D]/50 border border-[#D9D1C7] dark:border-[#4D4344]">
              <div className="flex items-center justify-between text-[#342C2D]/70 dark:text-[#F6F3EF]/70 mb-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <UserCheck className="w-3 h-3 text-[#783F46]" />
                  Volunteer:
                </span>
                <span className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                  {volFee > 0 ? `₹${volFee}` : 'Free'}
                </span>
              </div>
              <div className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                {volSlotsLeft > 0 ? (
                  <span className="text-[#783F46] dark:text-[#D9D1C7] font-bold">{volSlotsLeft} slots left</span>
                ) : (
                  <span className="text-[#783F46] font-bold">Filled</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer CTA bar */}
      <div className="px-5 pb-5 pt-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#783F46] dark:text-[#D9D1C7] flex items-center gap-1 group-hover:gap-2 transition-all">
          View Event Details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>

        {event.isCompleted && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F6F3EF] dark:bg-[#342C2D] text-[#342C2D]/70 dark:text-[#F6F3EF]/70 border border-[#D9D1C7]">
            Completed Drive
          </span>
        )}
      </div>
    </motion.div>
  );
};

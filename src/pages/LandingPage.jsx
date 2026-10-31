import React from 'react';
import { motion } from 'framer-motion';
import { EventCard } from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
  TreePine,
  Search,
  UserCheck,
  Award
} from 'lucide-react';

export const LandingPage = ({
  events = [],
  onSelectEvent,
  onNavigateExplore,
  onNavigateHowItWorks,
  onOpenAuth
}) => {
  const { currentUser, role } = useAuth();

  // Featured events: strictly maximum 3 cards
  const featuredEvents = events.slice(0, 3);

  // Total registrations count for the hero badge
  const totalRegistrations = events.reduce((sum, e) => {
    return sum + (e.registeredVolunteers?.length || 0) + (e.registeredParticipants?.length || 0);
  }, 0);

  return (
    <div className="space-y-16 pb-16">
      
      {/* =========================================================================
          SECTION 1 — HERO
          Retains existing hero layout, typography, animations, and the two clear CTAs.
         ========================================================================= */}
      <section className="relative pt-4 sm:pt-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9D1C7] text-xs font-semibold text-[#783F46] shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#783F46]" />
              <span>Community Impact & Event Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#342C2D] tracking-tight leading-[1.12]">
              Find Your People.{' '}
              <span className="text-[#783F46]">
                Make a Difference.
              </span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="text-base sm:text-lg text-[#342C2D]/80 leading-relaxed max-w-xl font-normal">
              Discover meaningful events, join inspiring communities, and turn your time into something that matters. Participate, volunteer, and track certified social impact.
            </p>

            {/* Two Clear CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary CTA: Explore Events */}
              <button
                onClick={() => onNavigateExplore()}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#783F46] hover:bg-[#623339] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-white" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA: Organize an Event */}
              <button
                onClick={() => {
                  if (currentUser && role === 'Organizer') {
                    onSelectEvent(null, 'organizer-dash');
                  } else {
                    onOpenAuth('organizer', 'signup');
                  }
                }}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-[#783F46] bg-[#F6F3EF] border border-[#783F46] hover:bg-[#D9D1C7]/30 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#783F46]" />
                <span>Organize an Event</span>
              </button>
            </div>

            {/* Credibility badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#342C2D]/70 border-t border-[#D9D1C7]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
                <span>Verified Non-Profits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
                <span>QR Attendance Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
                <span>Verified Impact Certificates</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-subtle border border-[#D9D1C7] bg-white">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=900"
                alt="Community volunteers planting trees"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#342C2D]/90 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#783F46] text-white border border-[#D9D1C7]/30">
                  <TreePine className="w-3.5 h-3.5 text-[#D9D1C7]" />
                  <span>Tree Plantation Drive 2026</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#F6F3EF]">
                  Join 100+ volunteers greening urban cities
                </h3>
                <p className="text-xs text-[#F6F3EF]/80 font-medium">
                  Organized by Green Earth Foundation • Mumbai
                </p>
              </div>
            </div>

            {/* Quick Metric Pill */}
            <div className="absolute -bottom-5 -left-4 sm:left-4 p-4 rounded-2xl bg-white shadow-subtle border border-[#D9D1C7] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#783F46] text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold text-[#342C2D]">
                  {totalRegistrations}+ Active Members
                </div>
                <div className="text-[11px] text-[#342C2D]/60">
                  Volunteering & Attending
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FEATURED EVENTS
          Displays maximum 3 event cards + clear "View All Events" link to /explore.
         ========================================================================= */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#783F46]">
              Featured Opportunities
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#342C2D]">
              Featured Community Events
            </h2>
            <p className="text-xs sm:text-sm text-[#342C2D]/70">
              Discover selected upcoming initiatives looking for enthusiastic attendees and volunteers.
            </p>
          </div>

          <button
            onClick={() => onNavigateExplore()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#783F46] hover:text-[#623339] transition-colors cursor-pointer self-start sm:self-auto py-1"
          >
            <span>View All Events →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              featured={true}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — HOW IT WORKS PREVIEW
          3 simple steps + "Learn How It Works" link to /how-it-works.
         ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle space-y-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D9D1C7] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#783F46]">
              Simple Three-Step Process
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#342C2D]">
              How Community Connect Works
            </h2>
            <p className="text-xs sm:text-sm text-[#342C2D]/70">
              Getting involved and making a verified social impact has never been simpler.
            </p>
          </div>

          <button
            onClick={() => onNavigateHowItWorks()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#783F46] hover:text-[#623339] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Learn How It Works →</span>
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#D9D1C7] text-[#783F46] flex items-center justify-center font-bold text-sm">
              <Search className="w-5 h-5 text-[#783F46]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B59A8C]">Step 01</span>
              <h3 className="font-heading font-bold text-base text-[#342C2D]">
                Discover an Event
              </h3>
            </div>
            <p className="text-xs text-[#342C2D]/80 leading-relaxed font-normal">
              Browse social drives, cleanliness campaigns, and welfare drives across your city.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#D9D1C7] text-[#783F46] flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5 text-[#783F46]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B59A8C]">Step 02</span>
              <h3 className="font-heading font-bold text-base text-[#342C2D]">
                Register or Volunteer
              </h3>
            </div>
            <p className="text-xs text-[#342C2D]/80 leading-relaxed font-normal">
              Choose to attend as a participant or join hands-on as a volunteer. Get an instant QR pass.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#D9D1C7] text-[#783F46] flex items-center justify-center font-bold text-sm">
              <Award className="w-5 h-5 text-[#783F46]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B59A8C]">Step 03</span>
              <h3 className="font-heading font-bold text-base text-[#342C2D]">
                Participate & Make an Impact
              </h3>
            </div>
            <p className="text-xs text-[#342C2D]/80 leading-relaxed font-normal">
              Check in at the venue, earn verified volunteer hours, and receive certificates.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — ORGANIZER CTA
          Compact section inviting organizers to host events with single CTA button.
         ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F6F3EF] text-[#783F46] border border-[#D9D1C7]">
              For Non-Profits, Clubs & Communities
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#342C2D]">
              Bring Your Event to the Community
            </h2>
            <p className="text-xs sm:text-sm text-[#342C2D]/75 leading-relaxed font-normal">
              Manage participant and volunteer capacity with real-time counters, verify attendance on-site with contactless QR scanning, and coordinate meaningful community initiatives.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => {
                if (currentUser && role === 'Organizer') {
                  onSelectEvent(null, 'organizer-dash');
                } else {
                  onOpenAuth('organizer', 'signup');
                }
              }}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#783F46] hover:bg-[#623339] active:scale-[0.98] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Start Organizing</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

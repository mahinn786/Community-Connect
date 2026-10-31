import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Building2,
  Compass,
  Calendar,
  CheckCircle2,
  QrCode,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  FileCheck2,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HowItWorksPage = ({
  onNavigateExplore,
  onOpenAuth,
  onSelectEvent
}) => {
  const { currentUser, role } = useAuth();
  const [activeJourney, setActiveJourney] = useState('participant'); // 'participant' | 'organizer'

  const participantSteps = [
    {
      number: '01',
      title: 'Create a Participant Account',
      description: 'Sign up in seconds to access both attendee passes and hands-on volunteer opportunities from a single unified profile.',
      icon: UserCheck,
      details: 'Personalize your cause preferences such as tree plantation, animal welfare, cleanliness drives, or workshops.'
    },
    {
      number: '02',
      title: 'Explore Events & Campaigns',
      description: 'Search and filter vetted community drives across major cities. Filter by cause, date, location, or slot availability.',
      icon: Compass,
      details: 'View live participant and volunteer slot counters updated in real time directly from organizers.'
    },
    {
      number: '03',
      title: 'Select an Event',
      description: 'Read the full drive description, schedule, venue location on the interactive map, organizer credibility, and community discussions.',
      icon: Calendar,
      details: 'Ask questions directly to organizers in the dedicated event Q&A section before arriving.'
    },
    {
      number: '04',
      title: 'Register as Participant or Volunteer',
      description: 'Choose your desired participation tier. Receive an instant, verifiable digital QR entry pass sent to your account.',
      icon: QrCode,
      details: 'Registration is immediate with no waiting period. Attendee and volunteer passes are held securely on your profile.'
    },
    {
      number: '05',
      title: 'Track Registrations & Impact',
      description: 'Have your pass scanned at the venue check-in. Automatically log certified volunteer hours, unlock achievement badges, and download official certificates.',
      icon: Award,
      details: 'Your participant dashboard maintains an authentic audit log of every community drive you contribute to.'
    }
  ];

  const organizerSteps = [
    {
      number: '01',
      title: 'Create an Organizer Account',
      description: 'Register as an NGO, college social club, or grassroots community leader to unlock the event hosting portal.',
      icon: Building2,
      details: 'Gain access to the Organizer Hub to oversee rosters, capacity limits, and on-site check-in tools.'
    },
    {
      number: '02',
      title: 'Create an Event',
      description: 'Launch a new community drive with an intuitive multi-step form. Choose your cause category and add engaging cover photos.',
      icon: Sparkles,
      details: 'Use built-in AI assistance to auto-suggest relevant tags and write clear drive descriptions.'
    },
    {
      number: '03',
      title: 'Set Dates, Location & Slots',
      description: 'Define your schedule, venue address with coordinates, and independent capacity limits for attendees versus volunteers.',
      icon: SlidersHorizontal,
      details: 'Control whether your drive requires fees or is completely free for participants and volunteers.'
    },
    {
      number: '04',
      title: 'Publish the Event',
      description: 'Go live instantly. Your event becomes discoverable to community members searching for causes in your area.',
      icon: Send,
      details: 'Automated QR codes are generated for your event to facilitate venue admission and contactless check-ins.'
    },
    {
      number: '05',
      title: 'Manage Registrations & Attendance',
      description: 'View real-time participant rosters, scan attendee QR codes on site, adjust capacity limits on the fly, and export registration reports.',
      icon: FileCheck2,
      details: 'Attendance check-ins automatically credit volunteer hours to participants and update community impact statistics.'
    }
  ];

  const currentSteps = activeJourney === 'participant' ? participantSteps : organizerSteps;

  return (
    <div className="space-y-16 pb-20 pt-4 text-left">
      
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9D1C7] text-xs font-semibold text-[#783F46] shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#783F46]" />
          <span>Platform Guide</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#342C2D] tracking-tight">
          How Community Connect Works
        </h1>
        <p className="text-sm sm:text-base text-[#342C2D]/75 leading-relaxed font-normal">
          Whether you are looking to volunteer your time or organize a grassroots movement, our platform ensures a clear, transparent, and rewarding journey from start to finish.
        </p>

        {/* Journey Switcher Tabs */}
        <div className="pt-4 inline-flex p-1.5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm">
          <button
            onClick={() => setActiveJourney('participant')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeJourney === 'participant'
                ? 'bg-[#783F46] text-white shadow-sm'
                : 'text-[#342C2D]/70 hover:text-[#783F46] hover:bg-[#F6F3EF]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>For Participants & Volunteers</span>
          </button>

          <button
            onClick={() => setActiveJourney('organizer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeJourney === 'organizer'
                ? 'bg-[#783F46] text-white shadow-sm'
                : 'text-[#342C2D]/70 hover:text-[#783F46] hover:bg-[#F6F3EF]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>For Event Organizers</span>
          </button>
        </div>
      </motion.div>

      {/* Step by Step Journey Grid */}
      <motion.div
        key={activeJourney}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#D9D1C7]">
          <h2 className="font-heading font-bold text-xl text-[#342C2D]">
            {activeJourney === 'participant' ? 'Participant & Volunteer Journey' : 'Event Organizer Journey'}
          </h2>
          <span className="text-xs font-semibold text-[#B59A8C]">
            {currentSteps.length} Simple Steps
          </span>
        </div>

        <div className="space-y-4">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-white border border-[#D9D1C7] shadow-subtle hover:border-[#783F46]/50 transition-all flex flex-col md:flex-row gap-5 items-start"
              >
                {/* Step badge and icon */}
                <div className="flex items-center gap-3 md:flex-col md:items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#F6F3EF] text-[#783F46] border border-[#D9D1C7]">
                    Step {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-heading font-bold text-base text-[#342C2D]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#342C2D]/85 leading-relaxed font-normal">
                    {step.description}
                  </p>
                  <p className="text-xs text-[#B59A8C] pt-1">
                    {step.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Callout */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle text-center space-y-4">
        <h3 className="font-heading font-bold text-xl text-[#342C2D]">
          {activeJourney === 'participant' ? 'Ready to Join Your First Drive?' : 'Ready to Host Your Community Event?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#342C2D]/75 max-w-xl mx-auto leading-relaxed">
          {activeJourney === 'participant'
            ? 'Browse upcoming community events, register for free or volunteer slots, and start creating meaningful impact today.'
            : 'Join leading community organizers and NGOs using Community Connect to manage attendance and empower volunteers.'}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          {activeJourney === 'participant' ? (
            <>
              <button
                onClick={() => onNavigateExplore()}
                className="px-6 py-3 rounded-2xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Community Events</span>
              </button>
              <button
                onClick={() => onOpenAuth('participant', 'signup')}
                className="px-6 py-3 rounded-2xl bg-[#F6F3EF] border border-[#783F46] text-[#783F46] hover:bg-[#D9D1C7]/30 font-bold text-xs transition-all cursor-pointer"
              >
                Create Participant Account
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  if (currentUser && role === 'Organizer') {
                    onSelectEvent(null, 'organizer-dash');
                  } else {
                    onOpenAuth('organizer', 'signup');
                  }
                }}
                className="px-6 py-3 rounded-2xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Start Organizing</span>
              </button>
              <button
                onClick={() => onNavigateExplore()}
                className="px-6 py-3 rounded-2xl bg-[#F6F3EF] border border-[#783F46] text-[#783F46] hover:bg-[#D9D1C7]/30 font-bold text-xs transition-all cursor-pointer"
              >
                Browse Active Events
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

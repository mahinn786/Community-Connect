import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Target,
  ShieldCheck,
  Users,
  Compass,
  Building2,
  Sparkles,
  ArrowRight,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export const AboutUsPage = ({
  onNavigateExplore,
  onOpenAuth
}) => {
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
          <Heart className="w-3.5 h-3.5 text-[#783F46]" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#342C2D] tracking-tight">
          About Community Connect
        </h1>
        <p className="text-sm sm:text-base text-[#342C2D]/75 leading-relaxed font-normal">
          A platform built to bring people together around shared social causes, bridging grassroots organizers with willing volunteers and community members.
        </p>
      </motion.div>

      {/* Main Narrative: What it is & The Problem We Solve */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* What Community Connect Is */}
        <div className="p-8 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center font-bold">
              <Globe2 className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-xl text-[#342C2D]">
              What Is Community Connect?
            </h2>
            <p className="text-xs sm:text-sm text-[#342C2D]/85 leading-relaxed">
              Community Connect is a centralized community engagement platform. We provide an intuitive environment where non-profit drives, college welfare groups, environmental campaigns, and civic initiatives can publish events and coordinate participants.
            </p>
          </div>
          <div className="pt-2 border-t border-[#D9D1C7] text-xs text-[#B59A8C] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
            <span>Open to participants, volunteers, and verified organizers.</span>
          </div>
        </div>

        {/* The Problem We Aim to Solve */}
        <div className="p-8 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-xl text-[#342C2D]">
              The Problem We Aim to Solve
            </h2>
            <p className="text-xs sm:text-sm text-[#342C2D]/85 leading-relaxed">
              Every day, citizens look for ways to give back but encounter scattered social media notices, unclear registration details, and no proof of volunteer service. Meanwhile, drive hosts struggle with unpredictable attendance and manual paperwork.
            </p>
          </div>
          <div className="pt-2 border-t border-[#D9D1C7] text-xs text-[#B59A8C] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#783F46]" />
            <span>Eliminating fragmentation with verified digital check-ins.</span>
          </div>
        </div>

      </div>

      {/* Mission & Community-Focused Vision */}
      <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#783F46]">
              <Sparkles className="w-4 h-4 text-[#783F46]" />
              <span>Our Mission</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[#342C2D]">
              Empowering Purpose-Driven Action
            </h3>
            <p className="text-xs sm:text-sm text-[#342C2D]/80 leading-relaxed font-normal">
              To make participating in civic initiatives and volunteering accessible, transparent, and verifiable for everyone, regardless of where they live.
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#783F46]">
              <Users className="w-4 h-4 text-[#783F46]" />
              <span>Our Vision</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[#342C2D]">
              Connected, Caring Neighborhoods
            </h3>
            <p className="text-xs sm:text-sm text-[#342C2D]/80 leading-relaxed font-normal">
              A future where every neighborhood has an active, interconnected community tackling environmental restoration, education equality, and civic support together.
            </p>
          </div>

        </div>

        {/* How It Connects Organizers with Volunteers */}
        <div className="pt-6 border-t border-[#D9D1C7] space-y-4">
          <h3 className="font-heading font-bold text-lg text-[#342C2D]">
            How We Bridge Organizers and Participants
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-1.5">
              <h4 className="font-heading font-bold text-xs text-[#342C2D]">Clear Capacity & Roles</h4>
              <p className="text-xs text-[#342C2D]/75 leading-relaxed">
                Separate participant and volunteer quotas so drives never exceed resources.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-1.5">
              <h4 className="font-heading font-bold text-xs text-[#342C2D]">Contactless QR Check-ins</h4>
              <p className="text-xs text-[#342C2D]/75 leading-relaxed">
                Instant venue attendance verification to log hours without paper clipboards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-1.5">
              <h4 className="font-heading font-bold text-xs text-[#342C2D]">Certified Proof of Impact</h4>
              <p className="text-xs text-[#342C2D]/75 leading-relaxed">
                Downloadable verified certificates recognizing real volunteer dedication.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Concise Call to Action */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#D9D1C7] shadow-subtle text-center space-y-4">
        <h3 className="font-heading font-bold text-xl text-[#342C2D]">
          Be Part of the Community
        </h3>
        <p className="text-xs sm:text-sm text-[#342C2D]/75 max-w-lg mx-auto leading-relaxed">
          Find an initiative near you or start organizing your own drive. Every positive action makes an impact.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigateExplore()}
            className="px-6 py-3 rounded-2xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Active Events</span>
          </button>
          <button
            onClick={() => onOpenAuth('participant', 'signup')}
            className="px-6 py-3 rounded-2xl bg-[#F6F3EF] border border-[#783F46] text-[#783F46] hover:bg-[#D9D1C7]/30 font-bold text-xs transition-all cursor-pointer"
          >
            Join Community Connect
          </button>
        </div>
      </div>

    </div>
  );
};

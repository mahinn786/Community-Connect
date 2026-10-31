import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { INITIAL_BADGES } from '../../server/data/seedData.js';
import { Trophy, Medal, Award, Flame, TreePine, Droplets, Clock, Sparkles } from 'lucide-react';

export const LeaderboardPage = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await api.getEvents();
    // Simulate top volunteer ranking
    setVolunteers([
      { id: 'v1', name: 'Aarav Patel', hours: 32, trees: 14, blood: 2, cleanups: 4, badges: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
      { id: 'v2', name: 'Priya Sharma', hours: 28, trees: 11, blood: 3, cleanups: 3, badges: 4, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
      { id: 'v3', name: 'Rohan Verma', hours: 24, trees: 8, blood: 1, cleanups: 5, badges: 3, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
      { id: 'v4', name: 'Ananya Roy', hours: 20, trees: 6, blood: 2, cleanups: 2, badges: 2, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250' }
    ]);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className="rounded-3xl bg-[#783F46] text-[#F6F3EF] p-6 md:p-8 shadow-xl space-y-2 text-center md:text-left border border-[#D9D1C7]/30">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-[#F6F3EF]">
          <Trophy className="w-4 h-4 text-[#D9D1C7] animate-bounce" /> Community Leaderboard & Achievements
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
          Top Volunteer Champions & NGO Leaders
        </h1>
        <p className="text-xs text-[#D9D1C7] max-w-xl">
          Celebrating volunteers who dedicate their time, energy, and passion to social impact initiatives across the nation.
        </p>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Rank 2 */}
        {volunteers[1] && (
          <div className="p-6 rounded-3xl bg-white border border-[#D9D1C7] shadow-md text-center space-y-3 relative order-2 md:order-1 mt-0 md:mt-6">
            <div className="w-8 h-8 rounded-full bg-[#D9D1C7] text-[#342C2D] font-bold text-xs flex items-center justify-center mx-auto absolute -top-4 left-1/2 -translate-x-1/2 border-2 border-white">
              #2
            </div>
            <img src={volunteers[1].avatar} alt={volunteers[1].name} className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-[#D9D1C7]" />
            <h3 className="font-bold text-base text-[#342C2D]">{volunteers[1].name}</h3>
            <div className="text-xs font-bold text-[#783F46]">{volunteers[1].hours} Certified Hours</div>
          </div>
        )}

        {/* Rank 1 */}
        {volunteers[0] && (
          <div className="p-6 rounded-3xl bg-white border-2 border-[#783F46] shadow-xl text-center space-y-3 relative order-1 md:order-2 scale-105">
            <div className="w-10 h-10 rounded-full bg-[#783F46] text-white font-black text-sm flex items-center justify-center mx-auto absolute -top-5 left-1/2 -translate-x-1/2 border-2 border-white shadow-md">
              👑 #1
            </div>
            <img src={volunteers[0].avatar} alt={volunteers[0].name} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-[#783F46] shadow-lg" />
            <h3 className="font-extrabold text-lg text-[#342C2D]">{volunteers[0].name}</h3>
            <div className="text-sm font-extrabold text-[#783F46]">{volunteers[0].hours} Certified Hours</div>
            <div className="text-xs text-[#B59A8C] font-medium">🌲 {volunteers[0].trees} Trees • 🩸 {volunteers[0].blood} Blood Units</div>
          </div>
        )}

        {/* Rank 3 */}
        {volunteers[2] && (
          <div className="p-6 rounded-3xl bg-white border border-[#D9D1C7] shadow-md text-center space-y-3 relative order-3 mt-0 md:mt-8">
            <div className="w-8 h-8 rounded-full bg-[#B59A8C] text-white font-bold text-xs flex items-center justify-center mx-auto absolute -top-4 left-1/2 -translate-x-1/2 border-2 border-white">
              #3
            </div>
            <img src={volunteers[2].avatar} alt={volunteers[2].name} className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-[#B59A8C]" />
            <h3 className="font-bold text-base text-[#342C2D]">{volunteers[2].name}</h3>
            <div className="text-xs font-bold text-[#783F46]">{volunteers[2].hours} Certified Hours</div>
          </div>
        )}

      </div>

      {/* Badges Directory */}
      <div className="p-6 rounded-3xl bg-white border border-[#D9D1C7] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#342C2D] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#783F46]" />
          Volunteer Badges Directory & Criteria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {INITIAL_BADGES.map(b => (
            <div key={b.id} className="p-4 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] flex items-center gap-3">
              <div className="text-3xl p-2 rounded-xl bg-white shadow-sm border border-[#D9D1C7]">{b.icon}</div>
              <div>
                <div className="font-bold text-xs text-[#342C2D]">{b.name}</div>
                <div className="text-[11px] text-[#B59A8C]">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

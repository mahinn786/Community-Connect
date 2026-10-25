import React, { useState } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DiscussionSection = ({ event, onAddComment }) => {
  const { currentUser, activeRole } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await onAddComment(event.id, {
      user: currentUser?.name || 'Volunteer',
      role: activeRole,
      message: message.trim()
    });
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Community Discussion & Q&A
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask questions, coordinate logistics, or connect with drive organizers.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {event?.discussions?.length || 0} Messages
        </span>
      </div>

      {/* Discussion Stream */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {event?.discussions && event.discussions.length > 0 ? (
          event.discussions.map(d => (
            <div
              key={d.id}
              className={`p-3.5 rounded-xl text-xs space-y-1.5 transition-all ${
                d.role === 'Organizer'
                  ? 'bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 ml-4'
                  : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <span>{d.user}</span>
                  {d.role === 'Organizer' && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-teal-600 text-white font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Organizer
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{d.timestamp}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {d.message}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 space-y-1">
            <Sparkles className="w-6 h-6 text-indigo-400 mx-auto opacity-70" />
            <p>No questions yet. Be the first to start the discussion!</p>
          </div>
        )}
      </div>

      {/* Post Box */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <input
          type="text"
          placeholder={`Comment as ${currentUser?.name} (${activeRole})...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>
    </div>
  );
};

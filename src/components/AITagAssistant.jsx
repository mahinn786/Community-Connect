import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Tag } from 'lucide-react';
import { api } from '../utils/api';

export const AITagAssistant = ({ title, category, description, onTagsGenerated }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.suggestTags(title, category, description);
      if (res?.tags) {
        onTagsGenerated(res.tags);
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      )}
      <span>{loading ? 'AI Suggesting...' : 'AI Auto-Suggest Tags'}</span>
    </button>
  );
};

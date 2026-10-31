import React from 'react';
import { X, Image, Sparkles, CheckCircle2 } from 'lucide-react';

export const EventGalleryModal = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342C2D]/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl p-6 bg-white rounded-3xl shadow-2xl border border-[#D9D1C7] space-y-5 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#B59A8C] hover:text-[#342C2D] hover:bg-[#F6F3EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46]">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#342C2D]">
              Post-Drive Photo Gallery & AI Summary
            </h3>
            <p className="text-xs text-[#B59A8C]">
              Photos uploaded by volunteers and organizers for "{event?.title}"
            </p>
          </div>
        </div>

        {/* AI Generated Impact Summary Card */}
        {event?.aiSummary && (
          <div className="p-4 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#783F46]">
              <Sparkles className="w-4 h-4 text-[#783F46]" />
              <span>AI Impact Summary</span>
            </div>
            <p className="text-xs text-[#342C2D]/85 leading-relaxed font-medium">
              {event.aiSummary}
            </p>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {event?.galleryPhotos && event.galleryPhotos.length > 0 ? (
            event.galleryPhotos.map((url, idx) => (
              <div key={idx} className="group relative h-48 rounded-2xl overflow-hidden shadow-md bg-[#F6F3EF] border border-[#D9D1C7]">
                <img
                  src={url}
                  alt={`Gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#342C2D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs font-semibold">
                  <span>Drive Memory #{idx + 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-xs text-[#B59A8C] space-y-2">
              <Image className="w-10 h-10 text-[#D9D1C7] mx-auto" />
              <p>No photos uploaded yet for this drive.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

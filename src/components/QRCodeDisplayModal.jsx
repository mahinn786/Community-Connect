import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, CheckCircle, Copy, Download } from 'lucide-react';

export const QRCodeDisplayModal = ({ event, onClose, isVolunteerView = false }) => {
  const [copied, setCopied] = React.useState(false);

  const qrValue = event ? event.qrCode || `CONNECT-HUB-EVT-${event.id}` : 'CONNECT-HUB-DEMO';

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342C2D]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border border-[#D9D1C7] space-y-5 text-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#B59A8C] hover:text-[#342C2D] hover:bg-[#F6F3EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#342C2D]">
            {isVolunteerView ? 'Your Volunteer Check-in QR' : 'Event Attendance QR Code'}
          </h3>
          <p className="text-xs text-[#B59A8C] max-w-xs">
            {isVolunteerView
              ? 'Present this QR code at the event venue to get your attendance scanned and log volunteer hours.'
              : 'Display this QR code at the venue. Volunteers scan it to log attendance and hours.'}
          </p>
        </div>

        {/* QR Code Canvas Frame */}
        <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#783F46]/40 inline-block shadow-md">
          <QRCodeSVG
            value={qrValue}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=100",
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        {/* Event Title pill */}
        <div className="px-3 py-1.5 rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-xs font-semibold text-[#342C2D] truncate">
          {event?.title}
        </div>

        {/* Manual Code & Copy */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-xs">
          <span className="font-mono text-[#342C2D] truncate max-w-[240px]">
            {qrValue}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#783F46] text-white font-semibold text-[11px] hover:bg-[#623339] transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

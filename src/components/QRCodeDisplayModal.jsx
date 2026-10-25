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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isVolunteerView ? 'Your Volunteer Check-in QR' : 'Event Attendance QR Code'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            {isVolunteerView
              ? 'Present this QR code at the event venue to get your attendance scanned and log volunteer hours.'
              : 'Display this QR code at the venue. Volunteers scan it to log attendance and hours.'}
          </p>
        </div>

        {/* QR Code Canvas Frame */}
        <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-emerald-500/40 inline-block shadow-md">
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
        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
          {event?.title}
        </div>

        {/* Manual Code & Copy */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-[240px]">
            {qrValue}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

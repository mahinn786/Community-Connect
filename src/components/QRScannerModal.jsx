import React, { useState } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QRScannerModal = ({ event, onVerifyAttendance, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulatedScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const codeToTest = event ? event.qrCode : 'CONNECT-HUB-EVT-1-ATTENDANCE-QR';
      handleVerify(codeToTest);
    }, 1500);
  };

  const handleVerify = async (code) => {
    const targetCode = code || manualCode;
    if (!targetCode) return;

    try {
      const res = await onVerifyAttendance(event?.id, targetCode);
      if (res?.success) {
        setStatus('success');
        setMessage('Attendance Verified! +4 Volunteer Hours Logged & Impact Updated.');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setStatus('error');
        setMessage(res?.message || 'Invalid QR Code scanned for this drive.');
      }
    } catch (e) {
      setStatus('error');
      setMessage('Failed to verify attendance. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Attendance Scanner
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scan attendee QR code or simulate instant check-in.
          </p>
        </div>

        {/* Camera Scanner Simulation Viewfinder */}
        <div className="relative w-full h-48 rounded-2xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-2 border-emerald-500/50 shadow-inner">
          {isScanning ? (
            <div className="space-y-3 text-center">
              <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-emerald-400 font-semibold animate-pulse">Scanning Camera Feed...</p>
            </div>
          ) : status === 'success' ? (
            <div className="space-y-2 p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-xs font-bold text-emerald-300">{message}</p>
            </div>
          ) : (
            <div className="space-y-3 text-center p-4">
              <div className="w-32 h-32 border-2 border-dashed border-emerald-500/60 rounded-xl mx-auto flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-emerald-500/80 absolute top-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <button
                onClick={handleSimulatedScan}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Simulate Camera QR Scan
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Fallback */}
        <div className="space-y-2 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Or Enter Attendance Code Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CONNECT-HUB-EVT-1-ATTENDANCE-QR"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={() => handleVerify()}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              Verify <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342C2D]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border border-[#D9D1C7] space-y-5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#B59A8C] hover:text-[#342C2D] hover:bg-[#F6F3EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center shadow-inner">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#342C2D]">
            Attendance Scanner
          </h3>
          <p className="text-xs text-[#B59A8C]">
            Scan attendee QR code or simulate instant check-in.
          </p>
        </div>

        {/* Camera Scanner Simulation Viewfinder */}
        <div className="relative w-full h-48 rounded-2xl bg-[#342C2D] flex flex-col items-center justify-center overflow-hidden border-2 border-[#783F46]/50 shadow-inner">
          {isScanning ? (
            <div className="space-y-3 text-center">
              <div className="w-10 h-10 border-4 border-[#D9D1C7] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#F6F3EF] font-semibold animate-pulse">Scanning Camera Feed...</p>
            </div>
          ) : status === 'success' ? (
            <div className="space-y-2 p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#D9D1C7] mx-auto animate-bounce" />
              <p className="text-xs font-bold text-[#F6F3EF]">{message}</p>
            </div>
          ) : (
            <div className="space-y-3 text-center p-4">
              <div className="w-32 h-32 border-2 border-dashed border-[#D9D1C7]/60 rounded-xl mx-auto flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-[#783F46] absolute top-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <button
                onClick={handleSimulatedScan}
                className="px-4 py-2 rounded-xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-[#D9D1C7]" />
                Simulate Camera QR Scan
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Fallback */}
        <div className="space-y-2 text-left pt-2 border-t border-[#D9D1C7]">
          <label className="text-[11px] font-bold text-[#342C2D] uppercase tracking-wider">
            Or Enter Attendance Code Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CONNECT-HUB-EVT-1-ATTENDANCE-QR"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#342C2D] placeholder-[#B59A8C] focus:outline-none focus:ring-2 focus:ring-[#783F46]/40"
            />
            <button
              onClick={() => handleVerify()}
              className="px-4 py-2 rounded-xl bg-[#783F46] hover:bg-[#623339] text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              Verify <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-xl bg-[#F6F3EF] border border-[#783F46] text-[#783F46] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

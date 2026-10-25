import React, { useRef } from 'react';
import { X, Award, Download, Printer, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';

export const CertificateModal = ({ event, onClose }) => {
  const { currentUser } = useAuth();
  const certRef = useRef(null);

  const certId = `CERT-HUB-${event ? event.id : '101'}-${currentUser ? currentUser.id.slice(-4) : '2026'}`;
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [600, 420]
    });

    // Dark background header bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 600, 60, 'F');

    // Title
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('COMMUNITY CONNECT HUB', 30, 38);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OFFICIAL VOLUNTEER CERTIFICATE OF APPRECIATION', 360, 36);

    // Decorative frame
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(3);
    doc.rect(20, 20, 560, 380);

    // Body Text
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('This is proudly presented to', 300, 110, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(5, 150, 105);
    doc.text(currentUser?.name || 'Aarav Patel', 300, 145, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(`In recognition of outstanding dedication and active volunteer participation in the social impact event:`, 300, 180, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(`"${event?.title || 'Community Social Impact Drive'}"`, 300, 210, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Category: ${event?.category || 'Social Service'}   |   Location: ${event?.city || 'Mumbai'}   |   Hours Logged: 4.0 Hours`, 300, 235, { align: 'center' });

    // Verification Seal Block
    doc.setFillColor(236, 253, 245);
    doc.rect(50, 270, 500, 60, 'F');
    doc.setDrawColor(209, 250, 229);
    doc.rect(50, 270, 500, 60);

    doc.setFontSize(10);
    doc.setTextColor(4, 120, 87);
    doc.text(`Certificate ID: ${certId}`, 70, 292);
    doc.text(`Issue Date: ${issueDate}`, 70, 312);

    doc.text(`Organized by: ${event?.organizer || 'Community Connect Foundation'}`, 340, 292);
    doc.text(`Verified Status: AUTHENTICATED NGO DRIVE`, 340, 312);

    // Signatures
    doc.setLineWidth(1);
    doc.setDrawColor(148, 163, 184);
    doc.line(100, 375, 220, 375);
    doc.line(380, 375, 500, 375);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Event Coordinator', 160, 388, { align: 'center' });
    doc.text('Platform Administrator', 440, 388, { align: 'center' });

    doc.save(`${currentUser?.name || 'Volunteer'}_Certificate.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Participation Certificate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official verified certificate for volunteer hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div 
          ref={certRef}
          className="relative bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-4 border-double border-emerald-500/40 rounded-2xl p-6 md:p-10 text-center space-y-6 shadow-inner overflow-hidden"
        >
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <HeartHandshake className="w-96 h-96 text-emerald-600" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              <ShieldCheck className="w-4 h-4" /> Official Certificate of Appreciation
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Community Connect Hub
            </h2>
          </div>

          {/* Recipient */}
          <div className="space-y-2 py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">This Certificate is Proudly Awarded To</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wide underline decoration-emerald-400/50 decoration-2 underline-offset-8">
              {currentUser?.name || 'Aarav Patel'}
            </h1>
          </div>

          {/* Achievement text */}
          <div className="max-w-xl mx-auto space-y-2">
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              In recognition of exceptional voluntary service and dedicated contribution during the community drive:
            </p>
            <div className="text-sm md:text-lg font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 inline-block shadow-sm">
              "{event?.title || 'Mega Social Impact Drive'}"
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto py-2 text-xs">
            <div className="p-2 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Category</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300 truncate">{event?.category}</div>
            </div>
            <div className="p-2 rounded-xl bg-teal-100/60 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Hours Logged</div>
              <div className="font-bold text-teal-700 dark:text-teal-300">4.0 Hours</div>
            </div>
            <div className="p-2 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Location</div>
              <div className="font-bold text-indigo-700 dark:text-indigo-300 truncate">{event?.city || 'Mumbai'}</div>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-left gap-4">
            <div className="text-[11px] space-y-0.5 text-slate-500 dark:text-slate-400">
              <div><span className="font-semibold text-slate-700 dark:text-slate-300">Certificate ID:</span> {certId}</div>
              <div><span className="font-semibold text-slate-700 dark:text-slate-300">Issue Date:</span> {issueDate}</div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified by NGO & Platform Authority
              </div>
            </div>

            {/* Gold Seal Graphic */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex flex-col items-center justify-center shadow-lg text-slate-950 font-bold border-2 border-white text-[9px] uppercase tracking-wider">
              <span>Verified</span>
              <Award className="w-5 h-5 text-slate-900" />
              <span>Impact</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

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

    // Dark background header bar (Espresso Charcoal)
    doc.setFillColor(52, 44, 45);
    doc.rect(0, 0, 600, 60, 'F');

    // Title (Warm Ivory & Deep Burgundy)
    doc.setTextColor(246, 243, 239);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('COMMUNITY CONNECT', 30, 38);

    doc.setTextColor(217, 209, 199);
    doc.setFontSize(10);
    doc.text('OFFICIAL VOLUNTEER CERTIFICATE OF APPRECIATION', 340, 36);

    // Decorative frame (Deep Burgundy)
    doc.setDrawColor(120, 63, 70);
    doc.setLineWidth(3);
    doc.rect(20, 20, 560, 380);

    // Body Text
    doc.setTextColor(52, 44, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('This is proudly presented to', 300, 110, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(120, 63, 70);
    doc.text(currentUser?.name || 'Aarav Patel', 300, 145, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(181, 154, 140);
    doc.text(`In recognition of outstanding dedication and active volunteer participation in the social impact event:`, 300, 180, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(52, 44, 45);
    doc.text(`"${event?.title || 'Community Social Impact Drive'}"`, 300, 210, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Category: ${event?.category || 'Social Service'}   |   Location: ${event?.city || 'Mumbai'}   |   Hours Logged: 4.0 Hours`, 300, 235, { align: 'center' });

    // Verification Seal Block (Warm Ivory with Stone Beige border)
    doc.setFillColor(246, 243, 239);
    doc.rect(50, 270, 500, 60, 'F');
    doc.setDrawColor(217, 209, 199);
    doc.rect(50, 270, 500, 60);

    doc.setFontSize(10);
    doc.setTextColor(120, 63, 70);
    doc.text(`Certificate ID: ${certId}`, 70, 292);
    doc.text(`Issue Date: ${issueDate}`, 70, 312);

    doc.text(`Organized by: ${event?.organizer || 'Community Connect Foundation'}`, 340, 292);
    doc.text(`Verified Status: AUTHENTICATED NGO DRIVE`, 340, 312);

    // Signatures
    doc.setLineWidth(1);
    doc.setDrawColor(217, 209, 199);
    doc.line(100, 375, 220, 375);
    doc.line(380, 375, 500, 375);

    doc.setFontSize(9);
    doc.setTextColor(181, 154, 140);
    doc.text('Event Coordinator', 160, 388, { align: 'center' });
    doc.text('Platform Administrator', 440, 388, { align: 'center' });

    doc.save(`${currentUser?.name || 'Volunteer'}_Certificate.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342C2D]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#D9D1C7] p-6 md:p-8 space-y-6">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-[#D9D1C7] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#783F46] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#342C2D]">
                Participation Certificate
              </h3>
              <p className="text-xs text-[#B59A8C]">
                Official verified certificate for volunteer hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 px-3 rounded-xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#342C2D] hover:bg-[#D9D1C7]/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4 text-[#783F46]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-[#783F46] hover:bg-[#623339] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#B59A8C] hover:text-[#342C2D] hover:bg-[#F6F3EF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div 
          ref={certRef}
          className="relative bg-[#F6F3EF] border-4 border-double border-[#783F46]/50 rounded-2xl p-6 md:p-10 text-center space-y-6 shadow-inner overflow-hidden"
        >
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <HeartHandshake className="w-96 h-96 text-[#783F46]" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#783F46] uppercase">
              <ShieldCheck className="w-4 h-4" /> Official Certificate of Appreciation
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#342C2D]">
              Community Connect
            </h2>
          </div>

          {/* Recipient */}
          <div className="space-y-2 py-2">
            <p className="text-xs text-[#B59A8C] font-medium">This Certificate is Proudly Awarded To</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#783F46] tracking-wide underline decoration-[#B59A8C] decoration-2 underline-offset-8">
              {currentUser?.name || 'Aarav Patel'}
            </h1>
          </div>

          {/* Achievement text */}
          <div className="max-w-xl mx-auto space-y-2">
            <p className="text-xs md:text-sm text-[#342C2D]/80 leading-relaxed">
              In recognition of exceptional voluntary service and dedicated contribution during the community drive:
            </p>
            <div className="text-sm md:text-lg font-bold text-[#342C2D] bg-white px-4 py-2 rounded-xl border border-[#D9D1C7] inline-block shadow-sm">
              "{event?.title || 'Mega Social Impact Drive'}"
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto py-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-[#D9D1C7]">
              <div className="text-[10px] text-[#B59A8C] uppercase font-semibold">Category</div>
              <div className="font-bold text-[#342C2D] truncate">{event?.category}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#D9D1C7]">
              <div className="text-[10px] text-[#B59A8C] uppercase font-semibold">Hours Logged</div>
              <div className="font-bold text-[#783F46]">4.0 Hours</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#D9D1C7]">
              <div className="text-[10px] text-[#B59A8C] uppercase font-semibold">Location</div>
              <div className="font-bold text-[#342C2D] truncate">{event?.city || 'Mumbai'}</div>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="pt-4 border-t border-[#D9D1C7] flex flex-col md:flex-row items-center justify-between text-left gap-4">
            <div className="text-[11px] space-y-0.5 text-[#B59A8C]">
              <div><span className="font-semibold text-[#342C2D]">Certificate ID:</span> {certId}</div>
              <div><span className="font-semibold text-[#342C2D]">Issue Date:</span> {issueDate}</div>
              <div className="flex items-center gap-1 text-[#783F46] font-semibold text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified by NGO & Platform Authority
              </div>
            </div>

            {/* Seal Graphic */}
            <div className="w-16 h-16 rounded-full bg-[#783F46] flex flex-col items-center justify-center shadow-lg text-white font-bold border-2 border-[#D9D1C7] text-[9px] uppercase tracking-wider">
              <span>Verified</span>
              <Award className="w-5 h-5 text-[#F6F3EF]" />
              <span>Impact</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3
} from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const data = await api.getAdminMetrics();
    setMetrics(data || {});
    setLoading(false);
  };

  const handleVerifyOrg = async (orgId, status) => {
    // API call or local update
    if (metrics?.organizations) {
      const updated = metrics.organizations.map(o => o.id === orgId ? { ...o, status } : o);
      setMetrics({ ...metrics, organizations: updated });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#783F46] text-white p-6 md:p-8 shadow-xl space-y-2 border border-[#D9D1C7]/30">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-[#F6F3EF]">
          <ShieldCheck className="w-4 h-4 text-[#D9D1C7]" /> Platform Security & Verification Board
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
          Admin Governance Portal
        </h1>
        <p className="text-xs text-[#D9D1C7] max-w-2xl">
          Review NGO registration documents, verify college social clubs, approve pending community events, and moderate content reports.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm space-y-1">
          <div className="text-xs text-[#B59A8C] font-semibold uppercase">Total Drives Managed</div>
          <div className="text-3xl font-extrabold text-[#342C2D]">{metrics?.totalEvents || 6}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm space-y-1">
          <div className="text-xs text-[#B59A8C] font-semibold uppercase">Total Active Volunteers</div>
          <div className="text-3xl font-extrabold text-[#783F46]">{metrics?.totalVolunteers || 142}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm space-y-1">
          <div className="text-xs text-[#B59A8C] font-semibold uppercase">Total Volunteer Hours</div>
          <div className="text-3xl font-extrabold text-[#342C2D]">{metrics?.totalHoursLogged || 860} Hrs</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#D9D1C7] shadow-sm space-y-1">
          <div className="text-xs text-[#B59A8C] font-semibold uppercase">Pending Verification Requests</div>
          <div className="text-3xl font-extrabold text-[#783F46]">{metrics?.pendingOrgs || 1}</div>
        </div>
      </div>

      {/* NGO / Organization Verification Queue */}
      <div className="bg-white p-6 rounded-3xl border border-[#D9D1C7] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#342C2D] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#783F46]" />
            Organization Verification Queue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D9D1C7] text-[#B59A8C] uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Organization Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Lead Representative</th>
                <th className="py-3 px-3">Verification Proof</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D1C7] font-medium">
              {(metrics?.organizations || []).map(org => (
                <tr key={org.id} className="hover:bg-[#F6F3EF]/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#342C2D]">{org.name}</td>
                  <td className="py-3.5 px-3 text-[#342C2D]/80">{org.type}</td>
                  <td className="py-3.5 px-3 text-[#342C2D]/80">{org.leader}</td>
                  <td className="py-3.5 px-3 font-mono text-[#783F46] text-[11px] underline">
                    {org.documentsUrl}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      org.status === 'Verified'
                        ? 'bg-[#F6F3EF] border-[#D9D1C7] text-[#783F46]'
                        : 'bg-[#F6F3EF] border-[#B59A8C] text-[#342C2D]'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-1.5">
                    {org.status !== 'Verified' && (
                      <button
                        onClick={() => handleVerifyOrg(org.id, 'Verified')}
                        className="px-3 py-1 rounded-xl bg-[#783F46] hover:bg-[#623339] text-white font-bold transition-colors shadow-sm"
                      >
                        Approve & Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

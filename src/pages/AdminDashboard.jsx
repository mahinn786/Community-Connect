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
      <div className="rounded-3xl bg-gradient-to-r from-indigo-800 via-purple-800 to-slate-900 text-white p-6 md:p-8 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-300">
          <ShieldCheck className="w-4 h-4" /> Platform Security & Verification Board
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Admin Governance Portal
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          Review NGO registration documents, verify college social clubs, approve pending community events, and moderate content reports.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Drives Managed</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics?.totalEvents || 6}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Active Volunteers</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics?.totalVolunteers || 142}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Volunteer Hours</div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{metrics?.totalHoursLogged || 860} Hrs</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Pending Verification Requests</div>
          <div className="text-3xl font-extrabold text-amber-500">{metrics?.pendingOrgs || 1}</div>
        </div>
      </div>

      {/* NGO / Organization Verification Queue */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Organization Verification Queue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Organization Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Lead Representative</th>
                <th className="py-3 px-3">Verification Proof</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {(metrics?.organizations || []).map(org => (
                <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">{org.name}</td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{org.type}</td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{org.leader}</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 text-[11px] underline">
                    {org.documentsUrl}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      org.status === 'Verified'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-1.5">
                    {org.status !== 'Verified' && (
                      <button
                        onClick={() => handleVerifyOrg(org.id, 'Verified')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
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

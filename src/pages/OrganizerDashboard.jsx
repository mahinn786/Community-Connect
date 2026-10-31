import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { exportVolunteerListToCSV } from '../utils/exportCsv';
import { AITagAssistant } from '../components/AITagAssistant';
import { INITIAL_CATEGORIES, INITIAL_USERS } from '../../server/data/seedData.js';
import {
  Plus,
  Building2,
  Calendar,
  MapPin,
  Users,
  QrCode,
  Download,
  CheckCircle2,
  Trash2,
  Edit,
  Sparkles,
  Image,
  Star,
  Check,
  X,
  Eye,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Send,
  Ticket,
  UserCheck
} from 'lucide-react';

export const OrganizerDashboard = ({ onOpenQRScanner, onShowQRDisplay }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [viewRegistrationsEvent, setViewRegistrationsEvent] = useState(null);
  const [managingSlotsEvent, setManagingSlotsEvent] = useState(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState('');

  // Create / Edit Event Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Tree Plantation',
    date: '2026-08-30',
    time: '09:00 AM - 01:00 PM',
    location: '',
    city: 'Mumbai',
    volunteerLimit: 50,
    participantLimit: 150,
    allowVolunteer: true,
    allowParticipant: true,
    volunteerFee: 0,
    participantFee: 0,
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    tags: []
  });

  // Slots management quick state
  const [editVolLimit, setEditVolLimit] = useState(50);
  const [editPartLimit, setEditPartLimit] = useState(150);

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadOrganizerEvents = async () => {
    setLoading(true);
    const data = await api.getEvents();
    setEvents(data || []);
    setLoading(false);
  };

  // Overview Statistics Calculations
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => !e.isCompleted).length;
  const participantRegCount = events.reduce((sum, e) => sum + (e.registeredParticipants?.length || 0), 0);
  const volunteerRegCount = events.reduce((sum, e) => sum + (e.registeredVolunteers?.length || 0), 0);
  const totalRegistrations = participantRegCount + volunteerRegCount;

  // Open Edit Modal
  const handleEditClick = (evt) => {
    setEditingEvent(evt);
    setForm({
      title: evt.title || '',
      category: evt.category || 'Tree Plantation',
      date: evt.date || '2026-08-30',
      time: evt.time || '09:00 AM - 01:00 PM',
      location: evt.location || '',
      city: evt.city || 'Mumbai',
      volunteerLimit: evt.volunteerLimit || 50,
      participantLimit: evt.participantLimit || 150,
      allowVolunteer: evt.allowVolunteer !== false,
      allowParticipant: evt.allowParticipant !== false,
      volunteerFee: evt.volunteerFee || 0,
      participantFee: evt.participantFee !== undefined ? evt.participantFee : (evt.registrationFee || 0),
      description: evt.description || '',
      bannerUrl: evt.bannerUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
      tags: evt.tags || []
    });
    setShowCreateModal(true);
  };

  // Open Manage Slots Modal
  const handleOpenSlots = (evt) => {
    setManagingSlotsEvent(evt);
    setEditVolLimit(evt.volunteerLimit || 50);
    setEditPartLimit(evt.participantLimit || 150);
  };

  // Save Slots update
  const handleSaveSlots = async () => {
    if (!managingSlotsEvent) return;
    await api.updateEvent(managingSlotsEvent.id, {
      volunteerLimit: Number(editVolLimit),
      participantLimit: Number(editPartLimit)
    });
    setEvents(prev => prev.map(e => (e.id === managingSlotsEvent.id ? { ...e, volunteerLimit: Number(editVolLimit), participantLimit: Number(editPartLimit) } : e)));
    setManagingSlotsEvent(null);
    showToast(`Capacity slots updated for "${managingSlotsEvent.title}"!`);
  };

  // Toggle Publish / Unpublish status
  const handleTogglePublish = async (evt) => {
    const nextStatus = evt.status === 'Draft' ? 'Approved' : 'Draft';
    await api.updateEvent(evt.id, { status: nextStatus });
    setEvents(prev => prev.map(e => e.id === evt.id ? { ...e, status: nextStatus } : e));
    showToast(`Event status updated to ${nextStatus === 'Approved' ? 'Published' : 'Draft'}`);
  };

  // Create / Update Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    const volFeeVal = Number(form.volunteerFee || 0);
    const partFeeVal = Number(form.participantFee || 0);

    const payload = {
      ...form,
      allowVolunteer: form.allowVolunteer !== false,
      allowParticipant: form.allowParticipant !== false,
      volunteerFee: volFeeVal,
      hasVolunteerFee: volFeeVal > 0,
      participantFee: partFeeVal,
      hasParticipantFee: partFeeVal > 0,
      registrationFee: partFeeVal,
      volunteerLimit: Number(form.volunteerLimit) || 50,
      participantLimit: Number(form.participantLimit) || 150,
      organizer: currentUser?.name || 'Green Earth Foundation',
      organizerId: currentUser?.id || 'u-organizer-1',
      status: 'Approved'
    };

    if (editingEvent) {
      await api.updateEvent(editingEvent.id, payload);
      setEvents(prev => prev.map(ev => (ev.id === editingEvent.id ? { ...ev, ...payload } : ev)));
      showToast('Drive updated successfully!');
    } else {
      const created = await api.createEvent(payload);
      if (created) {
        setEvents(prev => [created, ...prev]);
        showToast('New community drive published successfully!');
      }
    }

    setShowCreateModal(false);
    setEditingEvent(null);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    await api.deleteEvent(deletingEvent.id);
    setEvents(prev => prev.filter(e => e.id !== deletingEvent.id));
    showToast(`Event "${deletingEvent.title}" deleted.`);
    setDeletingEvent(null);
  };

  // CSV Export for event registrations
  const handleExportCSV = (evt) => {
    const volunteerList = (evt.registeredVolunteers || []).map((uid, idx) => {
      const found = INITIAL_USERS.find(u => u.id === uid);
      return {
        id: uid,
        name: found?.name || `Volunteer ${idx + 1}`,
        email: found?.email || `volunteer${idx + 1}@example.com`,
        phone: '+91 98765 43210',
        role: 'Volunteer',
        registrationDate: evt.date,
        attended: evt.attendedVolunteers?.includes(uid) ? 'Yes' : 'No'
      };
    });

    const participantList = (evt.registeredParticipants || []).map((uid, idx) => {
      const found = INITIAL_USERS.find(u => u.id === uid);
      return {
        id: uid,
        name: found?.name || `Participant ${idx + 1}`,
        email: found?.email || `participant${idx + 1}@example.com`,
        phone: '+91 91234 56789',
        role: 'Participant',
        registrationDate: evt.date,
        attended: evt.attendedParticipants?.includes(uid) ? 'Yes' : 'No'
      };
    });

    const combined = [...volunteerList, ...participantList];
    exportVolunteerListToCSV(evt.title, combined);
    showToast('Registration list exported to CSV!');
  };

  return (
    <div className="space-y-8 pb-20 text-left">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#342C2D] text-[#F6F3EF] shadow-2xl border border-[#D9D1C7] text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#D9D1C7] flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner (Dark section using Deep Burgundy per spec) */}
      <div className="rounded-3xl bg-[#783F46] text-[#F6F3EF] p-6 sm:p-8 shadow-subtle relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#D9D1C7]/40 shadow-sm"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#F6F3EF]/15 text-[#F6F3EF] border border-[#F6F3EF]/20">
                <Building2 className="w-3 h-3 text-[#D9D1C7]" />
                <span>Verified Event Organizer Portal</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F6F3EF]">
                {currentUser?.name || 'Green Earth Foundation'}
              </h1>
              <p className="text-xs text-[#F6F3EF]/85">
                Manage drives, track registrations, verify attendance, and monitor community impact.
              </p>
            </div>
          </div>

          {/* Create Drive Primary CTA (White text with darker burgundy hover) */}
          <button
            onClick={() => {
              setEditingEvent(null);
              setForm({
                title: '',
                category: 'Tree Plantation',
                date: '2026-08-30',
                time: '09:00 AM - 01:00 PM',
                location: '',
                city: 'Mumbai',
                volunteerLimit: 50,
                participantLimit: 150,
                allowVolunteer: true,
                allowParticipant: true,
                volunteerFee: 0,
                participantFee: 0,
                description: '',
                bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
                tags: []
              });
              setShowCreateModal(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-[#783F46] bg-[#F6F3EF] hover:bg-[#D9D1C7]/30 border border-[#D9D1C7] active:scale-[0.98] shadow-sm transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-[#783F46]" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
            <span className="text-xs font-semibold">Total Events</span>
            <Building2 className="w-4 h-4 text-[#783F46]" />
          </div>
          <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">{totalEvents}</div>
          <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">In organizer catalog</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
            <span className="text-xs font-semibold">Upcoming</span>
            <Calendar className="w-4 h-4 text-[#783F46]" />
          </div>
          <div className="text-2xl font-black text-[#783F46] dark:text-[#D9D1C7]">{upcomingEvents}</div>
          <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">Active community drives</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
            <span className="text-xs font-semibold">Total Signups</span>
            <Users className="w-4 h-4 text-[#783F46]" />
          </div>
          <div className="text-2xl font-black text-[#342C2D] dark:text-[#F6F3EF]">{totalRegistrations}</div>
          <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">Participants & Volunteers</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
            <span className="text-xs font-semibold">Participants</span>
            <Ticket className="w-4 h-4 text-[#783F46]" />
          </div>
          <div className="text-2xl font-black text-[#783F46] dark:text-[#D9D1C7]">{participantRegCount}</div>
          <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">Attendee registrations</div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
            <span className="text-xs font-semibold">Volunteers</span>
            <UserCheck className="w-4 h-4 text-[#783F46]" />
          </div>
          <div className="text-2xl font-black text-[#783F46] dark:text-[#D9D1C7]">{volunteerRegCount}</div>
          <div className="text-[10px] text-[#342C2D]/50 dark:text-[#F6F3EF]/50">Volunteer registrations</div>
        </div>
      </div>

      {/* Event Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
              Manage Events & Registrations
            </h3>
            <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              Publish, edit, manage capacity limits, verify attendee check-ins, and export CSV attendee rosters.
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-subtle">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F6F3EF] dark:bg-[#342C2D] border-b border-[#D9D1C7] dark:border-[#4D4344] text-[11px] font-bold text-[#342C2D] dark:text-[#F6F3EF] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Event Details</th>
                <th className="py-3.5 px-4">Date & City</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Participant Capacity</th>
                <th className="py-3.5 px-4">Volunteer Capacity</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D1C7] dark:divide-[#4D4344]">
              {events.map((evt) => {
                const isPublished = evt.status !== 'Draft';
                const partCount = evt.registeredParticipants?.length || 0;
                const partLimitVal = evt.participantLimit || 150;
                const volCount = evt.registeredVolunteers?.length || 0;
                const volLimitVal = evt.volunteerLimit || 50;

                return (
                  <tr key={evt.id} className="hover:bg-[#F6F3EF]/50 dark:hover:bg-[#342C2D]/30 transition-colors">
                    {/* Event Banner & Title */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[#D9D1C7]"
                        />
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF] line-clamp-1 max-w-[200px]">
                            {evt.title}
                          </div>
                          <span className="inline-block text-[10px] font-semibold text-[#783F46] dark:text-[#D9D1C7]">
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & City */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">{evt.city}</div>
                    </td>

                    {/* Status with Publish Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(evt)}
                        title="Click to toggle Published/Draft"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          evt.isCompleted
                            ? 'bg-[#D9D1C7]/30 text-[#342C2D] dark:text-[#F6F3EF] border border-[#D9D1C7]'
                            : isPublished
                            ? 'bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#783F46]'
                            : 'bg-[#D9D1C7]/40 text-[#342C2D] border border-[#D9D1C7]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-[#783F46]' : 'bg-[#B59A8C]'}`} />
                        <span>{evt.isCompleted ? 'Completed' : isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Participant Capacity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                        {partCount} / {partLimitVal}
                      </div>
                      <div className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                        {Math.max(0, partLimitVal - partCount)} open
                      </div>
                    </td>

                    {/* Volunteer Capacity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                        {volCount} / {volLimitVal}
                      </div>
                      <div className="text-[10px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
                        {Math.max(0, volLimitVal - volCount)} open
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Registrations & Export CSV */}
                        <button
                          onClick={() => setViewRegistrationsEvent(evt)}
                          title="View attendee registrations"
                          className="p-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] hover:text-[#783F46] transition-colors"
                        >
                          <Users className="w-4 h-4" />
                        </button>

                        {/* Manage Capacity Slots */}
                        <button
                          onClick={() => handleOpenSlots(evt)}
                          title="Manage capacity slots"
                          className="p-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] hover:text-[#783F46] transition-colors"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        {/* Scanner for check-ins */}
                        <button
                          onClick={() => onOpenQRScanner && onOpenQRScanner(evt)}
                          title="Open QR scanner for check-in"
                          className="p-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] hover:text-[#783F46] transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(evt)}
                          title="Edit drive details"
                          className="p-2 rounded-xl text-[#342C2D] dark:text-[#F6F3EF] hover:bg-[#F6F3EF] hover:text-[#783F46] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete with confirmation dialog */}
                        <button
                          onClick={() => setDeletingEvent(evt)}
                          title="Delete drive"
                          className="p-2 rounded-xl text-[#783F46] hover:bg-[#783F46]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create / Edit Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#2A2324] rounded-3xl border border-[#D9D1C7] dark:border-[#4D4344] shadow-premium overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[#D9D1C7] dark:border-[#4D4344] flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
                    {editingEvent ? 'Edit Community Drive' : 'Create New Community Event'}
                  </h3>
                  <p className="text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60">Fill in the event details and configure participant & volunteer options.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-full text-[#342C2D]/50 hover:text-[#783F46]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Drive Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clean Shorelines Initiative 2026"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-sm font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                  />
                </div>

                {/* Category & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                    >
                      {INITIAL_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Date</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Time Window</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 09:00 AM - 01:00 PM"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Venue / Location Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 4 Central Park, Main Avenue"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                  />
                </div>

                {/* Capacity Limits & Fees (Participant & Volunteer) */}
                <div className="p-4 rounded-2xl bg-[#F6F3EF] dark:bg-[#342C2D]/50 border border-[#D9D1C7] dark:border-[#4D4344] space-y-3">
                  <span className="font-bold text-[#342C2D] dark:text-[#F6F3EF] block">
                    Capacity Limits & Registration Pricing
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#342C2D]/70 dark:text-[#F6F3EF]/70">Participant Slots Limit</label>
                      <input
                        type="number"
                        min="1"
                        value={form.participantLimit}
                        onChange={(e) => setForm({ ...form, participantLimit: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] font-medium text-[#342C2D] dark:text-[#F6F3EF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#342C2D]/70 dark:text-[#F6F3EF]/70">Participant Fee (₹, 0 for free)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.participantFee}
                        onChange={(e) => setForm({ ...form, participantFee: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] font-medium text-[#342C2D] dark:text-[#F6F3EF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#342C2D]/70 dark:text-[#F6F3EF]/70">Volunteer Slots Limit</label>
                      <input
                        type="number"
                        min="1"
                        value={form.volunteerLimit}
                        onChange={(e) => setForm({ ...form, volunteerLimit: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] font-medium text-[#342C2D] dark:text-[#F6F3EF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#342C2D]/70 dark:text-[#F6F3EF]/70">Volunteer Fee (₹, 0 for free)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.volunteerFee}
                        onChange={(e) => setForm({ ...form, volunteerFee: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] font-medium text-[#342C2D] dark:text-[#F6F3EF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Description & Volunteer Tasks</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what the drive entails and what attendees/volunteers should bring..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                  />
                </div>

                {/* Banner URL */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">Banner Image URL</label>
                  <input
                    type="url"
                    value={form.bannerUrl}
                    onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] font-medium text-[#342C2D] dark:text-[#F6F3EF] focus:outline-none focus:ring-1 focus:ring-[#783F46]"
                  />
                </div>

                {/* AI Tag Assistant */}
                <div className="pt-2">
                  <AITagAssistant
                    title={form.title}
                    category={form.category}
                    description={form.description}
                    onTagsSelected={(tags) => setForm({ ...form, tags })}
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#D9D1C7] dark:border-[#4D4344]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#D9D1C7] font-semibold text-[#342C2D] dark:text-[#F6F3EF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#783F46] text-white font-bold hover:bg-[#623339] shadow-sm cursor-pointer"
                  >
                    {editingEvent ? 'Save Changes' : 'Publish Drive'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingEvent(null)}
              className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#783F46]/40 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#783F46]/10 text-[#783F46] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-[#342C2D] dark:text-[#F6F3EF]">
                  Delete Event Confirmation
                </h3>
                <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                  Are you sure you want to permanently delete <strong>"{deletingEvent.title}"</strong>? This will remove all registration passes and event data.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingEvent(null)}
                  className="px-4 py-2 rounded-xl border border-[#D9D1C7] text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-[#783F46] text-white text-xs font-bold hover:bg-[#623339] shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Manage Capacity Slots Modal */}
      <AnimatePresence>
        {managingSlotsEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setManagingSlotsEvent(null)}
              className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-premium z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#D9D1C7]">
                <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                  Manage Capacity Slots
                </h3>
                <button onClick={() => setManagingSlotsEvent(null)} className="text-[#342C2D]/40">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                Adjust total allowed slots for "{managingSlotsEvent.title}".
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                    Participant Slots Limit
                  </label>
                  <input
                    type="number"
                    min={managingSlotsEvent.registeredParticipants?.length || 1}
                    value={editPartLimit}
                    onChange={(e) => setEditPartLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] font-bold text-[#342C2D] dark:text-[#F6F3EF]"
                  />
                  <div className="text-[10px] text-[#342C2D]/50">
                    Currently registered: {managingSlotsEvent.registeredParticipants?.length || 0}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                    Volunteer Slots Limit
                  </label>
                  <input
                    type="number"
                    min={managingSlotsEvent.registeredVolunteers?.length || 1}
                    value={editVolLimit}
                    onChange={(e) => setEditVolLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] font-bold text-[#342C2D] dark:text-[#F6F3EF]"
                  />
                  <div className="text-[10px] text-[#342C2D]/50">
                    Currently registered: {managingSlotsEvent.registeredVolunteers?.length || 0}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setManagingSlotsEvent(null)}
                  className="px-3 py-2 rounded-xl border border-[#D9D1C7] text-[#342C2D] dark:text-[#F6F3EF] font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlots}
                  className="px-4 py-2 rounded-xl bg-[#783F46] text-white font-bold hover:bg-[#623339] shadow-sm"
                >
                  Save Slots
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: View Registrations & Export CSV */}
      <AnimatePresence>
        {viewRegistrationsEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewRegistrationsEvent(null)}
              className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl p-6 rounded-3xl bg-white dark:bg-[#2A2324] border border-[#D9D1C7] dark:border-[#4D4344] shadow-premium z-10 space-y-4 max-h-[85vh] flex flex-col text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D1C7]">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#342C2D] dark:text-[#F6F3EF]">
                    Registrations Roster
                  </h3>
                  <p className="text-[11px] text-[#342C2D]/60 dark:text-[#F6F3EF]/60">{viewRegistrationsEvent.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV(viewRegistrationsEvent)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#783F46] text-white font-bold text-[11px] hover:bg-[#623339] shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button onClick={() => setViewRegistrationsEvent(null)} className="text-[#342C2D]/50">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7]">
                  <div className="text-[10px] text-[#342C2D]/60 font-semibold uppercase">Participants</div>
                  <div className="text-lg font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                    {viewRegistrationsEvent.registeredParticipants?.length || 0} Registered
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7]">
                  <div className="text-[10px] text-[#342C2D]/60 font-semibold uppercase">Volunteers</div>
                  <div className="text-lg font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                    {viewRegistrationsEvent.registeredVolunteers?.length || 0} Registered
                  </div>
                </div>
              </div>

              {/* Attendees List */}
              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {(viewRegistrationsEvent.registeredParticipants || []).map((uid, idx) => {
                  const user = INITIAL_USERS.find(u => u.id === uid);
                  return (
                    <div key={`part-${idx}`} className="p-3 rounded-xl bg-[#F6F3EF]/60 dark:bg-[#342C2D]/40 border border-[#D9D1C7] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#783F46] text-white font-bold flex items-center justify-center text-[11px]">
                          P
                        </div>
                        <div>
                          <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                            {user?.name || `Participant #${idx + 1}`}
                          </div>
                          <div className="text-[10px] text-[#342C2D]/60">{user?.email || `participant${idx + 1}@gmail.com`}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F3EF] text-[#783F46] border border-[#D9D1C7]">
                        Attendee
                      </span>
                    </div>
                  );
                })}

                {(viewRegistrationsEvent.registeredVolunteers || []).map((uid, idx) => {
                  const user = INITIAL_USERS.find(u => u.id === uid);
                  return (
                    <div key={`vol-${idx}`} className="p-3 rounded-xl bg-[#F6F3EF]/60 dark:bg-[#342C2D]/40 border border-[#D9D1C7] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#D9D1C7] text-[#342C2D] font-bold flex items-center justify-center text-[11px]">
                          V
                        </div>
                        <div>
                          <div className="font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                            {user?.name || `Volunteer #${idx + 1}`}
                          </div>
                          <div className="text-[10px] text-[#342C2D]/60">{user?.email || `volunteer${idx + 1}@gmail.com`}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F3EF] text-[#783F46] border border-[#783F46]">
                        Volunteer
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

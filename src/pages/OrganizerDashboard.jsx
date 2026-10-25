import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';

export const OrganizerDashboard = ({ onOpenQRScanner, onShowQRDisplay }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(null); // event object
  const [photoInput, setPhotoInput] = useState('');
  
  const [editingEvent, setEditingEvent] = useState(null);

  // Create Event Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Tree Plantation',
    date: '2026-08-30',
    time: '09:00 AM - 01:00 PM',
    location: '',
    city: 'Mumbai',
    volunteerLimit: 50,
    allowVolunteer: true,
    allowParticipant: true,
    volunteerFee: 0,
    participantFee: 0,
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    tags: []
  });

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const loadOrganizerEvents = async () => {
    const data = await api.getEvents();
    // Show all events or events created by organizer
    setEvents(data || []);
  };

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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    const volFeeVal = Number(form.volunteerFee || 0);
    const partFeeVal = Number(form.participantFee || 0);

    const eventPayload = {
      ...form,
      allowVolunteer: form.allowVolunteer !== false,
      allowParticipant: form.allowParticipant !== false,
      volunteerFee: volFeeVal,
      hasVolunteerFee: volFeeVal > 0,
      participantFee: partFeeVal,
      hasParticipantFee: partFeeVal > 0,
      registrationFee: partFeeVal,
      organizer: currentUser?.name || 'Green Earth Foundation',
      organizerId: currentUser?.id
    };

    if (editingEvent) {
      await api.updateEvent(editingEvent.id, eventPayload);
    } else {
      await api.createEvent(eventPayload);
    }

    setShowCreateModal(false);
    setEditingEvent(null);
    setForm({
      title: '',
      category: 'Tree Plantation',
      date: '2026-08-30',
      time: '09:00 AM - 01:00 PM',
      location: '',
      city: 'Mumbai',
      volunteerLimit: 50,
      allowVolunteer: true,
      allowParticipant: true,
      volunteerFee: 0,
      participantFee: 0,
      description: '',
      bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
      tags: []
    });
    loadOrganizerEvents();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this drive?')) {
      await api.deleteEvent(id);
      loadOrganizerEvents();
    }
  };

  const handleExportCSV = (event) => {
    const list = (event.registeredVolunteers || []).map(id => {
      const u = INITIAL_USERS.find(user => user.id === id) || { name: 'Volunteer', email: 'volunteer@gmail.com', role: 'Volunteer' };
      return {
        ...u,
        attended: event.attendedVolunteers?.includes(id)
      };
    });
    exportVolunteerListToCSV(event.title, list);
  };

  const handleCompleteWithPhoto = async (e) => {
    e.preventDefault();
    if (!showPhotoModal) return;

    const photos = photoInput ? [photoInput] : ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'];
    await api.completeEvent(showPhotoModal.id, photos);
    setShowPhotoModal(null);
    setPhotoInput('');
    loadOrganizerEvents();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-800 text-white p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
            <Building2 className="w-3.5 h-3.5" /> NGO & Organizer Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Event Management Portal
          </h1>
          <p className="text-xs text-slate-200">
            Configure volunteer & participant 2-tier registration fee structures, generate QR codes, and track attendance.
          </p>
        </div>

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
          className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Social Drive</span>
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Drives Created</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{events.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Volunteers / Participants</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {events.reduce((acc, e) => acc + (e.registeredVolunteers?.length || 0), 0)} / {events.reduce((acc, e) => acc + (e.registeredParticipants?.length || 0), 0)}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Average Drive Rating</div>
          <div className="text-3xl font-extrabold text-amber-500 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-500" /> 4.9
          </div>
        </div>
      </div>

      {/* Events Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Your Organized Social Drives
          </h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            💡 Click <strong className="text-purple-600 dark:text-purple-400">Edit Drive</strong> below to update fee or registration settings anytime
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Drive Title & Category</th>
                <th className="py-3 px-3">Date & Location</th>
                <th className="py-3 px-3">Enabled Options</th>
                <th className="py-3 px-3">2-Tier Fee Structure</th>
                <th className="py-3 px-3">Volunteers / Participants</th>
                <th className="py-3 px-3">Attendance QR</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {events.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-3 space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{evt.title}</div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold">
                      {evt.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                    <div>📅 {evt.date}</div>
                    <div className="text-[11px] text-slate-400">📍 {evt.city}</div>
                  </td>

                  <td className="py-3.5 px-3 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {evt.allowVolunteer !== false && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          Volunteer
                        </span>
                      )}
                      {evt.allowParticipant !== false && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                          Participant
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 space-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold">Vol: </span>
                      {Number(evt.volunteerFee) > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                          ₹{evt.volunteerFee} Fee
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          Free
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold">Part: </span>
                      {Number(evt.participantFee) > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                          ₹{evt.participantFee} Fee
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-[10px]">
                          Free
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                    <div>Volunteers: {evt.registeredVolunteers?.length || 0} / {evt.volunteerLimit}</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400">Participants: {evt.registeredParticipants?.length || 0}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => onShowQRDisplay(evt)}
                      className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 text-[11px] font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Show QR Code
                    </button>
                  </td>

                  <td className="py-3.5 px-3">
                    {evt.isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleEditClick(evt)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-sm transition-all inline-flex items-center gap-1"
                      title="Edit Drive Title, Fee & Registration Settings"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Drive</span>
                    </button>

                    <button
                      onClick={() => onOpenQRScanner(evt)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold"
                      title="Scan Volunteer Attendance"
                    >
                      Scan QR
                    </button>

                    <button
                      onClick={() => handleExportCSV(evt)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold"
                      title="Export CSV Volunteer List"
                    >
                      <Download className="w-3.5 h-3.5 inline" /> CSV
                    </button>

                    {!evt.isCompleted && (
                      <button
                        onClick={() => setShowPhotoModal(evt)}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-bold"
                        title="Mark Complete & Upload Photos"
                      >
                        Complete Drive
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                      title="Delete Drive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingEvent ? 'Edit Social Impact Drive' : 'Create New Social Impact Event'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingEvent(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Tree Plantation Drive 2026"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {INITIAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2-Tier Registration & Fee Configuration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                  <span>⚙️ 2-Tier Registration & Fee Settings</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Configurable per Drive</span>
                </div>

                {/* Volunteer Tier */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allowVolunteer}
                      onChange={(e) => setForm({ ...form, allowVolunteer: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">Allow Volunteer Registrations</span>
                      <div className="text-[10px] text-slate-500">Volunteers get impact hours & badges</div>
                    </div>
                  </label>

                  {form.allowVolunteer && (
                    <div className="pl-6 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Volunteer Fee (₹):</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0 for Free, or e.g. 50"
                        value={form.volunteerFee}
                        onChange={(e) => setForm({ ...form, volunteerFee: e.target.value })}
                        className="w-36 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">(0 = Free Entry for Volunteers)</span>
                    </div>
                  )}
                </div>

                {/* Participant Tier */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allowParticipant}
                      onChange={(e) => setForm({ ...form, allowParticipant: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">Allow Participant Registrations</span>
                      <div className="text-[10px] text-slate-500">General attendees/public join drive</div>
                    </div>
                  </label>

                  {form.allowParticipant && (
                    <div className="pl-6 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Participant Fee (₹):</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0 for Free, or e.g. 150"
                        value={form.participantFee}
                        onChange={(e) => setForm({ ...form, participantFee: e.target.value })}
                        className="w-36 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">(0 = Free Entry for Participants)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Volunteer Capacity</label>
                  <input
                    type="number"
                    value={form.volunteerLimit}
                    onChange={(e) => setForm({ ...form, volunteerLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Full Venue Location & Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Park Grounds, Sector 4, MG Road"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <AITagAssistant
                    title={form.title}
                    category={form.category}
                    description={form.description}
                    onTagsGenerated={(tags) => setForm({ ...form, tags })}
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe the social initiative, guidelines, and benefits..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {form.tags && form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-bold text-slate-400">Generated Tags:</span>
                  {form.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md"
                >
                  Publish Social Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Drive & Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Complete Drive & Trigger AI Summary
            </h3>
            <p className="text-xs text-slate-500">
              Upload post-event photo URL for "{showPhotoModal.title}"
            </p>

            <form onSubmit={handleCompleteWithPhoto} className="space-y-3 text-xs">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Confirm Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

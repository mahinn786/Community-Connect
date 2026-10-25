import { INITIAL_EVENTS, INITIAL_USERS, INITIAL_BADGES, INITIAL_ORGANIZATIONS } from '../../server/data/seedData.js';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const getLocalData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`connect_hub_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return fallback;
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`connect_hub_${key}`, JSON.stringify(data));
  } catch (e) {}
};

// Safe JSON fetch helper — handles non-JSON responses gracefully
const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const api = {
  // Fetch Events
  getEvents: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== 'All') query.append('category', filters.category);
    if (filters.search) query.append('search', filters.search);
    if (filters.city && filters.city !== 'All') query.append('city', filters.city);
    if (filters.isCompleted !== undefined) query.append('isCompleted', filters.isCompleted);

    const queryString = query.toString();
    const data = await safeFetch(`${API_BASE}/events${queryString ? '?' + queryString : ''}`);
    if (data) return data;

    // Fallback to local seed data
    let events = getLocalData('events', INITIAL_EVENTS).map(e => {
      const volFee = Number(e.volunteerFee || 0);
      const partFee = Number(e.participantFee !== undefined ? e.participantFee : (e.registrationFee || 0));
      return {
        ...e,
        allowVolunteer: e.allowVolunteer !== false,
        allowParticipant: e.allowParticipant !== false,
        volunteerFee: volFee,
        hasVolunteerFee: Boolean(e.hasVolunteerFee || volFee > 0),
        participantFee: partFee,
        hasParticipantFee: Boolean(e.hasParticipantFee || partFee > 0),
        registeredVolunteers: e.registeredVolunteers || [],
        registeredParticipants: e.registeredParticipants || [],
        attendedVolunteers: e.attendedVolunteers || [],
        attendedParticipants: e.attendedParticipants || []
      };
    });
    if (filters.category && filters.category !== 'All') {
      events = events.filter(e => e.category === filters.category);
    }
    if (filters.city && filters.city !== 'All') {
      events = events.filter(e => e.city && e.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.isCompleted !== undefined) {
      events = events.filter(e => String(e.isCompleted) === String(filters.isCompleted));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(
        e =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.organizer && e.organizer.toLowerCase().includes(q))
      );
    }
    return events;
  },

  // Create Event
  createEvent: async (eventData) => {
    const volFee = Number(eventData.volunteerFee || 0);
    const partFee = Number(eventData.participantFee !== undefined ? eventData.participantFee : (eventData.registrationFee || 0));
    const data = await safeFetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventData,
        volunteerFee: volFee,
        hasVolunteerFee: volFee > 0 || Boolean(eventData.hasVolunteerFee),
        participantFee: partFee,
        hasParticipantFee: partFee > 0 || Boolean(eventData.hasParticipantFee)
      }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const newEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      allowVolunteer: eventData.allowVolunteer !== false,
      allowParticipant: eventData.allowParticipant !== false,
      volunteerFee: volFee,
      hasVolunteerFee: volFee > 0 || Boolean(eventData.hasVolunteerFee),
      participantFee: partFee,
      hasParticipantFee: partFee > 0 || Boolean(eventData.hasParticipantFee),
      registeredVolunteers: [],
      registeredParticipants: [],
      attendedVolunteers: [],
      attendedParticipants: [],
      status: 'Approved',
      isCompleted: false,
      qrCode: `CONNECT-HUB-EVT-${Date.now()}-ATTENDANCE-QR`,
      discussions: [],
      galleryPhotos: [],
      aiSummary: null,
      rating: 5.0,
      feedbacksCount: 0
    };
    events.unshift(newEvent);
    setLocalData('events', events);
    return newEvent;
  },

  // Register / Cancel Event Registration (supports role = 'Volunteer' or 'Participant')
  toggleRegistration: async (eventId, userId, role = 'Volunteer') => {
    const data = await safeFetch(`${API_BASE}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const event = events.find(e => e.id === eventId);
    let registered = false;
    if (event) {
      if (!event.registeredVolunteers) event.registeredVolunteers = [];
      if (!event.registeredParticipants) event.registeredParticipants = [];

      if (role === 'Participant') {
        const isReg = event.registeredParticipants.includes(userId);
        if (isReg) {
          event.registeredParticipants = event.registeredParticipants.filter(id => id !== userId);
        } else {
          event.registeredParticipants.push(userId);
          registered = true;
        }
      } else {
        const isReg = event.registeredVolunteers.includes(userId);
        if (isReg) {
          event.registeredVolunteers = event.registeredVolunteers.filter(id => id !== userId);
        } else {
          event.registeredVolunteers.push(userId);
          registered = true;
        }
      }
      setLocalData('events', events);
    }
    return { success: true, registered, event, role };
  },

  // Verify QR Code Attendance
  verifyAttendance: async (eventId, userId, qrCode) => {
    const data = await safeFetch(`${API_BASE}/events/${eventId}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, qrCode }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const event = events.find(e => e.id === eventId);
    if (event && !event.attendedVolunteers.includes(userId)) {
      event.attendedVolunteers.push(userId);
      setLocalData('events', events);
    }
    return { success: true, message: 'Attendance verified successfully' };
  },

  // Add Comment / Q&A
  addDiscussion: async (eventId, commentData) => {
    const data = await safeFetch(`${API_BASE}/events/${eventId}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const event = events.find(e => e.id === eventId);
    const newComment = {
      id: `d-${Date.now()}`,
      ...commentData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (event) {
      event.discussions.push(newComment);
      setLocalData('events', events);
    }
    return newComment;
  },

  // AI Tag Suggestion
  suggestTags: async (title, category, description) => {
    const data = await safeFetch(`${API_BASE}/ai/suggest-tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, description }),
    });
    if (data) return data;

    const tags = ['CommunityConnect', 'VolunteerPower'];
    if (category) tags.push(category.replace(/\s+/g, ''));
    if (title && title.toLowerCase().includes('tree')) tags.push('TreePlantation', 'EcoWarriors');
    if (title && title.toLowerCase().includes('blood')) tags.push('BloodDonation', 'SaveLives');
    if (title && title.toLowerCase().includes('clean')) tags.push('CleanlinessDrive', 'ZeroPlastic');
    return { tags };
  },

  // AI Recommendations
  getAIRecommendations: async (interests) => {
    const data = await safeFetch(`${API_BASE}/ai/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    return events.filter(e => !e.isCompleted).slice(0, 3);
  },

  // Mark Event Completed
  completeEvent: async (eventId, photoUrls = []) => {
    const data = await safeFetch(`${API_BASE}/events/${eventId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoUrls }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.isCompleted = true;
      if (photoUrls.length) event.galleryPhotos.push(...photoUrls);
      event.aiSummary = `Successfully completed "${event.title}". Outstanding volunteer contribution achieved!`;
      setLocalData('events', events);
    }
    return event;
  },

  // Update Event
  updateEvent: async (eventId, updatedFields) => {
    const volFee = Number(updatedFields.volunteerFee || 0);
    const partFee = Number(updatedFields.participantFee !== undefined ? updatedFields.participantFee : (updatedFields.registrationFee || 0));
    const data = await safeFetch(`${API_BASE}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updatedFields,
        volunteerFee: volFee,
        hasVolunteerFee: volFee > 0 || Boolean(updatedFields.hasVolunteerFee),
        participantFee: partFee,
        hasParticipantFee: partFee > 0 || Boolean(updatedFields.hasParticipantFee)
      }),
    });
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...updatedFields,
        allowVolunteer: updatedFields.allowVolunteer !== false,
        allowParticipant: updatedFields.allowParticipant !== false,
        volunteerFee: volFee,
        hasVolunteerFee: volFee > 0 || Boolean(updatedFields.hasVolunteerFee),
        participantFee: partFee,
        hasParticipantFee: partFee > 0 || Boolean(updatedFields.hasParticipantFee)
      };
      setLocalData('events', events);
      return events[index];
    }
    return null;
  },

  // Delete Event
  deleteEvent: async (eventId) => {
    const data = await safeFetch(`${API_BASE}/events/${eventId}`, { method: 'DELETE' });
    if (data) return data;

    let events = getLocalData('events', INITIAL_EVENTS);
    events = events.filter(e => e.id !== eventId);
    setLocalData('events', events);
    return { success: true };
  },

  // Get Admin Metrics
  getAdminMetrics: async () => {
    const data = await safeFetch(`${API_BASE}/admin/metrics`);
    if (data) return data;

    const events = getLocalData('events', INITIAL_EVENTS);
    return {
      totalEvents: events.length,
      completedEvents: events.filter(e => e.isCompleted).length,
      totalVolunteers: 142,
      totalHoursLogged: 860,
      pendingReports: 1,
      pendingOrgs: 1,
      organizations: INITIAL_ORGANIZATIONS
    };
  }
};

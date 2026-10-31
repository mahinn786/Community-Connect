import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_EVENTS,
  INITIAL_USERS,
  INITIAL_BADGES,
  INITIAL_CATEGORIES,
  INITIAL_REPORTS,
  INITIAL_ORGANIZATIONS
} from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-Memory Database initialized with seed data
let events = [...INITIAL_EVENTS];
let users = [...INITIAL_USERS];
let badges = [...INITIAL_BADGES];
let reports = [...INITIAL_REPORTS];
let organizations = [...INITIAL_ORGANIZATIONS];

// Serve static production build from dist
app.use(express.static(path.join(__dirname, '../dist')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Community Connect Hub API', timestamp: new Date() });
});

// GET Categories & Badges
app.get('/api/meta', (req, res) => {
  res.json({ categories: INITIAL_CATEGORIES, badges });
});

// GET Events with filters
app.get('/api/events', (req, res) => {
  const { category, search, city, status, isCompleted } = req.query;
  let filtered = events;

  if (category && category !== 'All') {
    filtered = filtered.filter(e => e.category === category);
  }
  if (city && city !== 'All') {
    filtered = filtered.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }
  if (isCompleted !== undefined) {
    filtered = filtered.filter(e => String(e.isCompleted) === String(isCompleted));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// GET Single Event
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// POST Create Event
app.post('/api/events', (req, res) => {
  const { title, category, organizer, organizerId, date, time, location, city, coordinates, description, bannerUrl, volunteerLimit, tags } = req.body;

  if (!title || !category || !location) {
    return res.status(400).json({ message: 'Title, category, and location are required' });
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    title,
    category,
    organizer: organizer || 'Community Organizer',
    organizerId: organizerId || 'u-organizer-1',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '09:00 AM - 01:00 PM',
    location,
    city: city || 'Mumbai',
    coordinates: coordinates || { lat: 19.0760, lng: 72.8777 },
    description: description || 'No detailed description provided.',
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    volunteerLimit: Number(volunteerLimit) || 50,
    registeredVolunteers: [],
    attendedVolunteers: [],
    status: 'Approved',
    isCompleted: false,
    tags: tags && tags.length ? tags : [category.replace(/\s+/g, '')],
    qrCode: `CONNECT-HUB-EVT-${Date.now()}-ATTENDANCE-QR`,
    discussions: [],
    galleryPhotos: [],
    aiSummary: null,
    rating: 5.0,
    feedbacksCount: 0
  };

  events.unshift(newEvent);
  res.status(201).json(newEvent);
});

// PUT Update Event
app.put('/api/events/:id', (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });

  events[idx] = { ...events[idx], ...req.body };
  res.json(events[idx]);
});

// DELETE Event
app.delete('/api/events/:id', (req, res) => {
  events = events.filter(e => e.id !== req.params.id);
  res.json({ success: true, message: 'Event deleted' });
});

// Register / Cancel Participation (Participant or Volunteer)
app.post('/api/events/:id/register', (req, res) => {
  const { userId, role = 'Volunteer' } = req.body;
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (!event.registeredVolunteers) event.registeredVolunteers = [];
  if (!event.registeredParticipants) event.registeredParticipants = [];

  let isRegistered = false;
  if (role === 'Participant') {
    isRegistered = event.registeredParticipants.includes(userId);
    if (isRegistered) {
      event.registeredParticipants = event.registeredParticipants.filter(id => id !== userId);
    } else {
      const pLimit = event.participantLimit || 150;
      if (event.registeredParticipants.length >= pLimit) {
        return res.status(400).json({ message: 'Participant slots are fully booked' });
      }
      event.registeredParticipants.push(userId);
    }
  } else {
    isRegistered = event.registeredVolunteers.includes(userId);
    if (isRegistered) {
      event.registeredVolunteers = event.registeredVolunteers.filter(id => id !== userId);
    } else {
      const vLimit = event.volunteerLimit || 50;
      if (event.registeredVolunteers.length >= vLimit) {
        return res.status(400).json({ message: 'Volunteer slots are fully booked' });
      }
      event.registeredVolunteers.push(userId);
    }
  }

  const user = users.find(u => u.id === userId);
  if (user) {
    if (!user.registeredEvents) user.registeredEvents = [];
    if (isRegistered) {
      user.registeredEvents = user.registeredEvents.filter(eid => eid !== event.id);
    } else {
      if (!user.registeredEvents.includes(event.id)) {
        user.registeredEvents.push(event.id);
      }
    }
  }

  res.json({ success: true, registered: !isRegistered, event, role });
});

// QR Code Check-in / Attendance Verification
app.post('/api/events/:id/attendance', (req, res) => {
  const { userId, qrCode } = req.body;
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (qrCode && qrCode !== event.qrCode) {
    return res.status(400).json({ message: 'Invalid Event QR Code scanned' });
  }

  if (!event.attendedVolunteers.includes(userId)) {
    event.attendedVolunteers.push(userId);
  }

  const user = users.find(u => u.id === userId);
  if (user) {
    user.hours = (user.hours || 0) + 4;
    if (event.category === 'Tree Plantation') user.treesPlanted = (user.treesPlanted || 0) + 5;
    if (event.category === 'Blood Donation') user.bloodDonatedUnits = (user.bloodDonatedUnits || 0) + 1;
    if (event.category === 'Cleanliness Drives') user.cleanupsAttended = (user.cleanupsAttended || 0) + 1;

    if (user.treesPlanted >= 10 && !user.badges.includes('b1')) user.badges.push('b1');
    if (user.bloodDonatedUnits >= 2 && !user.badges.includes('b2')) user.badges.push('b2');
    if (user.hours >= 25 && !user.badges.includes('b3')) user.badges.push('b3');
    if (user.cleanupsAttended >= 3 && !user.badges.includes('b4')) user.badges.push('b4');
  }

  res.json({ success: true, message: 'Attendance verified successfully', user, event });
});

// Add Q&A Discussion
app.post('/api/events/:id/discussions', (req, res) => {
  const { user, role, message } = req.body;
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const comment = {
    id: `d-${Date.now()}`,
    user: user || 'Anonymous Volunteer',
    role: role || 'Volunteer',
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  event.discussions.push(comment);
  res.json(comment);
});

// AI Service: Suggest Tags
app.post('/api/ai/suggest-tags', (req, res) => {
  const { title, category, description } = req.body;
  const combined = `${title || ''} ${category || ''} ${description || ''}`.toLowerCase();

  const suggested = new Set();
  if (category) suggested.add(category.replace(/\s+/g, ''));
  if (combined.includes('tree') || combined.includes('plant') || combined.includes('green')) {
    suggested.add('TreePlantation');
    suggested.add('EcoWarriors');
    suggested.add('GreenEarth');
  }
  if (combined.includes('blood') || combined.includes('donor') || combined.includes('health')) {
    suggested.add('BloodHero');
    suggested.add('SaveLives');
    suggested.add('HealthCare');
  }
  if (combined.includes('clean') || combined.includes('beach') || combined.includes('plastic')) {
    suggested.add('ZeroPlastic');
    suggested.add('CleanlinessDrive');
    suggested.add('SwachhBharat');
  }
  if (combined.includes('code') || combined.includes('teach') || combined.includes('school')) {
    suggested.add('DigitalLiteracy');
    suggested.add('TeachForGood');
    suggested.add('YouthEmpowerment');
  }
  suggested.add('CommunityConnect');

  res.json({ tags: Array.from(suggested) });
});

// AI Service: Personalized Recommendations
app.post('/api/ai/recommendations', (req, res) => {
  const { interests } = req.body;

  let recommended = events.filter(e => !e.isCompleted);
  if (interests && interests.length) {
    recommended.sort((a, b) => {
      const aScore = interests.includes(a.category) ? 2 : 0;
      const bScore = interests.includes(b.category) ? 2 : 0;
      return bScore - aScore;
    });
  }

  res.json(recommended.slice(0, 3));
});

// AI Service: Generate Event Summary after completion
app.post('/api/events/:id/complete', (req, res) => {
  const { photoUrls } = req.body;
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.isCompleted = true;
  if (photoUrls && Array.isArray(photoUrls)) {
    event.galleryPhotos = [...event.galleryPhotos, ...photoUrls];
  }

  const attendeesCount = event.attendedVolunteers.length || event.registeredVolunteers.length || 15;
  event.aiSummary = `Successfully completed "${event.title}" with ${attendeesCount} passionate volunteers. The community drive achieved outstanding engagement with a rating of ${event.rating}/5.`;

  res.json(event);
});

// GET Leaderboard
app.get('/api/users/leaderboard', (req, res) => {
  const sortedVolunteers = [...users]
    .filter(u => u.role === 'Volunteer')
    .sort((a, b) => (b.hours || 0) - (a.hours || 0));

  res.json(sortedVolunteers);
});

// GET Admin Metrics
app.get('/api/admin/metrics', (req, res) => {
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.isCompleted).length;
  const totalVolunteers = users.filter(u => u.role === 'Volunteer').length;
  const totalHoursLogged = users.reduce((acc, u) => acc + (u.hours || 0), 0);
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const pendingOrgs = organizations.filter(o => o.status === 'Pending').length;

  res.json({
    totalEvents,
    completedEvents,
    totalVolunteers,
    totalHoursLogged,
    pendingReports,
    pendingOrgs,
    organizations,
    reports
  });
});

// Admin Approve/Verify Organization
app.put('/api/admin/organizations/:id', (req, res) => {
  const { status } = req.body;
  const org = organizations.find(o => o.id === req.params.id);
  if (!org) return res.status(404).json({ message: 'Organization not found' });

  org.status = status || 'Verified';
  res.json(org);
});

// Catch-all route for SPA client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Community Connect Hub Server running on http://localhost:${PORT}`);
});

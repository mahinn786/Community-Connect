import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../../server/data/seedData.js';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'community_connect_user';
const STORAGE_KEY_CUSTOM_USERS = 'community_connect_custom_users';
const STORAGE_KEY_SAVED_EVENTS = 'community_connect_saved_events';
const STORAGE_KEY_THEME = 'community_connect_theme';

export const AuthProvider = ({ children }) => {
  // Saved custom registered accounts
  const [customUsers, setCustomUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current logged in user (Only two roles: 'Participant' | 'Organizer')
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          // Normalize legacy volunteer role to Participant
          if (parsed.role === 'Volunteer') {
            parsed.role = 'Participant';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse active user:', e);
    }
    // Default to Aarav Patel as Participant
    const defaultUser = { ...INITIAL_USERS[0], role: 'Participant' };
    return defaultUser;
  });

  // Bookmarked / Saved Events
  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_EVENTS);
      return saved ? JSON.parse(saved) : ['evt-1', 'evt-4'];
    } catch {
      return ['evt-1', 'evt-4'];
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Helper to persist user
  const persistUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  };

  // Participant Login
  const loginParticipant = async (email, password) => {
    // Artificial slight delay for realistic startup UX
    await new Promise(r => setTimeout(r, 450));

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = [...INITIAL_USERS, ...customUsers];
    
    // Find matching participant
    let matched = allUsers.find(
      u => u.email.toLowerCase() === cleanEmail && (u.role === 'Participant' || u.role === 'Volunteer')
    );

    if (matched) {
      // Normalize role
      const user = { ...matched, role: 'Participant' };
      persistUser(user);
      return { success: true, user };
    }

    // If not found in seed, create a new participant session with verified data
    const newUser = {
      id: `u-part-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: 'Participant',
      organization: 'Community Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      verified: true,
      hours: 12,
      treesPlanted: 4,
      bloodDonatedUnits: 1,
      cleanupsAttended: 2,
      badges: ['b1', 'b3'],
      interests: ['Tree Plantation', 'Workshops', 'Cleanliness Drives'],
      registeredEvents: ['evt-1'],
      registeredParticipantEvents: ['evt-1'],
      registeredVolunteerEvents: []
    };

    setCustomUsers(prev => {
      const next = [...prev, newUser];
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(next));
      return next;
    });

    persistUser(newUser);
    return { success: true, user: newUser };
  };

  // Participant Signup
  const signupParticipant = async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 550));

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = [...INITIAL_USERS, ...customUsers];
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing && existing.role === 'Participant') {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: `u-part-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'Participant',
      organization: 'Community Member',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      verified: true,
      hours: 0,
      treesPlanted: 0,
      bloodDonatedUnits: 0,
      cleanupsAttended: 0,
      badges: [],
      interests: ['Workshops', 'Tree Plantation'],
      registeredEvents: [],
      registeredParticipantEvents: [],
      registeredVolunteerEvents: []
    };

    setCustomUsers(prev => {
      const next = [...prev, newUser];
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(next));
      return next;
    });

    persistUser(newUser);
    return { success: true, user: newUser };
  };

  // Organizer Login
  const loginOrganizer = async (email, password) => {
    await new Promise(r => setTimeout(r, 450));

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = [...INITIAL_USERS, ...customUsers];
    
    let matched = allUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.role === 'Organizer'
    );

    if (matched) {
      persistUser(matched);
      return { success: true, user: matched };
    }

    // Default organizer fallback if testing demo accounts
    if (cleanEmail.includes('organizer') || cleanEmail.includes('greenearth')) {
      const orgUser = INITIAL_USERS.find(u => u.role === 'Organizer');
      persistUser(orgUser);
      return { success: true, user: orgUser };
    }

    // Auto-create or handle organizer login
    const newOrg = {
      id: `u-org-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Initiatives',
      email: cleanEmail,
      role: 'Organizer',
      organization: 'Community Org',
      avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=250',
      verified: true,
      createdEventsCount: 2,
      impactScore: 92
    };

    setCustomUsers(prev => {
      const next = [...prev, newOrg];
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(next));
      return next;
    });

    persistUser(newOrg);
    return { success: true, user: newOrg };
  };

  // Organizer Signup
  const signupOrganizer = async ({ organizationName, contactName, email, password }) => {
    await new Promise(r => setTimeout(r, 550));

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = [...INITIAL_USERS, ...customUsers];
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing && existing.role === 'Organizer') {
      throw new Error('An organizer account with this email already exists. Please log in.');
    }

    const newOrg = {
      id: `u-org-${Date.now()}`,
      name: organizationName.trim(),
      contactPerson: contactName.trim(),
      email: cleanEmail,
      role: 'Organizer',
      organization: organizationName.trim(),
      avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=250',
      verified: true,
      createdEventsCount: 0,
      impactScore: 100
    };

    setCustomUsers(prev => {
      const next = [...prev, newOrg];
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(next));
      return next;
    });

    persistUser(newOrg);
    return { success: true, user: newOrg };
  };

  // Logout
  const logout = () => {
    persistUser(null);
  };

  // Password Reset
  const requestPasswordReset = async (email) => {
    await new Promise(r => setTimeout(r, 400));
    return {
      success: true,
      message: `A secure password reset link has been dispatched to ${email}. Please check your inbox.`
    };
  };

  // Update user statistics (hours, badges, registrations)
  const updateUserStats = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(next));
      return next;
    });
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(next));
      return next;
    });
  };

  // Saved / Bookmarked Events
  const toggleSaveEvent = (eventId) => {
    setSavedEvents(prev => {
      const isSaved = prev.includes(eventId);
      const next = isSaved ? prev.filter(id => id !== eventId) : [...prev, eventId];
      localStorage.setItem(STORAGE_KEY_SAVED_EVENTS, JSON.stringify(next));
      return next;
    });
  };

  const isEventSaved = (eventId) => savedEvents.includes(eventId);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'Guest',
        darkMode,
        toggleDarkMode,
        loginParticipant,
        signupParticipant,
        loginOrganizer,
        signupOrganizer,
        logout,
        requestPasswordReset,
        updateUserStats,
        updateProfile,
        savedEvents,
        toggleSaveEvent,
        isEventSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

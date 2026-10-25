import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../../server/data/seedData.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Preset default user is Aarav Patel (Volunteer)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('connect_hub_active_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse connect_hub_active_user:', e);
    }
    return INITIAL_USERS[0];
  });

  const [activeRole, setActiveRole] = useState(() => {
    return currentUser?.role || 'Volunteer';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('connect_hub_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('connect_hub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('connect_hub_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Quick switch role for Hackathon Demo
  const switchRole = (newRole) => {
    setActiveRole(newRole);
    const matchedUser = INITIAL_USERS.find(u => u.role === newRole) || {
      id: `u-${newRole.toLowerCase()}-demo`,
      name: `${newRole} Demo User`,
      email: `${newRole.toLowerCase()}@connecthub.org`,
      role: newRole,
      organization: 'Demo Orgs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      hours: newRole === 'Volunteer' ? 32 : 0,
      treesPlanted: newRole === 'Volunteer' ? 14 : 0,
      bloodDonatedUnits: newRole === 'Volunteer' ? 2 : 0,
      cleanupsAttended: newRole === 'Volunteer' ? 4 : 0,
      badges: newRole === 'Volunteer' ? ['b1', 'b2', 'b3'] : [],
      registeredEvents: ['evt-1', 'evt-2', 'evt-4']
    };
    setCurrentUser(matchedUser);
    localStorage.setItem('connect_hub_active_user', JSON.stringify(matchedUser));
  };

  const login = (email, role) => {
    const matched = INITIAL_USERS.find(u => u.role === role) || {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      organization: 'Volunteer Network',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      hours: 12,
      treesPlanted: 5,
      bloodDonatedUnits: 1,
      cleanupsAttended: 2,
      badges: ['b1'],
      registeredEvents: []
    };
    setCurrentUser(matched);
    setActiveRole(role);
    localStorage.setItem('connect_hub_active_user', JSON.stringify(matched));
  };

  const updateUserStats = (updatedFields) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('connect_hub_active_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        darkMode,
        toggleDarkMode,
        login,
        updateUserStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

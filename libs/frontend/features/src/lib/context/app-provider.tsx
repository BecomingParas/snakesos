'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for the application state
export interface Rescuer {
  id: string;
  name: string;
  phone: string;
  zone: string;
  experience: string;
  status: 'available' | 'busy';
  imageUrl?: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  municipality: string;
  lat: number;
  lng: number;
  status: string;
}

export interface AppContextType {
  // Internationalization
  t: (key: string) => string;
  
  // Data
  activeRescuers: Rescuer[];
  volunteers: Volunteer[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation keys (for i18n support)
const translations: Record<string, string> = {
  avail24h: '24/7 Available',
  heroTitle: 'Protecting People and Wildlife',
  heroSub: 'Professional snake rescue and wildlife conservation in Rupandehi District',
  ctaEmergency: 'Emergency Rescue',
  ctaCall: 'Call Now',
  ctaVolunteer: 'Become Volunteer',
  rescuerTitle: 'Active Rescue Team',
  responseTime: '15-30 min response',
  available: 'Available',
  busy: 'On Mission',
  tel1: '9816482570',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeRescuers, setActiveRescuers] = useState<Rescuer[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with actual API calls
      const mockRescuers: Rescuer[] = [
        {
          id: '1',
          name: 'Ram Kumar Thapa',
          phone: '9816482570',
          zone: 'Butwal-1 to 8',
          experience: 'Senior',
          status: 'available',
          description: 'Experienced snake handler with 8+ years in field rescue operations.',
        },
        {
          id: '2',
          name: 'Sita Devi Sharma',
          phone: '9856789012',
          zone: 'Tilottama',
          experience: 'Expert',
          status: 'available',
          description: 'Wildlife conservation specialist and certified first aid trainer.',
        },
        {
          id: '3',
          name: 'Hari Bahadur KC',
          phone: '9834567890',
          zone: 'Siddharthanagar',
          experience: 'Junior',
          status: 'busy',
          description: 'New team member with veterinary background and rescue training.',
        },
      ];

      const mockVolunteers: Volunteer[] = [
        { id: '1', name: 'Ram Kumar', phone: '9816482570', municipality: 'Butwal', lat: 27.6918, lng: 83.4403, status: 'ACTIVE' },
        { id: '2', name: 'Sita Sharma', phone: '9856789012', municipality: 'Tilottama', lat: 27.6598, lng: 83.4521, status: 'ACTIVE' },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setActiveRescuers(mockRescuers);
      setVolunteers(mockVolunteers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value: AppContextType = {
    t,
    activeRescuers,
    volunteers,
    loading,
    error,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
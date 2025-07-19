import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TriageCase {
  id: string;
  type: 'public' | 'medic' | 'supply';
  timestamp: number;
  priority: 'red' | 'blue' | 'green';
  symptoms: string[];
  patientName?: string;
  age?: string;
  location?: string;
  gpsCoordinates?: { lat: number; lng: number };
  supplies?: string[];
  otherSupplyNeed?: string;
  isAnonymous?: boolean;
  photo?: string;
  resolved?: boolean;
  bluetoothBroadcasting?: boolean;
  broadcastStartTime?: number;
}

interface AppStateContextType {
  savedCases: TriageCase[];
  consultQueue: TriageCase[];
  currentBroadcast: TriageCase | null;
  addCase: (caseData: Omit<TriageCase, 'id' | 'timestamp'>) => TriageCase;
  resolveCase: (caseId: string) => void;
  addToConsultQueue: (caseId: string) => void;
  removeFromConsultQueue: (caseId: string) => void;
  startBroadcast: (caseId: string) => void;
  stopBroadcast: () => void;
  getCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Triage logic: determine priority based on symptoms
export const determineTriagePriority = (symptoms: string[]): 'red' | 'blue' | 'green' => {
  const redSymptoms = ['notBreathing', 'severeBleeding', 'unconscious'];
  const blueSymptoms = ['chestPain', 'headInjury', 'difficultyBreathing', 'severePain'];
  
  if (symptoms.some(symptom => redSymptoms.includes(symptom))) {
    return 'red';
  }
  
  if (symptoms.some(symptom => blueSymptoms.includes(symptom))) {
    return 'blue';
  }
  
  return 'green';
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCases, setSavedCases] = useState<TriageCase[]>([]);
  const [consultQueue, setConsultQueue] = useState<TriageCase[]>([]);
  const [currentBroadcast, setCurrentBroadcast] = useState<TriageCase | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('gazaTriageCases');
    if (stored) {
      try {
        setSavedCases(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved cases:', error);
      }
    }

    const storedQueue = localStorage.getItem('gazaTriageConsultQueue');
    if (storedQueue) {
      try {
        setConsultQueue(JSON.parse(storedQueue));
      } catch (error) {
        console.error('Error loading consult queue:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('gazaTriageCases', JSON.stringify(savedCases));
  }, [savedCases]);

  useEffect(() => {
    localStorage.setItem('gazaTriageConsultQueue', JSON.stringify(consultQueue));
  }, [consultQueue]);

  const getCurrentLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  const addCase = (caseData: Omit<TriageCase, 'id' | 'timestamp'>): TriageCase => {
    const newCase: TriageCase = {
      ...caseData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setSavedCases(prev => [...prev, newCase]);

    // Auto-start broadcast for red and blue cases if Bluetooth is available
    if ((newCase.priority === 'red' || newCase.priority === 'blue') && newCase.type !== 'supply') {
      startBroadcast(newCase.id);
    }

    return newCase;
  };

  const resolveCase = (caseId: string) => {
    setSavedCases(prev => 
      prev.map(c => c.id === caseId ? { ...c, resolved: true } : c)
    );
    
    // Stop broadcast if this case is currently broadcasting
    if (currentBroadcast?.id === caseId) {
      stopBroadcast();
    }
  };

  const addToConsultQueue = (caseId: string) => {
    const caseToAdd = savedCases.find(c => c.id === caseId);
    if (caseToAdd && !consultQueue.find(c => c.id === caseId)) {
      setConsultQueue(prev => [...prev, caseToAdd]);
    }
  };

  const removeFromConsultQueue = (caseId: string) => {
    setConsultQueue(prev => prev.filter(c => c.id !== caseId));
  };

  const startBroadcast = (caseId: string) => {
    const caseTobroadcast = savedCases.find(c => c.id === caseId);
    if (caseTobroadcast) {
      const updatedCase = {
        ...caseTobroadcast,
        bluetoothBroadcasting: true,
        broadcastStartTime: Date.now()
      };
      
      setCurrentBroadcast(updatedCase);
      setSavedCases(prev => 
        prev.map(c => c.id === caseId ? updatedCase : c)
      );

      // TODO: Implement actual BLE broadcasting here
      console.log('Starting BLE broadcast for case:', caseId);
    }
  };

  const stopBroadcast = () => {
    if (currentBroadcast) {
      setSavedCases(prev => 
        prev.map(c => c.id === currentBroadcast.id ? 
          { ...c, bluetoothBroadcasting: false } : c
        )
      );
      setCurrentBroadcast(null);
      
      // TODO: Implement actual BLE broadcast stop here
      console.log('Stopping BLE broadcast');
    }
  };

  return (
    <AppStateContext.Provider value={{
      savedCases,
      consultQueue,
      currentBroadcast,
      addCase,
      resolveCase,
      addToConsultQueue,
      removeFromConsultQueue,
      startBroadcast,
      stopBroadcast,
      getCurrentLocation
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
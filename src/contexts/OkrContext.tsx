
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types
export type KeyResult = {
  id: string;
  title: string;
  description: string;
  progress: number;
  objectiveId: string;
};

export type Objective = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
};

export type OkrContextType = {
  objectives: Objective[];
  keyResults: KeyResult[];
  addObjective: (objective: Omit<Objective, "id">) => void;
  updateObjective: (id: string, objective: Partial<Objective>) => void;
  deleteObjective: (id: string) => void;
  addKeyResult: (keyResult: Omit<KeyResult, "id">) => void;
  updateKeyResult: (id: string, keyResult: Partial<KeyResult>) => void;
  deleteKeyResult: (id: string) => void;
  getObjectiveProgress: (objectiveId: string) => number;
};

// Sample data
const sampleObjectives: Objective[] = [
  {
    id: "1",
    title: "Increase Market Share",
    description: "Expand our presence in the global market",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    category: "Growth"
  },
  {
    id: "2",
    title: "Improve Customer Satisfaction",
    description: "Enhance overall customer experience",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    category: "Customer"
  },
  {
    id: "3",
    title: "Optimize Development Process",
    description: "Streamline our development workflow",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    category: "Operations"
  }
];

const sampleKeyResults: KeyResult[] = [
  {
    id: "1",
    title: "Expand to 3 new countries",
    description: "Open operations in France, Germany and Spain",
    progress: 33,
    objectiveId: "1"
  },
  {
    id: "2",
    title: "Achieve 20% revenue growth",
    description: "Increase quarterly revenue by 20% compared to last year",
    progress: 45,
    objectiveId: "1"
  },
  {
    id: "3",
    title: "Improve NPS score to 60",
    description: "Increase Net Promoter Score from current 45 to 60",
    progress: 75,
    objectiveId: "2"
  },
  {
    id: "4",
    title: "Reduce support response time to 2 hours",
    description: "Decrease average support ticket resolution time",
    progress: 90,
    objectiveId: "2"
  },
  {
    id: "5",
    title: "Implement CI/CD pipeline",
    description: "Setup automated testing and deployment",
    progress: 60,
    objectiveId: "3"
  },
  {
    id: "6",
    title: "Reduce bug count by 30%",
    description: "Decrease the number of reported bugs in production",
    progress: 20,
    objectiveId: "3"
  }
];

// Create context
const OkrContext = createContext<OkrContextType | null>(null);

// Provider component
export const OkrProvider = ({ children }: { children: ReactNode }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  
  // Initialize with sample data
  useEffect(() => {
    setObjectives(sampleObjectives);
    setKeyResults(sampleKeyResults);
  }, []);

  // Calculate objective progress based on its key results
  const getObjectiveProgress = (objectiveId: string): number => {
    const relatedKeyResults = keyResults.filter(kr => kr.objectiveId === objectiveId);
    if (relatedKeyResults.length === 0) return 0;
    
    const totalProgress = relatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0);
    return Math.round(totalProgress / relatedKeyResults.length);
  };

  // Add new objective
  const addObjective = (objective: Omit<Objective, "id">) => {
    const newObjective: Objective = {
      ...objective,
      id: Date.now().toString()
    };
    setObjectives(prev => [...prev, newObjective]);
  };

  // Update objective
  const updateObjective = (id: string, objective: Partial<Objective>) => {
    setObjectives(prev => 
      prev.map(obj => obj.id === id ? { ...obj, ...objective } : obj)
    );
  };

  // Delete objective
  const deleteObjective = (id: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
    // Also delete all key results related to this objective
    setKeyResults(prev => prev.filter(kr => kr.objectiveId !== id));
  };

  // Add new key result
  const addKeyResult = (keyResult: Omit<KeyResult, "id">) => {
    const newKeyResult: KeyResult = {
      ...keyResult,
      id: Date.now().toString()
    };
    setKeyResults(prev => [...prev, newKeyResult]);
  };

  // Update key result
  const updateKeyResult = (id: string, keyResult: Partial<KeyResult>) => {
    setKeyResults(prev => 
      prev.map(kr => kr.id === id ? { ...kr, ...keyResult } : kr)
    );
  };

  // Delete key result
  const deleteKeyResult = (id: string) => {
    setKeyResults(prev => prev.filter(kr => kr.id !== id));
  };

  const value = {
    objectives,
    keyResults,
    addObjective,
    updateObjective,
    deleteObjective,
    addKeyResult,
    updateKeyResult,
    deleteKeyResult,
    getObjectiveProgress
  };

  return <OkrContext.Provider value={value}>{children}</OkrContext.Provider>;
};

// Custom hook for using the context
export const useOkr = () => {
  const context = useContext(OkrContext);
  if (!context) {
    throw new Error('useOkr must be used within an OkrProvider');
  }
  return context;
};

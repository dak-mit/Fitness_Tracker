// context/WorkoutContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define Workout Type
interface Workout {
  workoutName: string;
  startTime: string;
  date: string;
  activity: string;
  duration: number;
  calories: number;
}

// Context Type
interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
}

// Create Context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider Component
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout]);
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom Hook
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

// context/WorkoutContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define Workout Type
interface Meal {
  mealName: string;
  //startTime: string;
  date: string;
  nutrition: string;
  //duration: number;
  calories: number;
}

// Context Type
interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
}

// Create Context
const MealContext = createContext<MealContextType | undefined>(undefined);

// Provider Component
export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (meal: Meal) => {
    setMeals((prev) => [...prev, meal]);
  };

  return (
    <MealContext.Provider value={{ meals, addMeal }}>
      {children}
    </MealContext.Provider>
  );
};

// Custom Hook
export const useMeal = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMeal must be used within a MealProvider");
  }
  return context;
};

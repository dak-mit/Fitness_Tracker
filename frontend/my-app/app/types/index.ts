export interface Workout {
  _id: string;
  duration: number;
  calories: number;
  date: string;
  activity: string;
  notes?: string;
}

export interface Meal {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  mealType: string;
}

export interface Goal {
  _id: string;
  name: string;
  type: string;
  target: number;
  deadline: string;
  progress: number;
  completed: boolean;
  createdAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  height?: number;
  weight?: number;
  age?: number;
}

"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/components/calStyles.css";

const WorkoutCalendar = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchWorkouts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      console.log('Raw workouts from backend:', data);
      const formattedWorkouts = data.map((workout: any) => ({
        ...workout,
        workoutName: workout.name || workout.activity || 'Unnamed Workout', // Use activity as fallback
        date: new Date(workout.date).toLocaleDateString('en-CA', { timeZone: 'UTC' }),
      }));
      console.log('Formatted workouts:', formattedWorkouts);
      setWorkouts(formattedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchWorkouts();
}, []);

const groupedWorkouts = workouts.reduce((acc: { [key: string]: string[] }, workout) => {
  const dateKey = workout.date;
  if (!acc[dateKey]) {
    acc[dateKey] = [];
  }
  const workoutName = workout.workoutName || 'Unnamed Workout';
  acc[dateKey].push(workoutName);
  return acc;
}, {});
console.log('Grouped workouts:', groupedWorkouts);
    
  return (
    <div className="relative p-4">
      <Calendar className="custom-calendar"
        
        tileContent={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            const workoutList = groupedWorkouts[formattedDate] || [];
            return(
            <div
              className="flex justify-center items-center mt-5"
            >
              {workoutList.length > 0 ? (
                  workoutList.map((workout, index) => (
                    <span key={index} className="text-blue-600 font-semibold block text-xs">
                      {workout}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs"></span>
                )}
            </div>
          )
        }}
      />

      {/* Workout Tooltip */}
      {/* {hoveredDate && workoutsByDate[hoveredDate] && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white p-3 rounded shadow-md z-50">
          <h3 className="text-lg font-semibold">Workouts on {hoveredDate}</h3>
          <ul>
            {workoutsByDate[hoveredDate].map((exercise, index) => (
              <li key={index}>
                {exercise.activity} - {exercise.duration} min
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default WorkoutCalendar;

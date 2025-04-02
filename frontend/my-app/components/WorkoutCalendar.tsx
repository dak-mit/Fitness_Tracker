"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useWorkout } from "@/context/WorkoutContext";
import "@/components/calStyles.css";

const WorkoutCalendar = () => {
  const { workouts } = useWorkout();
//   const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Convert workouts array into a dictionary { "YYYY-MM-DD": [workouts] }
//   const workoutsByDate: { [key: string]: any[] } = {};
//   workouts.forEach((workout) => {
//     const dateKey = new Date(workout.date).toISOString().split("T")[0];
//     if (!workoutsByDate[dateKey]) {
//       workoutsByDate[dateKey] = [];
//     }
//     workoutsByDate[dateKey].push(workout);
//   });
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const dateKey = workout.date; // '2025-04-01'
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout.workoutName); // Store only the workout name
    return acc;
  }, {});
    
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

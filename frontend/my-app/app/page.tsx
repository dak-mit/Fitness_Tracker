"use client";
import Layout from "../components/Layout";
import { useWorkout } from "../context/WorkoutContext";
import { useState } from "react";
import WorkoutCalendar from "../components/WorkoutCalendar";

// Helper function to filter weekly workouts
const getWeeklyWorkouts = (workouts: any[]) => {
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const currentWeekEnd = new Date(currentDate);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= currentWeekStart && workoutDate <= currentWeekEnd;
  });
};

export default function Home() {
  const { workouts } = useWorkout();
  const [activeTab, setActiveTab] = useState("all-time");

  // Calculate stats for all time
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const totalWorkouts = workouts.length;

  // Weekly view stats
  const weeklyWorkouts = getWeeklyWorkouts(workouts);
  const weeklyDuration = weeklyWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const weeklyCalories = weeklyWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const weeklyWorkoutsCount = weeklyWorkouts.length;

  return (
    <Layout>
      <div className="mt-6 bg-white text-black p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Fitness Summary - March 2025</h2>

        {/* Fitness Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Duration</h3>
            <p className="text-2xl font-bold">{activeTab === "all-time" ? totalDuration : weeklyDuration} min</p>
          </div>

          <div className="p-4 bg-gray-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Calories Burned</h3>
            <p className="text-2xl font-bold">{activeTab === "all-time" ? totalCalories : weeklyCalories} kcal</p>
          </div>

          <div className="p-4 bg-gray-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Workouts</h3>
            <p className="text-2xl font-bold">{activeTab === "all-time" ? totalWorkouts : weeklyWorkoutsCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`p-3 ${activeTab === "all-time" ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"}`}
            onClick={() => setActiveTab("all-time")}
          >
            All Time
          </button>
          <button
            className={`p-3 ml-4 ${activeTab === "weekly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"}`}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly View
          </button>
          <button
            className={`p-3 ml-4 ${activeTab === "calendar" ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar View
          </button>
        </div>

        {/* Workout Table */}

        {activeTab === "calendar" ? (
          <WorkoutCalendar/>
        ) : (
            <>
           
        <table className="w-full mt-6 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Activity</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Calories</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "all-time" ? workouts : weeklyWorkouts).map((workout, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{workout.date}</td>
                <td className="p-2">{workout.activity}</td>
                <td className="p-2">{workout.duration} min</td>
                <td className="p-2">{workout.calories} kcal</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No data message for weekly view */}
        {activeTab === "weekly" && weeklyWorkouts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No workouts this week</p>
              )}
               </>
        )}
      </div>
    </Layout>
  );
}

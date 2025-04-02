"use client";
import Layout from "../../../components/Layout";
import { useWorkout } from "../../../context/WorkoutContext";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,Label } from "recharts";

// Helper function to format workouts by day and activity
const getWeeklyCaloriesData = (workouts: any[]) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize weekly data structure
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    run: 0,
    cycle: 0,
    swim: 0,
    weightlifting: 0,
    yoga: 0,
  }));

  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  // Filter workouts for the current week
  const weeklyWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= currentWeekStart && workoutDate <= currentWeekEnd;
  });

  // Group calories burned by day and activity
  weeklyWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.date);
    const dayIndex = workoutDate.getDay();
    const activity = workout.activity.toLowerCase();

    if (weeklyData[dayIndex][activity] !== undefined) {
      weeklyData[dayIndex][activity] += workout.calories;
    }
  });

  return weeklyData;
};

const StatsPage = () => {
  const { workouts } = useWorkout();
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const data = getWeeklyCaloriesData(workouts);
    setWeeklyData(data);
  }, [workouts]);

  return (
    <Layout>
      <div className="mt-6 bg-white text-black p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Weekly Calories Burned</h2>

        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="day">
              <Label value="Days of the Week" offset={-3} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Calories Burned (kcal)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
              <Tooltip />
              <Legend />
              
              <Bar dataKey="run" fill="#82ca9d" name="Run" />
              <Bar dataKey="cycle" fill="#8884d8" name="Cycle" />
              <Bar dataKey="swim" fill="#ffc658" name="Swim" />
              <Bar dataKey="weightlifting" fill="#ff7300" name="Weightlifting" />
              <Bar dataKey="yoga" fill="#ff6384" name="Yoga" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-4">No workouts recorded this week.</p>
        )}
      </div>
    </Layout>
  );
};

export default StatsPage;

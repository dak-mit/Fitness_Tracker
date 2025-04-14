"use client";
import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,Label } from "recharts";

// Helper function to format workouts by day and activity
const getWeeklyCaloriesData = (workouts: any[]) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];

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

// Calculate Monday of current week
const currentWeekStart = new Date(currentDate);
const day = currentDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
const diffToMonday = (day === 0 ? -6 : 1) - day; 
currentWeekStart.setDate(currentDate.getDate() + diffToMonday);

// Sunday of current week
const currentWeekEnd = new Date(currentWeekStart);
currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
const isSameOrAfter = (date1, date2) =>
  date1.setHours(0,0,0,0) >= date2.setHours(0,0,0,0)

  const isSameOrBefore = (date1, date2) =>
    date1.setHours(0, 0, 0, 0) <= date2.setHours(0, 0, 0, 0)
// Filter workouts for current week
const weeklyWorkouts = workouts.filter((workout) => {
  const workoutDate = new Date(workout.date);
  return (isSameOrAfter(workoutDate, currentWeekStart) &&
    isSameOrBefore(workoutDate, currentWeekEnd));
  });

  // Group calories burned by day and activity
  weeklyWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.date);
    const jsDayIndex = workoutDate.getDay();
    const dayIndex = (jsDayIndex+6)%7;
    const activity = workout.activity.toLowerCase();

    if (weeklyData[dayIndex][activity] !== undefined) {
      weeklyData[dayIndex][activity] += workout.calories;
    }
  });

  return weeklyData;
};

const StatsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async() =>{
      try {
        const response = await fetch('http://localhost:4000/api/workouts',{
          credentials:"include",
        });

        if(!response.ok){
          throw new Error('Failed to fetch workouts')
        }
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };  

    fetchWorkouts();
  }, []);

  //To Update Weekly Data
  useEffect(() => {
    const data = getWeeklyCaloriesData(workouts);
    setWeeklyData(data);
  }, [workouts]);

  return (
    <Layout>
      <div className="mt-6 bg-white text-black p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Weekly Calories Burned</h2>

        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={550}>
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom:25 }}>
            <XAxis dataKey="day" stroke="black">
              <Label value="Days of the Week" offset={-5} dy={10}  position="insideBottom" style={{ textAnchor: "middle",fontWeight:"bold",fill:"black" }} />
            </XAxis>
            <YAxis stroke="black">
              <Label
                value="Calories Burned (kcal)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle",fontWeight:"bold",fill:"black" }}
              />
            </YAxis>
              <Tooltip />
              <Legend 
      verticalAlign="top" 
      align="center" 
      wrapperStyle={{ marginBottom: 20 }} // ⬅️ Optional spacing tweak
    />
              
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

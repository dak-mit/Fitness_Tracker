"use client";
import NutriLayout from "../../../components/NutriLayout";
//import { useMeal } from "../../../context/MealContext";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,Label } from "recharts";

// Helper function to format workouts by day and activity
const getWeeklyMealsData = (meals: any[]) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];

  // Initialize weekly data structure
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    Breakfast: 0,
    Lunch: 0,
    Dinner: 0,
    Evening: 0,
    Other: 0,
  }));

  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  // Filter workouts for the current week
  const weeklyMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.date);
    return mealDate >= currentWeekStart && mealDate <= currentWeekEnd;
  });

  // Group calories burned by day and activity
  weeklyMeals.forEach((meal) => {
    const mealDate = new Date(meal.date);
    const jsDayIndex = mealDate.getDay();
    const dayIndex = (jsDayIndex+6)%7;
    const nutrition = meal.nutrition.charAt(0).toUpperCase() + meal.nutrition.slice(1).toLowerCase();


    if (weeklyData[dayIndex][nutrition] !== undefined) {
      weeklyData[dayIndex][nutrition] += meal.calories;
    }
  });

  return weeklyData;
};

const StatsPage = () => {
  //const { meals } = useMeal();
    const [meals, setMeals] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        const fetchNutritions = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/nutrition',{
                  credentials:"include"
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch workouts')
                }
                const data = await response.json();
                setMeals(data);
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        };
        fetchNutritions();
  }, []);

  useEffect(() => {
    const data = getWeeklyMealsData(meals);
    setWeeklyData(data);
  }, [meals]);
    
  return (
    <NutriLayout>
      <div className="m-5 bg-white text-black p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Weekly Calories Consumed</h2>

        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={550}>
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <XAxis dataKey="day" stroke="black">
              <Label value="Days of the Week" offset={-5} dy={10} position="insideBottom" style={{ textAnchor: "middle",fontWeight:"bold",fill:"black" }} />
            </XAxis>
            <YAxis stroke="black">
              <Label
                value="Calories Consumed (kcal)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle",fontWeight:"bold",fill:"black" }}
              />
            </YAxis>
              <Tooltip />
              <Legend 
              verticalAlign="top" 
              align="center" 
              wrapperStyle={{ marginBottom: 20 }}
              />
              
              <Bar dataKey="Breakfast" fill="#82ca9d" name="Breakfast" />
              <Bar dataKey="Lunch" fill="#8884d8" name="Lunch" />
              <Bar dataKey="Dinner" fill="#ffc658" name="Dinner" />
              <Bar dataKey="Evening" fill="#ff7300" name="Evening Snacks" />
              <Bar dataKey="Other" fill="#ff6384" name="Other" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-4">No meals recorded this week.</p>
        )}
      </div>
    </NutriLayout>
  );
};

export default StatsPage;
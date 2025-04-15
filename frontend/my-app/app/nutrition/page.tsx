"use client";
import NutriLayout from "../../components/NutriLayout";
//import { useMeal } from "../../context/MealContext";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faUtensils,faBurger, faEgg, faCookie, faBowlRice, faWineGlass, faPlateWheat, faBowlFood } from "@fortawesome/free-solid-svg-icons";
//import WorkoutCalendar from "../../components/WorkoutCalendar";

// Helper function to filter weekly workouts
const getWeeklyMeals = (meals: any[]) => {
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  const day = currentDate.getDay(); // 0=Sun, 1=Mon,...6=Sat
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  currentWeekStart.setDate(currentDate.getDate() + diffToMonday);
  
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  // Strip time from week start & end
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekEnd.setHours(23, 59, 59, 999);  // inclusive till end of Sunday

  return meals.filter((meal) => {
    const mealDate = new Date(meal.date);
    mealDate.setHours(0, 0, 0, 0);  // Strip time

    return mealDate >= currentWeekStart && mealDate <= currentWeekEnd;
  });
};


export default function Home() {
  //const { meals } = useMeal();
  const [meals, setMeals] = useState([]);
  const [activeTab, setActiveTab] = useState("all-time");

  useEffect(() => {
    fetchNutritions().catch((error) => {
      console.error('Error fetching meals:', error);
    });
  }, []);

  const fetchNutritions = async()=>{
    try {
      const response = await fetch('http://localhost:4000/api/nutrition',{
        credentials:"include"
      });
      if(!response.ok){
        throw new Error('Failed to fetch meals')
      }
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  // Handle deleting a workout
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    setIsDeleting(true);
  try {
    const response = await fetch(`http://localhost:4000/api/nutrition/${id}`, {
      method: 'DELETE',
      credentials:"include"
    });

    if (!response.ok) {
      throw new Error('Failed to delete meal');
    }

    fetchNutritions();
  } catch (error) {
    console.error('Error deleting nutrition:', error.message);
    alert('Failed to delete nutrition. Please try again.');
  } finally {
    setIsDeleting(false);
  }
  };

  // Calculate stats for all time
  //const totalDuration = meals.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = meals.reduce((sum, w) => sum + (w.calories || 0), 0);
  const totalMeals = meals.length;

  // Weekly view stats
  const weeklyMeals = getWeeklyMeals(meals);
  //const weeklyDuration = weeklyMeals.reduce((sum, w) => sum + (w.duration || 0), 0);
  const weeklyCalories = weeklyMeals.reduce((sum, w) => sum + (w.calories || 0), 0);
  const weeklyMealsCount = weeklyMeals.length;

  return (
    <NutriLayout>
      <div className="m-5 bg-white text-black p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Nutrition Summary</h2>

        {/* Fitness Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#f9fafa] rounded-lg text-center">
            <h3 className="text-lg font-medium"><FontAwesomeIcon icon={faBurger} className="fa-fw text-[#3b84d9]"/>Calories Consumed</h3>
            <p className="text-2xl font-semibold">{activeTab === "all-time" ? totalCalories : weeklyCalories} kcal</p>
          </div>

          <div className="p-4 bg-[#f9fafa] rounded-lg text-center">
            <h3 className="text-lg font-medium"><FontAwesomeIcon icon={faUtensils} className="fa-fw text-[#3b84d9]"/>Meals</h3>
            <p className="text-2xl font-semibold">{activeTab === "all-time" ? totalMeals : weeklyMealsCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 pb-2">
  <button
    className={`p-3 ${activeTab === "all-time" ? "block bg-[#3b84d9] px-4 rounded-4xl duration-200 text-white font-bold" : "text-gray-600 hover:block hover:bg-[#74afe6] hover:px-4 hover:rounded-4xl hover:duration-300 hover:text-white hover:font-bold"}`}
    onClick={() => setActiveTab("all-time")}
  >
    All Time
  </button>
  <button
    className={`p-3 ml-4 ${activeTab === "weekly" ? "block bg-[#3b84d9] px-4 rounded-4xl duration-200 text-white font-bold" : "text-gray-600 hover:block hover:bg-[#74afe6] hover:px-4 hover:rounded-4xl hover:duration-300 hover:text-white hover:font-bold"}`}
    onClick={() => setActiveTab("weekly")}
  >
    Weekly View
  </button>
</div>

{/* Workout Table (All-Time and Weekly Share Same Table Structure) */}
<table className="w-full mt-6 border-t border-b">
  <thead>
    <tr className="bg-white">
      <th className="p-2 text-left border-top w-1/5">Date</th>
              <th className="p-2 text-left w-1/5">Meal Type</th>
              <th className="p-2 text-left w-1/5">Meal</th>
              <th className="p-2 text-left w-1/5">Calories</th>
              <th className="p-2 text-left w-1/5"></th>
    </tr>
  </thead>
  <tbody>
            {(activeTab === "all-time" ? meals : weeklyMeals)
              .slice()
              .sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())
              .map((meal, index) => (
      <tr key={index} className="border-t">
        <td className="p-2 w-1/5">{new Date(meal.date).toLocaleDateString("en-GB")}</td>
        <td className="p-2 w-1/5 flex items-center gap-2">
          {meal.nutrition === "Breakfast" && <FontAwesomeIcon icon={faEgg} className="fa-fw text-[#3b84d9]" />}
          {meal.nutrition === "Lunch" && <FontAwesomeIcon icon={faUtensils} className="fa-fw text-[#3b84d9]" />}
          {meal.nutrition === "Dinner" && <FontAwesomeIcon icon={faWineGlass} className="fa-fw text-[#3b84d9]" />}
          {meal.nutrition === "Snacks" && <FontAwesomeIcon icon={faCookie} className="fa-fw text-[#3b84d9]" />}
          {meal.nutrition === "Others" && <FontAwesomeIcon icon={faBowlFood} className="fa-fw text-[#3b84d9]" />}
          {meal.nutrition.charAt(0).toUpperCase()+meal.nutrition.slice(1)}
        </td>
        <td className="p-2 w-1/5">{meal.mealName}</td>
        <td className="p-2 w-1/5">{meal.calories} kcal </td>
        <td className="p-2 w-1/5">
        <button onClick={() => handleDelete(meal._id)} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : <FontAwesomeIcon icon={faTrash} className="fa-fw"/>}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        {/* No data message for weekly view */}
        {activeTab === "weekly" && weeklyMeals.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No meals this week</p>
              )}
               
        
      </div>
    </NutriLayout>
  );
}
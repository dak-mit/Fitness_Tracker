"use client";
import HomeLayout from '../../components/HomeLayout';
import React,{ useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot, faCircleNodes, faClock, faDumbbell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { error } from 'console';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [meals, setMeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [aiResponse, setAIResponse] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(()=> {
      const fetchAll = async() => {
        try{
          const [userRes, workoutRes, mealRes] = await Promise.all([
            fetch("http://localhost:4000/api/auth/me",{credentials:"include"}),
            fetch("http://localhost:4000/api/workouts",{credentials:"include"}),
            fetch("http://localhost:4000/api/nutrition",{credentials:"include"}),
          ]);

          if(!userRes.ok || !workoutRes.ok || !mealRes.ok){
            throw new Error("Failed to fetch data");
          }
          const userData = await userRes.json();
          const workoutsData = await workoutRes.json();
          const mealData = await mealRes.json();
          setUser(userData);
          setWorkouts(workoutsData);
          setMeals(mealData);
        } catch (err) {
          console.error("Failed to fetch home data:", err);
          router.push("/login"); // optional redirect if needed
        } finally {
          setLoading(false);
        }
        
      };
      fetchAll();
    },[])

    const getTotalCaloriesBurned = () => {
      return workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    };
  
    const getTotalCaloriesConsumed = () => {
      return meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    };


    const handleAIRequest = async () => {
      setLoadingAI(true);
      setAIResponse("");
    
      try {
        const [userRes, workoutRes, nutritionRes] = await Promise.all([
          fetch("http://localhost:4000/api/auth/me", { credentials: "include" }),
          fetch("http://localhost:4000/api/workouts", { credentials: "include" }),
          fetch("http://localhost:4000/api/nutrition", { credentials: "include" }),
        ]);
    
        const user = await userRes.json();
        const workouts = await workoutRes.json();
        const nutrition = await nutritionRes.json();
    
        const res = await fetch("http://localhost:4000/api/ai/recommendations", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, workouts, nutrition }),
        });
    
        const data = await res.json();
        setAIResponse(data.message);
      } catch (err) {
        setAIResponse("Something went wrong. Please try again.");
      } finally {
        setLoadingAI(false);
      }
    };

    return (
        <HomeLayout>
<div className="mt-5 ml-5 mr-5 mb-5 bg-white text-black p-6 rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-center">Welcome, {user?.firstName} {user?.lastName}</h2>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
    {/* User Info Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faUser} className="fa-fw text-[#3b84d9] mr-2" />
        User Info
      </h3>
      <div className="space-y-2">
        <p><span className="font-medium">Age:</span> <span className="text-xl font-bold">{user?.age}</span></p>
        <p><span className="font-medium">Weight:</span> <span className="text-xl font-bold">{user?.weight}</span> kg</p>
                <p><span className="font-medium">Height:</span> <span className="text-xl font-bold">{user?.height}</span> cm</p>
                {user?.weight && user?.height && (() => {
    const bmi = user.weight / ((user.height / 100) ** 2);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 18.5 && bmi < 25) category = "Normal";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else category = "Obese";

    return (
      <p>
        <span className="font-medium">BMI:</span>{" "}
        <span className="text-xl font-bold">{bmi.toFixed(2)}</span>{" "}
        <span className="text-gray-600">({category})</span>
      </p>
    );
  })()}
      </div>
    </div>

    {/* Workout Summary Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faDumbbell} className="fa-fw text-[#3b84d9] mr-2" />
        Workout Summary
      </h3>
      <div className="space-y-2">
        <p><span className="text-2xl font-bold">{workouts.length}</span> <br />Total Workouts</p>
        <p><span className="text-2xl font-bold">{getTotalCaloriesBurned()}</span> <br />Calories Burned</p>
      </div>
    </div>

    {/* Nutrition Summary Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faCarrot} className="fa-fw text-[#3b84d9] mr-2" />
        Nutrition Summary
      </h3>
      <div className="space-y-2">
        <p><span className="text-2xl font-bold">{meals.length}</span> <br />Meals Logged</p>
        <p><span className="text-2xl font-bold">{getTotalCaloriesConsumed()}</span> <br />Calories Consumed</p>
      </div>
    </div>
    
                </div>
                <div className="text-center mt-4">
                    <button
                        onClick={()=>router.push("/workouts")}
    className="px-6 py-3 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9] transition"
  >
    View Progress
  </button>
</div>
  <div className="text-center mt-4 space-y-3 flex flex-col items-center gap-4">
    <button
      onClick={handleAIRequest}
      disabled={loadingAI}
      className="px-6 py-3 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9] transition"
    >
      {loadingAI ? "Generating Advice..." : "Get AI Suggestion"}
    </button>

    {aiResponse && (
  <div className="p-6 bg-[#f9fafa] rounded-lg shadow w-[600px] ">
    <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
      <FontAwesomeIcon icon={faCircleNodes} className='text-[#3b84d9] fa-fw'/> AI Recommendation
    </h3>

    {/* Format the response to preserve line breaks */}
    <div className="text-[16px] font-normal whitespace-pre-line">
      {aiResponse.replace(/\*\*/g, "")}
    </div>
  </div>
)}

  </div>        
</div>

        </HomeLayout>
    )
}


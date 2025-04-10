"use client";
import HomeLayout from '../../components/HomeLayout';
import React,{ useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot, faClock, faDumbbell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { error } from 'console';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [meals, setMeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
      const fetchAll = async() => {
        try{
          const [userRes, workoutRes, goalsRes] = await Promise.all([
            fetch("http://localhost:4000/api/auth/me",{credentials:"include"}),
            fetch("http://localhost:4000/api/workouts",{credentials:"include"}),
            fetch("http://localhost:4000/api/goals",{credentials:"include"}),
          ]);

          if(!userRes.ok || !workoutRes.ok || !goalsRes.ok){
            throw new Error("Failed to fetch data");
          }
          const userData = await userRes.json();
          const workoutsData = await workoutRes.json();
          const goalsData = await goalsRes.json();
          setUser(userData);
          setWorkouts(workoutsData);
          setMeals(goalsData);
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




    return (
        <HomeLayout>
<div className="mt-6 bg-white text-black p-6 rounded-lg">
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
                
</div>

        </HomeLayout>
    )
}


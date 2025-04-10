"use client";
import Layout from "../../components/Layout";
//import { useWorkout } from "../../context/MealContext";
import { useEffect, useState } from "react";
import WorkoutCalendar from "../../components/WorkoutCalendar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faClock, faHeart, faDumbbell, faPersonRunning, faFire } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/navigation";
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
  //const { workouts, } = useWorkout();
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [activeTab, setActiveTab] = useState("all-time");

  //Fetching From The Backend
  useEffect(() => {
    fetchWorkouts().catch((error) => {
      console.error('Error fetching workouts:', error);
    });
  }, []);

  const fetchWorkouts = async()=>{
    try {
      const response = await fetch("http://localhost:4000/api/workouts", {
        credentials: "include", 
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

  const [isDeleting, setIsDeleting] = useState(false);

  // Handle deleting a workout
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    setIsDeleting(true);
  try {
    const response = await fetch(`http://localhost:4000/api/workouts/${id}`, {
      method: 'DELETE',
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }

    fetchWorkouts();
  } catch (error) {
    console.error('Error deleting workout:', error.message);
    alert('Failed to delete workout. Please try again.');
  } finally {
    setIsDeleting(false);
  }
  };

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
        <h2 className="text-2xl font-bold mb-4">Fitness Summary</h2>

        {/* Fitness Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-[#f9fafa] rounded-lg text-center">
            <h3 className="text-lg font-medium"><FontAwesomeIcon icon={faClock} className="fa-fw text-[#3b84d9]"/>Total Duration</h3>
            <p className="text-2xl font-semibold">{activeTab === "all-time" ? totalDuration : weeklyDuration} min</p>
          </div>

          <div className="p-4 bg-[#f9fafa] rounded-lg text-center">
            <h3 className="text-lg font-medium"><FontAwesomeIcon icon={faFire} className="fa-fw text-[#3b84d9]"/>Calories Burned</h3>
            <p className="text-2xl font-semibold">{activeTab === "all-time" ? totalCalories : weeklyCalories} kcal</p>
          </div>

          <div className="p-4 bg-[#f9fafa] rounded-lg text-center">
            <h3 className="text-lg font-medium"><FontAwesomeIcon icon={faPersonRunning} className="fa-fw text-[#3b84d9]"/>Workouts</h3>
            <p className="text-2xl font-semibold">{activeTab === "all-time" ? totalWorkouts : weeklyWorkoutsCount}</p>
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
          <button
            className={`p-3 ml-4 ${activeTab === "calendar" ? "block bg-[#3b84d9] px-4 rounded-4xl duration-200 text-white font-bold" : "text-gray-600 hover:block hover:bg-[#74afe6] hover:px-4 hover:rounded-4xl hover:duration-300 hover:text-white hover:font-bold"}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar View
          </button>
          <button
            onClick={()=>router.push("/workouts/add-workout")}
          className="cursor-pointer ml-auto px-4 py-2 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9]"
          >
           + Add Workout
          </button>
        </div>

        {/* Workout Table */}

        {activeTab === "calendar" ? (
          <WorkoutCalendar/>
        ) : (
            <>
           
        <table className="w-full mt-6 border-t border-b">
          <thead>
            <tr className="bg-white">
              <th className="p-2 text-left border-top">Date</th>
              <th className="p-2 text-left">Activity</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Calories</th>
              <th className="p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
                  {(activeTab === "all-time" ? workouts : weeklyWorkouts)
                    .slice() // clone to avoid mutating original
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((workout, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{new Date(workout.date).toLocaleDateString("en-GB")}</td>
                <td className="p-2">{workout.activity.charAt(0).toUpperCase() + workout.activity.slice(1)}</td>
                <td className="p-2">{workout.duration} min</td>
                <td className="p-2">{workout.calories} kcal</td>
                <td className="p-2">
                  <button
                    
                    onClick={() => handleDelete(workout._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : <FontAwesomeIcon icon={faTrash} className="fa-fw"/>}
                  </button>
                </td>
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

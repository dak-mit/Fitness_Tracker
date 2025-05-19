"use client";
import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useAuth } from "@/context/AuthContext";
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Poppins } from "next/font/google";
import { faBullseye, faCheckDouble,faChevronUp,faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Goal } from "../../types";

Modal.setAppElement("body");
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Goals() {
  // const { token, logout } = useAuth();
  // const router = useRouter();
  // console.log("goalsPage render: Token:", token); // Debug on every render

  const [modalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const goalSchema = z.object({
    name: z.string().min(1, "Workout name is required"),
    type: z.string().min(1, "Goal type is required"),
    target: z.number().min(1, "Goal target is required"),
    deadline: z.string().min(1, "Goal deadline is required"),
    progress: z.number().default(0),
    completed: z.boolean().default(false)
  });

  type GoalFormData = z.infer<typeof goalSchema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      progress: 0,
      completed: false
    }
  });

  const calculateProgress = (goal: Goal, workouts: any[]) => {
    let startDate;
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diffToMonday = (day === 0 ? -6 : 1) - day;

  if (goal.deadline === "This week") {
    startDate = new Date(today); // Clone today
    startDate.setDate(startDate.getDate() + diffToMonday); // Move to Monday
  } else if (goal.deadline === "Next week") {
    startDate = new Date(today);
    startDate.setDate(startDate.getDate() + diffToMonday + 7); // Next Monday
  } else {
    startDate = new Date(goal.createdAt || today);
  }
    

  const relevantWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
  
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  
    return (
      workout.name.trim().toLowerCase() === goal.name.trim().toLowerCase() &&
      workoutDate >= start
    );
  });

    let progress = 0;
    if (goal.type === "numWorkouts") {
      const numWorkouts = relevantWorkouts.length;
      progress = (numWorkouts / goal.target) * 100;
    } else if (goal.type === "duration") {
      const totalDuration = relevantWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
      progress = (totalDuration / goal.target) * 100;
    } else if (goal.type === "calories") {
      const totalCalories = relevantWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
      progress = (totalCalories / goal.target) * 100;
    }

    progress = Math.min(Math.round(progress), 100);
    const completed = progress >= 100;

    console.log(
      "Looking for goal:", goal.name,
      "against workouts:", workouts.map(w => w.name)
    );
    console.log("Raw:", workouts[0].date, "Parsed:", new Date(workouts[0].date));

    //console.log("Goal:", goal.workoutName, "Progress:", progress, "%", "Relevant Workouts:", relevantWorkouts);
    console.log("Workout Date:", workouts[0].date, "Parsed:", new Date(workouts[0].date), "Start:", startDate);

    return {
      ...goal,
      progress,
      completed,
    };
  };

  // useEffect(() => {
  //   console.log("goalsPage useEffect: Token:", token); // Debug
  //   if (!token) {
  //     console.log("No token, redirecting to /login");
  //     router.push("/login");
  //   } else {
  //     console.log("Token exists, fetching data");
  //     fetchData();
  //   }
  // }, [token, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const goalsResponse = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/goals", {
          method: "GET",
          credentials:"include",

        });
        if (!goalsResponse.ok) {
          throw new Error("Failed to fetch goals");
        }
        const goalsData = await goalsResponse.json();
        console.log("Fetched goals:", goalsData);

        const workoutsResponse = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/workouts",{
          credentials:"include",
        });

        if (!workoutsResponse.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const workoutsData = await workoutsResponse.json();

        const normalizedGoals = goalsData.map((goal: Goal) => ({
          ...goal,
          workoutName: goal.name, // 🔥 Normalize for consistent access
        }));
        
        const updatedGoals = normalizedGoals.map((goal: Goal) =>
          calculateProgress(goal, workoutsData)
        );
        setGoals(updatedGoals);
        setWorkouts(workoutsData);
      } catch (error) {
        
        setError(error instanceof Error ? error.message : 'An error occurred');
        
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  },[]);

  useEffect(() => {
    if (workouts.length > 0 && goals.length > 0) {
      const updatedGoals = goals.map((goal: Goal) => calculateProgress(goal, workouts));
      setGoals(updatedGoals);
    }
  }, [workouts]);

  const onSubmit = async (data: GoalFormData) => {
    const newGoal = {
      name: data.name,
      type: data.type,
      target: data.target,
      deadline: data.deadline,
      progress: data.progress,
      completed: data.completed
    };

    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/goals", {
        method: "POST",
        credentials:"include",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) {
        throw new Error("Failed to create goal");
      }
      const { goal: createdGoal } = await response.json();
      setGoals((prevGoals) => [...prevGoals, createdGoal]);
      setModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create goal:", error);
      alert("Failed to create goal. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="mt-5 ml-5 mr-5 bg-white text-black p-6 rounded-lg">
        
        <div className="mt-0 bg-white text-black p-4 rounded-lg">
          {/* Active Goals Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${poppins.className}`}>
              <FontAwesomeIcon icon={faBullseye} className="fa-fw text-[#3b84d9]" /> Active Goals
            </h2>
            <button
              className="px-4 py-2 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9]"
              onClick={() => setModalOpen(true)}
            >
              + Add Goal
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {goals
              .filter((goal) => !goal.completed && goal.target && goal.name && goal.type && goal.deadline)
              .map((goal, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24">
                    <CircularProgressbar
                      value={goal.progress}
                      text={`${goal.progress}%`}
                      styles={buildStyles({
                        textColor: "green",
                        pathColor: "#4caf50",
                      })}
                    />
                  </div>
                  <p className="text-center mt-2">
                    {goal.type === "numWorkouts"
                      ? `Complete ${goal.target} ${goal.name} ${goal.deadline}`
                      : goal.type === "calories"
                      ? `Burn ${goal.target} calories from ${goal.deadline} by ${goal.name}`
                      : `Do ${goal.target} minutes of ${goal.name} ${goal.deadline}`}
                  </p>
                </div>
              ))}
          </div>

          {/* Create Goal Form (Modal) */}
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            ariaHideApp={false}
            className="bg-white text-black p-6 rounded-lg w-[600px] mx-auto relative z-50"
            overlayClassName="fixed inset-0 flex justify-center items-center backdrop-blur-sm"
          >
            
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[500px] mx-auto mt-10 p-6 rounded-lg shadow-md text-black">
              <h2 className="text-2xl font-bold mb-6">Add Goal</h2>
              
              {/* Workout Name */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Workout Name <span className="text-red-700">*</span>
                </label>
                <input type="text" {...register("name")} className="w-full p-2 border rounded" />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Goal Type */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Goal Type <span className="text-red-700">*</span>
                </label>
                <select {...register("type")} className="w-full p-2 border rounded">
                  <option value="">Select a goal type</option>
                  <option value="numWorkouts">No. of Workouts</option>
                  <option value="duration">Duration</option>
                  <option value="calories">Calories</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Goal Target */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Goal Target <span className="text-red-700">*</span>
                </label>
                <input
                  type="number"
                  {...register("target", { valueAsNumber: true })}
                  className="w-full p-2 border rounded"
                />
                {errors.target && (
                  <p className="text-red-500 text-sm">{errors.target.message}</p>
                )}
              </div>

              {/* Goal Start */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Start <span className="text-red-700">*</span>
                </label>
                <select {...register("deadline")} className="w-full p-2 border rounded">
                  <option value="">Select starting time</option>
                  <option value="This week">This week</option>
                  <option value="Next week">Next week</option>
                </select>
                {errors.deadline && (
                  <p className="text-red-500 text-sm">{errors.deadline.message}</p>
                )}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9]"
              >
                Save
              </button>
            </form>
          </Modal>

          {/* Completed Goals Section */}
          <div className="mt-8">
  {/* Toggle Header */}
  <div 
              className={`flex items-center border border-[#3b84d9] justify-between cursor-pointer hover:bg-gray-100 p-4 rounded-md
                          ${showCompleted?'bg-gray-100':'bg-white'}`}
    onClick={() => setShowCompleted(!showCompleted)}
  >
    <h2 className="text-xl font-semibold text-gray-700 flex items-center">
      <FontAwesomeIcon icon={faCheckDouble} className="text-[#3b84d9] mr-2" />
      Completed Goals
    </h2>
    <FontAwesomeIcon 
      icon={showCompleted ? faChevronUp : faChevronDown} 
      className="text-black" 
    />
  </div>

  {/* Collapsible Content */}
  {showCompleted && (
  <div className="grid sm:grid-cols-2 gap-4 mt-4">
    {goals
      .filter((goal) => goal.completed)
      .map((goal, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-lg shadow-sm border border-gray-200 bg-white hover:shadow-md transition"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <p className="text-sm text-gray-700">
            {goal.type === "numWorkouts"
              ? `Complete ${goal.target} ${goal.name} ${goal.deadline}`
              : goal.type === "calories"
              ? `Burn ${goal.target} calories from ${goal.deadline} by ${goal.name}`
              : `Do ${goal.target} minutes of ${goal.name} ${goal.deadline}`}
          </p>
        </div>
      ))}
  </div>
)}

</div>


        </div>
      </div>
    </Layout>
  );
};
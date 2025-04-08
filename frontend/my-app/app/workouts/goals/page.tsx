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
import { faBullseye, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

Modal.setAppElement("body");
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const goalsPage = () => {
  const { token, logout } = useAuth();
  const router = useRouter();
  console.log("goalsPage render: Token:", token); // Debug on every render

  const [modalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState<GoalFormData[]>([]);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const goalSchema = z.object({
    workoutName: z.string().min(1, "Workout name is required"),
    goalType: z.string().min(1, "Goal type is required"),
    goalTarget: z.number().min(1, "Goal target is required"),
    goalStart: z.string().min(1, "Goal start is required"),
  });

  type GoalFormData = z.infer<typeof goalSchema> & {
    name: string;
    progress: number;
    completed: boolean;
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  const calculateProgress = (goal, workouts) => {
    let startDate;
    const today = new Date();
    if (goal.goalStart === "This week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
    } else if (goal.goalStart === "Next week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() + 7);
    } else {
      startDate = new Date(goal.createdAt || today);
    }

    const relevantWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workout.workoutName.toLowerCase().includes(goal.name.toLowerCase()) &&
        workoutDate >= startDate
      );
    });

    let progress = 0;
    if (goal.goalType === "numWorkouts") {
      const numWorkouts = relevantWorkouts.length;
      progress = (numWorkouts / goal.goalTarget) * 100;
    } else if (goal.goalType === "duration") {
      const totalDuration = relevantWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
      progress = (totalDuration / goal.goalTarget) * 100;
    } else if (goal.goalType === "calories") {
      const totalCalories = relevantWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
      progress = (totalCalories / goal.goalTarget) * 100;
    }

    progress = Math.min(Math.round(progress), 100);
    const completed = progress >= 100;

    return {
      ...goal,
      progress,
      completed,
    };
  };

  useEffect(() => {
    console.log("goalsPage useEffect: Token:", token); // Debug
    if (!token) {
      console.log("No token, redirecting to /login");
      router.push("/login");
    } else {
      console.log("Token exists, fetching data");
      fetchData();
    }
  }, [token, router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const goalsResponse = await fetch("http://localhost:4000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!goalsResponse.ok) {
        const errorText = await goalsResponse.text();
        console.log("Goals response error:", goalsResponse.status, errorText);
        throw new Error(`Failed to fetch goals: ${goalsResponse.status}`);
      }
      const goalsData = await goalsResponse.json();
      console.log("Fetched goals:", goalsData);

      const workoutsResponse = await fetch("http://localhost:4000/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!workoutsResponse.ok) {
        const errorText = await workoutsResponse.text();
        console.log("Workouts response error:", workoutsResponse.status, errorText);
        throw new Error(`Failed to fetch workouts: ${workoutsResponse.status}`);
      }
      const workoutsData = await workoutsResponse.json();

      const updatedGoals = goalsData.map((goal) => calculateProgress(goal, workoutsData));
      setGoals(updatedGoals);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(error.message);
      if (error.message.includes("401") || error.message.includes("403")) {
        console.log("Unauthorized, redirecting to /login");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workouts.length > 0 && goals.length > 0) {
      const updatedGoals = goals.map((goal) => calculateProgress(goal, workouts));
      setGoals(updatedGoals);
    }
  }, [workouts]);

  const onSubmit = async (data: GoalFormData) => {
    const newGoal = {
      name: data.workoutName,
      goalType: data.goalType,
      goalTarget: data.goalTarget,
      goalStart: data.goalStart,
      progress: 0,
      completed: false,
    };

    try {
      const response = await fetch("http://localhost:4000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      <div className="mt-6 bg-white text-black p-6 rounded-lg">
        <button
          onClick={logout}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
        <div className="mt-6 bg-white text-black p-6 rounded-lg">
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
              .filter((goal) => !goal.completed && goal.goalTarget && goal.name && goal.goalType && goal.goalStart)
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
                    {goal.goalType === "numWorkouts"
                      ? `Complete ${goal.goalTarget} ${goal.name} ${goal.goalStart}`
                      : goal.goalType === "calories"
                      ? `Burn ${goal.goalTarget} calories from ${goal.goalStart} by ${goal.name}`
                      : `Do ${goal.goalTarget} minutes of ${goal.name} ${goal.goalStart}`}
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
                <input type="text" {...register("workoutName")} className="w-full p-2 border rounded" />
                {errors.workoutName && <p className="text-red-500 text-sm">{errors.workoutName.message}</p>}
              </div>

              {/* Goal Type */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Goal Type <span className="text-red-700">*</span>
                </label>
                <select {...register("goalType")} className="w-full p-2 border rounded">
                  <option value="">Select a goal type</option>
                  <option value="numWorkouts">No. of Workouts</option>
                  <option value="duration">Duration</option>
                  <option value="calories">Calories</option>
                </select>
                {errors.goalType && <p className="text-red-500 text-sm">{errors.goalType.message}</p>}
              </div>

              {/* Goal Target */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Goal Target <span className="text-red-700">*</span>
                </label>
                <input
                  type="number"
                  {...register("goalTarget", { valueAsNumber: true })}
                  className="w-full p-2 border rounded"
                />
                {errors.goalTarget && <p className="text-red-500 text-sm">{errors.goalTarget.message}</p>}
              </div>

              {/* Goal Start */}
              <div className="mb-4">
                <label className="block text-black-700">
                  Start <span className="text-red-700">*</span>
                </label>
                <select {...register("goalStart")} className="w-full p-2 border rounded">
                  <option value="">Select starting time</option>
                  <option value="This week">This week</option>
                  <option value="Next week">Next week</option>
                </select>
                {errors.goalStart && <p className="text-red-500 text-sm">{errors.goalStart.message}</p>}
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
          <h2 className={`text-xl font-semibold mt-8 mb-4 text-gray-500 ${poppins.className}`}>
            <FontAwesomeIcon icon={faCheckDouble} className="fa-fw text-[#3b84d9]" /> Completed Goals
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {goals
              .filter((goal) => goal.completed)
              .map((goal, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className=" relative w-24 h-24">
                    <CircularProgressbar
                      value={100}
                      
                      styles={buildStyles({
                        textColor: "#fff",
                        pathColor: "#4caf50",
                      })}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-green-600 text-2xl">
    <FontAwesomeIcon icon={faCheckDouble} />
  </div>
                  </div>
                  <p className="text-center mt-2">
                    {goal.goalType === "numWorkouts"
                      ? `Complete ${goal.goalTarget} ${goal.name} ${goal.goalStart}`
                      : goal.goalType === "calories"
                      ? `Burn ${goal.goalTarget} calories from ${goal.goalStart} by ${goal.name}`
                      : `Do ${goal.goalTarget} minutes of ${goal.name} ${goal.goalStart}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default goalsPage;
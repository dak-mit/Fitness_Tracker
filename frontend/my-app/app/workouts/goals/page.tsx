"use client";
import Layout from "@/components/Layout";
import React,{useState,useEffect} from "react";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Poppins } from "next/font/google";
import { faBullseye,faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


Modal.setAppElement("body");
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const goalsPage = () => {
  //const [showForm, setShowForm] = useState(false);

  // const [goals, setGoals] = useState([
  //   { name: "Run 10km", progress: 70, completed: false },
  //   { name: "Lose 5kg", progress: 100, completed: true },
  // ]);
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
    
  type GoalFormData = z.infer<typeof goalSchema>& {
    name: string;         // coming from backend
    progress: number;
    completed: boolean;
  };
    
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<GoalFormData>({
      resolver: zodResolver(goalSchema),
    });


    const calculateProgress = (goal, workouts) => {
      // Determine the start date based on goalStart
      let startDate;
      const today = new Date();
      if (goal.goalStart === "This week") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
      } else if (goal.goalStart === "Next week") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + 7); // Start of next week
      } else {
        startDate = new Date(goal.createdAt || today); // Fallback to creation date or today
      }

      // Filter workouts that match the goal's name and are after the start date
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

      // Cap progress at 100% and round to the nearest integer
      progress = Math.min(Math.round(progress), 100);

      // Update completed status
      const completed = progress >= 100;

      // Return updated goal
      return {
        ...goal,
        progress,
        completed,
      };
    };

    //Code To Fetch Goals And Workouts From The Backend
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null)
        try {
          const goalsResponse = await fetch("http://localhost:4000/api/goals");
          if(!goalsResponse.ok) {
            throw new Error("Failed to fetch goals");
          }
          const goalsData = await goalsResponse.json();
          console.log("Fetched goals:", goalsData);
          const workoutsResponse = await fetch("http://localhost:4000/api/workouts");
          if(!workoutsResponse.ok) {
            throw new Error("Failed to fetch workouts");
          }
          const workoutsData = await workoutsResponse.json();

          const updatedGoals = goalsData.map((goal) => calculateProgress(goal, workoutsData));

          setGoals(updatedGoals);
          setWorkouts(workoutsData);
        } catch (error) {
          setError(error.message);
        }finally{
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);


    useEffect(() => {
      if(workouts.length >0 && goals.length > 0) {
        const updatedGoals = goals.map((goal) => calculateProgress(goal,workouts));
        setGoals(updatedGoals);
      }
    },[workouts]);

    const onSubmit = async (data: GoalFormData) => {
      const newGoal = {
        name: data.workoutName,
        goalType: data.goalType,
        goalTarget: data.goalTarget,
        goalStart:data.goalStart,
        progress: 0,
        completed:false,
      }
      
      // setGoals((prevGoals) => [...prevGoals, newGoal]);
      // console.log("Closing modal...");
      // setModalOpen(false);

      try{
        const response = await fetch("http://localhost:4000/api/goals",{
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify(newGoal)
        });
        if(!response.ok){
          throw new Error("Failed To create GOAL");
        }
        const {goal:createdGoal} = await response.json();
        setGoals((prevGoals) => [...prevGoals, createdGoal]);
        setModalOpen(false);
        reset();
      }catch(error){
        console.error("Failed to create goal:", error);
        alert("Failed To Create Goal. Please Try Again.")
      }
    };
  

    return (
      <Layout>
        <div className="mt-6 bg-white text-black p-6 rounded-lg">
          {/* Active Goals Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${poppins.className}`}><FontAwesomeIcon icon={faBullseye} className="fa-fw text-[#3b84d9]"/>Active Goals</h2>
          <button
          className="px-4 py-2 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9]"
          onClick={() => setModalOpen(true)}
          >
           + Add Goal
          </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {goals
              .filter((goal) => !goal.completed)
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
                  <p className="text-center mt-2">{goal.goalType === "numWorkouts"
          ? `Complete ${goal.goalTarget} ${goal.name} ${goal.goalStart}`
          : goal.goalType === "calories"
          ? `Burn ${goal.goalTarget} calories from ${goal.goalStart} by ${goal.name}`
          : `Do ${goal.goalTarget} minutes of ${goal.name} ${goal.goalStart}`}</p>
                </div>
              ))}
          </div>

          {/* Create Goal Button */}
          

          {/* Create Goal Form (hidden by default) */}
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            ariaHideApp={false}
            className="bg-white text-black p-6 rounded-lg w-[600px] mx-auto relative z-50"
            overlayClassName="fixed inset-0 flex justify-center items-center backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold mb-6">Add Goal</h2>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 w-8 h-8 rounded-full text-white hover:text-red-500 hover:bg-white border hover:border-red-500 text-2xl"
            >
              &times;
            </button>
            
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md text-black">
                {/* Workout Name */}
                <div className="mb-4">
                  <label className="block text-black-700">Workout Name <span className="text-red-700">*</span></label>
                  <input type="text" {...register("workoutName")} className="w-full p-2 border rounded" />
                  {errors.workoutName && <p className="text-red-500 text-sm">{errors.workoutName.message}</p>}
                </div>

                {/* goal type */}
                <div className="mb-4">
                  <label className="block text-black-700">Goal Type <span className="text-red-700">*</span></label>
                  <select {...register("goalType")} className="w-full p-2 border rounded">
                    <option value="">Select a goal type</option>
                    <option value="numWorkouts">No. of Workouts</option>
                    <option value="duration">Duration</option>
                    <option value="calories">Calories</option>
                    
                  </select>
                  {errors.goalType && <p className="text-red-500 text-sm">{errors.goalType.message}</p>}
                </div>

                {/* goal target */}
                <div className="mb-4">
                  <label className="block text-black-700">Goal Target <span className="text-red-700">*</span></label>
                  <input type="number" {...register("goalTarget", { valueAsNumber: true })} className="w-full p-2 border rounded" />
                  {errors.goalTarget && <p className="text-red-500 text-sm">{errors.goalTarget.message}</p>}
                </div>

                {/* goal start */}
                <div className="mb-4">
                  <label className="block text-black-700">Start <span className="text-red-700">*</span></label>
                  <select {...register("goalStart")} className="w-full p-2 border rounded">
                    <option value="">Select starting time</option>
                    <option value="This week">This week</option>
                    <option value="Next week">Next week</option>
                  </select>
                  {errors.goalStart && <p className="text-red-500 text-sm">{errors.goalStart.message}</p>}
                </div>

                {/* Save Button */}
                <button type="submit" className="w-full px-4 py-2 bg-[#3b84d9] text-white font-bold rounded-4xl hover:text-[#3b84d9] hover:bg-white border hover:border-[#3b84d9]">
                  Save
                </button>
              </form>
            
          </Modal>

          {/* Completed Goals Section */}
          <h2 className={`text-xl font-semibold mt-8 mb-4 text-gray-500 ${poppins.className}`}><FontAwesomeIcon icon={faCheckDouble} className="fa-fw text-[#3b84d9]"/>Completed Goals</h2>
          <div className="grid grid-cols-3 gap-6">
            {goals
              .filter((goal) => goal.completed)
              .map((goal, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24">
                  <CircularProgressbar
                    value={100}
                    text="✅"
                    styles={buildStyles({
                      textColor: "#fff",
                      pathColor: "#4caf50",
                    })}
                    />
                    </div>
                  <p className="text-center mt-2">{goal.name}</p>
                </div>
              ))}
          </div>
        </div>
      </Layout>
    )
  
};

export default goalsPage;
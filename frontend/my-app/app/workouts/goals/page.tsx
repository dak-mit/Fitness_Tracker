"use client";
import Layout from "@/components/Layout";
import React,{useState} from "react";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
Modal.setAppElement("body");

const goalsPage = () => {
  const [showForm, setShowForm] = useState(false);

  const [goals, setGoals] = useState([
    { name: "Run 10km", progress: 70, completed: false },
    { name: "Lose 5kg", progress: 100, completed: true },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const goalSchema = z.object({
    workoutName: z.string().min(1, "Workout name is required"),
    goalType: z.string().min(1, "Goal type is required"),
    goalTarget: z.number().min(1, "Goal target is required"),
    goalStart: z.string().min(1, "Goal start is required"),
  });
    
  type GoalFormData = z.infer<typeof goalSchema>;
    
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<GoalFormData>({
      resolver: zodResolver(goalSchema),
    });
    
    const onSubmit = (data: GoalFormData) => {
      const newGoal = {
        name: data.workoutName,
        typeOfGoal: data.goalType,
        targetOfGoal: data.goalTarget,
        goalStart:data.goalStart,
        progress: 0,
        completed:false,
      }
      setGoals((prevGoals) => [...prevGoals, newGoal]);
      console.log("Closing modal...");
      setModalOpen(false);
    };
  

    return (
      <Layout>
        <div className="p-4">
          {/* Active Goals Section */}
          <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
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
                      textColor: "#fff",
                      pathColor: "#4caf50",
                    })}
                  />
                  </div>
                  <p className="text-center mt-2">{goal.typeOfGoal === "numWorkouts"
          ? `Complete ${goal.targetOfGoal} ${goal.name} ${goal.goalStart}`
          : goal.typeOfGoal === "calories"
          ? `Burn ${goal.targetOfGoal} calories from ${goal.goalStart} by ${goal.name}`
          : `Do ${goal.targetOfGoal} minutes of ${goal.name} ${goal.goalStart}`}</p>
                </div>
              ))}
          </div>

          {/* Create Goal Button */}
          <button
            className="mt-16 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setModalOpen(true)}
          >
            + Add Goal
          </button>

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
                  {errors.activity && <p className="text-red-500 text-sm">{errors.goalType.message}</p>}
                </div>

                {/* goal target */}
                <div className="mb-4">
                  <label className="block text-black-700">Goal Target <span className="text-red-700">*</span></label>
                  <input type="number" {...register("goalTarget", { valueAsNumber: true })} className="w-full p-2 border rounded" />
                  {errors.duration && <p className="text-red-500 text-sm">{errors.goalTarget.message}</p>}
                </div>

                {/* goal start */}
                <div className="mb-4">
                  <label className="block text-black-700">Start <span className="text-red-700">*</span></label>
                  <select {...register("goalStart")} className="w-full p-2 border rounded">
                    <option value="">Select starting time</option>
                    <option value="This week">This week</option>
                    <option value="Next week">Next week</option>
                  </select>
                  {errors.activity && <p className="text-red-500 text-sm">{errors.activity.message}</p>}
                </div>

                {/* Save Button */}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                  SAVE
                </button>
              </form>
            
            
            
          </Modal>

          {/* Completed Goals Section */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Completed Goals</h2>
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
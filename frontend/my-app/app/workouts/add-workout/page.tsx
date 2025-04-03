// pages/add-workout.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "../../../components/Layout";
import { useWorkout } from "../../../context/WorkoutContext";
import { useRouter } from "next/navigation";

// Zod Schema
const workoutSchema = z.object({
  workoutName: z.string().min(1, "Workout name is required"),
  startTime: z.string().min(1, "Start time is required"),
  date: z.string().min(1, "Date is required"),
  activity: z.string().min(1, "Activity type is required"),
  duration: z.coerce.number().min(1, "Duration is required"),
  calories: z.coerce.number().min(1, "Calories burned is required"),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

const AddWorkout = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
  });

  //const { addWorkout } = useWorkout(); // Get the addWorkout function
  const router = useRouter();

  // const onSubmit = (data: WorkoutFormData) => {
  //   addWorkout(data); // Save workout to context
  //   reset(); // Clear form
  //   router.push("/workouts"); // Navigate to homepage
  // };

  const onSubmit = async(data: WorkoutFormData) => {
    try{
     const response = await fetch("http://localhost:4000/api/workouts", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
     });
 
     if (!response.ok) {
       throw new Error("Failed to add workout");
     }
     const result = await response.json();
     console.log(result);
 
     reset();
     router.push("/");     //Redirect To DashBoard
    } catch (error) {
     console.error("Error adding workout:", error);
     alert("Failed to add workout");
    }
   };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Add Workout</h2>
      <div className="mt-6 bg-white text-black p-6 rounded-lg w-[600px] mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md text-black">
          {/* Workout Name */}
          <div className="mb-4">
            <label className="block text-black-700">Workout Name <span className="text-red-700">*</span></label>
            <input type="text" {...register("workoutName")} className="w-full p-2 border rounded" />
            {errors.workoutName && <p className="text-red-500 text-sm">{errors.workoutName.message}</p>}
          </div>

          {/* Start Time & Date */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-black-700">Start Time <span className="text-red-700">*</span></label>
              <input type="time" {...register("startTime")} className="w-full p-2 border rounded" />
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-black-700">Date <span className="text-red-700">*</span></label>
              <input type="date" {...register("date")} className="w-full p-2 border rounded" />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
          </div>

          {/* Activity */}
          <div className="mb-4">
            <label className="block text-black-700">Activity <span className="text-red-700">*</span></label>
            <select {...register("activity")} className="w-full p-2 border rounded">
              <option value="">Select an activity type</option>
              <option value="run">Run</option>
              <option value="cycle">Cycle</option>
              <option value="swim">Swim</option>
              <option value="weightlifting">Weightlifting</option>
              <option value="yoga">Yoga</option>
            </select>
            {errors.activity && <p className="text-red-500 text-sm">{errors.activity.message}</p>}
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block text-black-700">Duration (minutes) <span className="text-red-700">*</span></label>
            <input type="number" {...register("duration",{valueAsNumber:true})} className="w-full p-2 border rounded" />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          </div>

          {/* Calories */}
          <div className="mb-4">
            <label className="block text-black-700">Calories Burned (kcal)<span className="text-red-700">*</span></label>
            <input type="number" {...register("calories",{valueAsNumber:true})} className="w-full p-2 border rounded" />
            {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
          </div>

          {/* Save Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
            SAVE
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddWorkout;

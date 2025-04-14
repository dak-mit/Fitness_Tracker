// pages/add-workout.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "../../../components/Layout";
//import { useWorkout } from "../../../context/MealContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDumbbell, faHandsPraying, faPersonBiking, faPersonSwimming, faRunning } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"
import { useState } from "react";
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
  const { register, handleSubmit, setValue, watch,formState: { errors }, reset } = useForm<WorkoutFormData>({
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
       credentials: "include",
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
     router.push("/workouts");     //Redirect To DashBoard
    } catch (error) {
     console.error("Error adding workout:", error);
     alert("Failed to add workout");
    }
   };
   const [viewDate, setViewDate] = useState(new Date());
  return (
    
    <Layout>
      {/* <div className="mt-6 bg-white text-black p-6 rounded-lg w-[600px] mx-auto"> */}
      <div
    className="min-h-screen bg-cover bg-center flex items-center justify-start"
    style={{ backgroundImage: "url('/fitformbg.png')" }}
  >
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-sm shadow-lg w-[400px] h-[500px] mt-10 mb-20 mx-auto ml-5 p-6 rounded-lg shadow-md text-black flex flex-col justify-between ">
        {/* <h2 className="text-2xl font-bold mb-6 text-black text-center">Add Workout</h2> */}
          {/* Workout Name */}
          <div className="mb-4">
            <label className="block text-black-700">Workout Name <span className="text-red-700">*</span></label>
            <input type="text" placeholder="e.g., Run" {...register("workoutName")} className="w-full p-2 border rounded" />
            {errors.workoutName && <p className="text-red-500 text-sm">{errors.workoutName.message}</p>}
          </div>

          {/* Start Time & Date */}
          <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
  <label className="block text-black-700">
    Start Time <span className="text-red-700">*</span>
  </label>

  <DatePicker
    selected={watch("startTime") ? new Date(`1970-01-01T${watch("startTime")}`) : null}
    onChange={(time: Date) => {
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setValue("startTime", formattedTime, { shouldValidate: true });
    }}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15} // shows every 15 min
    timeCaption="Time"
    dateFormat="HH:mm"
    placeholderText="Select time"
    className="w-full p-2 border rounded"
  />

  {errors.startTime && (
    <p className="text-red-500 text-sm">{errors.startTime.message}</p>
  )}
</div>
          

            <div className="w-1/2">
  <label className="block text-black-700">
    Date <span className="text-red-700">*</span>
  </label>

  <DatePicker
  selected={watch("date") ? new Date(watch("date")) : null}
  onChange={(date: Date) => {
    setValue("date", date.toISOString().split('T')[0], { shouldValidate: true })
  }}
  onMonthChange={(date) => setViewDate(date)}   // To track visible month
  maxDate={new Date()}
  placeholderText="Select date"
  dateFormat="dd/MM/yyyy" 
  className="w-full p-2 border rounded"
  renderDayContents={(day, date) => {
    return date.getMonth() === viewDate.getMonth() ? (
      <span>{day}</span>
    ) : (
      <span className="text-gray-400 pointer-events-none">{day}</span>
    )
  }}
/>

  {errors.date && (
    <p className="text-red-500 text-sm">{errors.date.message}</p>
  )}
</div>
          </div>

          {/* Activity */}
          <div className="mb-4">
            <label className="block text-black-700">Activity <span className="text-red-700">*</span></label>
            <div className="flex flex-wrap gap-2">
    {["Run", "Cycle", "Swim", "Weightlifting", "Yoga"].map((activity) => (
      <button
        key={activity}
        type="button"
        onClick={() => setValue("activity", activity.toLowerCase())}  // from react-hook-form
        className={`px-4 py-2 rounded border ${
          watch("activity") === activity.toLowerCase()
            ? "bg-[#1e2938] text-white"
            : "bg-white-100 text-black"
        }`}
      >
        {activity === "Run" && <FontAwesomeIcon icon={faRunning} className="fa-fw" />}
        {activity === "Cycle" && <FontAwesomeIcon icon={faPersonBiking} className="fa-fw" />}
        {activity === "Swim" && <FontAwesomeIcon icon={faPersonSwimming} className="fa-fw" />}
        {activity === "Weightlifting" && <FontAwesomeIcon icon={faDumbbell} className="fa-fw" />}
        {activity === "Yoga" && <FontAwesomeIcon icon={faHandsPraying} className="fa-fw" />}
      </button>
    ))}
  </div>
            {errors.activity && <p className="text-red-500 text-sm">{errors.activity.message}</p>}
          </div>

        {/* Duration */}
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-black-700">Duration (minutes) <span className="text-red-700">*</span></label>
            <input type="number" placeholder="e.g., 30"{...register("duration",{valueAsNumber:true})} className="w-full p-2 border rounded" />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          </div>

          {/* Calories */}
          <div className="w-1/2">
            <label className="block text-black-700">Calories Burned (kcal)<span className="text-red-700">*</span></label>
            <input type="number" placeholder="e.g., 250"{...register("calories",{valueAsNumber:true})} className="w-full p-2 border rounded" />
            {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
          </div>
          </div>
          {/* Save Button */}
          <button type="submit" className="w-full bg-[#0c0e13] text-white py-2 rounded hover:bg-[#1e2938]">
            SAVE
          </button>
        </form>
        </div>
      {/* </div> */}
    </Layout>
  );
};

export default AddWorkout;

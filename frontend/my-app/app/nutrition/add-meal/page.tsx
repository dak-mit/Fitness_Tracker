// pages/add-workout.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import NutriLayout from "../../../components/NutriLayout";
//import { useMeal } from "../../../context/MealContext";
import { useRouter } from "next/navigation";

// Zod Schema
const nutriSchema = z.object({
  mealName: z.string().min(1, "Meal name is required"),
//   startTime: z.string().min(1, "Start time is required"),
  date: z.string().min(1, "Date is required"),
  nutrition: z.string().min(1, "Nutrition type is required"),
  //duration: z.coerce.number().min(1, "Duration is required"),
  calories: z.coerce.number().min(1, "Calories consumed is required"),
});

type NutriFormData = z.infer<typeof nutriSchema>;

const AddMeal = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NutriFormData>({
    resolver: zodResolver(nutriSchema),
  });

  //const { addMeal } = useMeal(); // Get the addMeal function
  const router = useRouter();

  const onSubmit = async(data: NutriFormData) => {
    try{
     const response = await fetch("http://localhost:4000/api/nutrition", {
       method: "POST",
       credentials:"include",
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
     router.push("/nutrition");     //Redirect To DashBoard
    } catch (error) {
     console.error("Error adding nutrition:", error);
     alert("Failed to add nutrition");
    }
   };

  return (
    <NutriLayout>
      
      {/* <div className="mt-6 bg-white text-black p-6 rounded-lg w-[600px] mx-auto"> */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[500px] mx-auto mt-20 p-6 rounded-lg shadow-md text-black">
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Add Meal</h2>
          {/* Meal Name */}
          <div className="mb-4">
            <label className="block text-black-700">Meal Name <span className="text-red-700">*</span></label>
            <input type="text" {...register("mealName")} className="w-full p-2 border rounded" />
            {errors.mealName && <p className="text-red-500 text-sm">{errors.mealName.message}</p>}
          </div>

          {/* Start Time & Date */}
          <div className="mb-4 flex space-x-4">
            {/* <div className="w-1/2">
              <label className="block text-black-700">Start Time <span className="text-red-700">*</span></label>
              <input type="time" {...register("startTime")} className="w-full p-2 border rounded" />
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
            </div> */}
            <div className="w-1/2">
              <label className="block text-black-700">Date <span className="text-red-700">*</span></label>
              <input type="date" {...register("date")} className="w-full p-2 border rounded" />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
          </div>

          {/* Activity */}
          <div className="mb-4">
            <label className="block text-black-700">Nutrition Type <span className="text-red-700">*</span></label>
            <select {...register("nutrition")} className="w-full p-2 border rounded">
              <option value="">Select a nutrition type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Evening">Evening Snacks</option>
              <option value="Other">Other</option>
            </select>
            {errors.nutrition && <p className="text-red-500 text-sm">{errors.nutrition.message}</p>}
          </div>

          {/* Calories */}
          <div className="mb-4">
            <label className="block text-black-700">Calories Consumed (kcal)<span className="text-red-700">*</span></label>
            <input type="number" {...register("calories",{valueAsNumber:true})} className="w-full p-2 border rounded" />
            {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
          </div>

          {/* Save Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
            SAVE
          </button>
        </form>
      {/* </div> */}
    </NutriLayout>
  );
};

export default AddMeal;
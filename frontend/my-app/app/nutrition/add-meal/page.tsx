"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import NutriLayout from "../../../components/NutriLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood, faCookie, faEgg, faUtensils, faWineGlass } from "@fortawesome/free-solid-svg-icons";
import { Meal } from "../../types";

const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  date: z.string().min(1, "Date is required"),
  mealType: z.string().min(1, "Meal type is required"),
  calories: z.coerce.number().min(1, "Calories consumed is required"),
  protein: z.coerce.number().min(0, "Protein must be 0 or greater"),
  carbs: z.coerce.number().min(0, "Carbs must be 0 or greater"),
  fat: z.coerce.number().min(0, "Fat must be 0 or greater"),
});

type MealFormData = z.infer<typeof mealSchema>;

export default function AddMeal() {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const router = useRouter();
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const onSubmit = async (data: MealFormData) => {
    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/nutrition", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add meal");
      }

      await response.json();
      reset();
      router.push("/nutrition");
    } catch (error) {
      
      console.error("Error adding meal:", error);
      alert("Failed to add meal. Please try again.");
    }
  };

  return (
    <NutriLayout>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-start"
        style={{ backgroundImage: "url('/formbg-Photoroom.png')" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm shadow-lg w-[460px] h-[400px] mt-10 mb-20 mx-auto ml-5 p-6 rounded-lg flex flex-col justify-between text-black"
        >
          {/* Meal Name */}
          <div className="mb-4">
            <label>Meal Name<span className="text-red-700">*</span></label>
            <input type="text" {...register("name")} className="w-full p-2 border rounded" />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Nutrition */}
          <div className="mb-4">
            <label>Nutrition Type<span className="text-red-700">*</span></label>
            <div className="flex flex-wrap gap-4">
              {[
                { name: "Breakfast", icon: faEgg },
                { name: "Lunch", icon: faUtensils },
                { name: "Dinner", icon: faWineGlass },
                { name: "Snacks", icon: faCookie },
                { name: "Others", icon: faBowlFood },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setValue("mealType", item.name)}
                  className={`flex flex-col items-center justify-center border rounded-md w-14 h-14
                    ${watch("mealType") === item.name
                      ? "bg-[#1e2938] text-white"
                      : "bg-white text-black"
                    }`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span className="text-xs">{item.name}</span>
                </button>
              ))}
            </div>
            {errors.mealType && (
              <p className="text-red-500 text-sm mt-1">{errors.mealType.message}</p>
            )}
          </div>

          {/* Date & Calories */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label>Date<span className="text-red-700">*</span></label>
              <DatePicker
                selected={watch("date") ? new Date(watch("date")) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    setValue("date", date.toISOString().split('T')[0], { shouldValidate: true });
                  } else {
                    setValue("date", "", { shouldValidate: true }); // Optional fallback
                  }
                }}
                
                onMonthChange={(date) => setViewDate(date)}
                maxDate={new Date()}
                placeholderText="Select date"
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded"
                renderDayContents={(day, date) =>
                  date.getMonth() === viewDate.getMonth() ? (
                    <span>{day}</span>
                  ) : (
                    <span className="text-gray-400 pointer-events-none">{day}</span>
                  )
                }
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="w-1/2">
              <label>Calories (kcal)<span className="text-red-700">*</span></label>
              <input type="number" {...register("calories", { valueAsNumber: true })} className="w-full p-2 border rounded" />
              {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" className="w-full bg-[#0c0e13] text-white py-2 rounded hover:bg-[#1e2938]">
            SAVE
          </button>
        </form>
      </div>
    </NutriLayout>
  );
};



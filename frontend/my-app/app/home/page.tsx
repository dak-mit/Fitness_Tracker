"use client";
import HomeLayout from '../../components/HomeLayout';
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot, faClock, faDumbbell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    return (
        <HomeLayout>
<div className="mt-6 bg-white text-black p-6 rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-center">Welcome, John Doe</h2>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
    {/* User Info Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faUser} className="fa-fw text-[#3b84d9] mr-2" />
        User Info
      </h3>
      <div className="space-y-2">
        <p><span className="font-medium">Age:</span> <span className="text-xl font-bold">30</span></p>
        <p><span className="font-medium">Weight:</span> <span className="text-xl font-bold">62</span> kg</p>
        <p><span className="font-medium">Height:</span> <span className="text-xl font-bold">170</span> cm</p>
      </div>
    </div>

    {/* Workout Summary Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faDumbbell} className="fa-fw text-[#3b84d9] mr-2" />
        Workout Summary
      </h3>
      <div className="space-y-2">
        <p><span className="text-2xl font-bold">45</span> <br />Total Workouts</p>
        <p><span className="text-2xl font-bold">7890</span> <br />Calories Burned</p>
      </div>
    </div>

    {/* Nutrition Summary Box */}
    <div className="p-6 bg-[#f9fafa] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        <FontAwesomeIcon icon={faCarrot} className="fa-fw text-[#3b84d9] mr-2" />
        Nutrition Summary
      </h3>
      <div className="space-y-2">
        <p><span className="text-2xl font-bold">180</span> <br />Meals Logged</p>
        <p><span className="text-2xl font-bold">12450</span> <br />Calories Consumed</p>
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


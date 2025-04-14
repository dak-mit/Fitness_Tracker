// components/Layout.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import "../app/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
//import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try{
      const res = await fetch("http://localhost:4000/api/auth/logout",{
        method: "POST",
        credentials:"include",
      });

      if(!res.ok){
        throw new Error("Failed to logout");
      }

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out");
    }
  };
  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-white">
      {/* Sidebar */}
      <nav className="w-64 p-5 bg-[#0b0e13]">
      <div className="flex items-center gap-2 mb-30">
          <div className="w-8 h-8">
      <DotLottieReact
      src="/animations/workoutanimation.lottie"
      loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
            </div>
      <h1 onClick={()=>router.push("/")}
          className="text-2xl font-bold cursor-pointer">TrackTive</h1>
        </div>
        <ul className="space-y-4">
        {[
        { name: "Summary", path: "/nutrition" },
        { name: "Add Meal", path: "/nutrition/add-meal" },
        { name: "Stats", path: "/nutrition/stats" },
      ].map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className={`block px-4 py-2 rounded-md duration-200 ${
              pathname === item.path ? "bg-gray-800 font-semibold" : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
          </ul>
        
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-0">

      <header className="w-full flex justify-center space-x-12 border-b border-gray-800 bg-[#0b0e13] py-4">
          {[
            { name: "HOME" , path: "/home" },
          { name: "WORKOUTS", path: "/workouts" },
          { name: "NUTRITION", path: "/nutrition" },
          
          ].map((item) => {
            const isActive =
      item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return(
          <Link
            key={item.path} 
            href={item.path}
            className={"relative text-white text-lg font-bold tracking-wide uppercase transition duration-200 hover:opacity-80"}
          >
              {item.name}
              {isActive && (
          <span className="absolute -bottom-1 left-1/2 w-3/4 translate-x-[-50%] h-[3px] rounded-full bg-blue-500 transition-all duration-300"></span>
        )}
          </Link>
        );
          })}
          <button
            onClick={() => {
              console.log("Logout clicked");
              handleLogout();
              router.push("/login");
            }}
            
          className="absolute right-6 p-1 bg-red-500 text-white rounded hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="fa-fw"/>
        </button>   
      </header>

        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;

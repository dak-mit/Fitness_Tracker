// components/Layout.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import "../app/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "../app/globals.css";
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const handleLogout = async () => {
      try{
        const res = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout",{
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
      
      {/* Main Content */}
      <main className="flex-1 p-0">
        <header className="w-full flex justify-center space-x-12 border-b border-gray-800 bg-[#0b0e13] py-4 relative">
          <div className="absolute left-6 flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8">
      <DotLottieReact
      src="/animations/workoutanimation.lottie"
      loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
            </div>
              <h1 onClick={()=>router.push("/")}
            className="left-6 text-2xl font-bold cursor-pointer">TrackTive</h1>
          </div>
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

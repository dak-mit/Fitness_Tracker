// components/Layout.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import "../app/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-white">

      {/* Main Content */}
      <main className="flex-1 p-0">
              <header className="w-full flex justify-center space-x-12 border-b border-gray-800 bg-[#0b0e13] py-4">
              <h1 className="absolute left-6 text-2xl font-bold">Fitness Tracker</h1>
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
      </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

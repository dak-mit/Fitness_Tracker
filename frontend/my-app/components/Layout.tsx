// components/Layout.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import "../app/globals.css";
import { usePathname, useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <nav className="w-64 p-6 bg-gray-900">
        <h1 className="text-2xl font-bold mb-30">Fitness Tracker</h1>
        
        <ul className="space-y-4">
        {[
        { name: "Summary", path: "/workouts" },
        { name: "Add Workout", path: "/workouts/add-workout" },
        { name: "Goals", path: "/workouts/goals" },
        { name: "Stats", path: "/workouts/stats" },
      ].map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className={`hover:border-b-1 border-white ${
              pathname === item.path ? "border-b-1 border-white" : ""
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
          </ul>
        
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">

      <header className="flex justify-center space-x-8 border-b pb-4">
          {[
            { name: "HOME", path: "/" },
          { name: "WORKOUTS", path: "/workouts" },
          { name: "NUTRITION", path: "/nutrition" },
          
        ].map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-lg font-semibold hover:border-b-1 border-white ${
              item.path === "/" ? (pathname === "/" ? "border-b-1 border-white" : "") :
              pathname.startsWith(item.path) ? "border-b-1 border-white" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;

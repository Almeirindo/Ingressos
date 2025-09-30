// layouts/ProfileLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function ProfileLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className={`
          flex-1 text-white pt-10 transition-all duration-300
          ml-0 
          lg:${isCollapsed ? "ml-20" : "ml-64"}
        `}
      >
        <Outlet context={{ isCollapsed }} />
      </main>
    </div>
  );
}

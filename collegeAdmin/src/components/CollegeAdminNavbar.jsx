import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CollegeAdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("login");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white h-screen flex flex-col shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <div className="text-2xl font-semibold text-white shadow-sm animate-pulse">College Admin</div>
      </div>
      <nav className="flex-grow mt-10 space-y-4">
        <Link className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2" to="/dashboard/fests">
          <span className="text-lg">Fests</span>
        </Link>
        <Link className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2" to="/dashboard/sponsors">
          <span className="text-lg">Sponsors</span>
        </Link>
        <button className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors w-full text-left rounded-lg mx-2" onClick={handleLogout}>
          <span className="text-lg">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default CollegeAdminNavbar;

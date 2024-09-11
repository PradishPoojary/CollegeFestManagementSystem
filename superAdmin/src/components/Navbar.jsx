import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white h-screen flex flex-col shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        <div className="text-2xl font-semibold animate-pulse">Super Admin</div>
      </div>
      <nav className="mt-10 flex-grow space-y-4">
        <Link
          className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2"
          to="/"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          <span className="text-lg">Dashboard</span>
        </Link>
        <Link
          className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2"
          to="/users"
        >
          <span className="text-lg">Users</span>
        </Link>
        <Link
          className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2"
          to="/registrations"
        >
          <span className="text-lg">Registered Users</span>
        </Link>
      </nav>
      <div className="mb-4">
        <Link
          className="flex items-center py-3 px-8 text-white hover:bg-blue-800 transition-colors rounded-lg mx-2"
          to="/settings"
        >
          <span className="text-lg">Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Navbar;

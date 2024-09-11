import React from "react";
import { Outlet } from "react-router-dom";
import CollegeAdminNavbar from "./CollegeAdminNavbar";
import CollegeAdminTopBar from "./CollegeAdminTopbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <CollegeAdminNavbar />
      <div className="flex-1 flex flex-col">
        <CollegeAdminTopBar />
        <div className="p-4 flex-1 overflow-auto bg-white shadow-inner rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

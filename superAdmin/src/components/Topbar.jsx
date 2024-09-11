// src/components/Topbar.jsx
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TopBar = () => {
  return (
    <div className="flex items-center justify-between h-16 bg-blue-50 shadow-md px-6">
      <div className="flex items-center space-x-4">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-blue-600 font-semibold hover:underline">Edit Profile</button>
      </div>
    </div>
  );
};

export default TopBar;

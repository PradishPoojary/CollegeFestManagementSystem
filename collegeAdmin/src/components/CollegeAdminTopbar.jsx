import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CollegeAdminTopBar = () => {
  const [collegeInfo, setCollegeInfo] = useState({ name: '', logoUrl: '' });

  useEffect(() => {
    const fetchCollegeInfo = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const collegeDoc = await getDoc(doc(db, "registrations", userId));
        if (collegeDoc.exists()) {
          const data = collegeDoc.data();
          setCollegeInfo({ name: data.collegeName, logoUrl: data.logoUrl });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching college info: ", error);
      }
    };

    fetchCollegeInfo();
  }, []);

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
        <span className="text-blue-600 font-semibold text-xl">
          {collegeInfo.name}
        </span>
        {collegeInfo.logoUrl && (
          <img
            src={collegeInfo.logoUrl}
            alt="College Logo"
            className="rounded-full h-10 w-10 border-2 border-blue-600"
          />
        )}
      </div>
    </div>
  );
};

export default CollegeAdminTopBar;

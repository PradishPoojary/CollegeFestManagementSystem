// src/components/RegistrationDetail.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegistrationDetail = () => {
  const location = useLocation();
  const user = location.state;

  if (!user) {
    return <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">Registration data not available</div>;
  }

  console.log('Registration details:', user);

  return (
    <div className="p-8 bg-gradient-to-br from-purple-300 via-blue-300 to-green-200 min-h-screen flex items-center justify-center">
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {user.logoUrl && (
          <div className="flex justify-center mb-6">
            <img src={user.logoUrl} alt={`${user.collegeName} logo`} className="h-24 w-24 object-contain rounded-full border-2 border-purple-300" />
          </div>
        )}
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 border-b-4 pb-4 text-center border-purple-300">Registration Details</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">{user.collegeName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user.email && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">Email:</span>
              <span className="ml-2 text-gray-800">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">Phone No:</span>
              <span className="ml-2 text-gray-800">{user.phone}</span>
            </div>
          )}
          {user.zip && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">Zip No:</span>
              <span className="ml-2 text-gray-800">{user.zip}</span>
            </div>
          )}
          {user.pinCode && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">Pin Code:</span>
              <span className="ml-2 text-gray-800">{user.pinCode}</span>
            </div>
          )}
          {user.state && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">State:</span>
              <span className="ml-2 text-gray-800">{user.state}</span>
            </div>
          )}
          {user.district && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">District:</span>
              <span className="ml-2 text-gray-800">{user.district}</span>
            </div>
          )}
          {user.country && (
            <div className="mb-3">
              <span className="text-gray-700 font-semibold">Country:</span>
              <span className="ml-2 text-gray-800">{user.country}</span>
            </div>
          )}
          {user.about && (
            <div className="mb-3 md:col-span-2">
              <span className="text-gray-700 font-semibold">About College:</span>
              <span className="ml-2 text-gray-800">{user.about}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationDetail;

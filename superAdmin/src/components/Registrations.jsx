// src/components/Registrations.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'registrations'));
        const registrationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegistrations(registrationsData);
        console.log('Fetched registrations:', registrationsData);
      } catch (error) {
        console.error("Error fetching registrations: ", error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleCardClick = (registration) => {
    console.log('Navigating with registration:', registration);
    navigate(`/registration/${registration.id}`, { state: registration });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-300 via-teal-300 to-green-400 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Registered Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registrations.map(registration => (
          <div
            key={registration.id}
            className="relative p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-white cursor-pointer"
            onClick={() => handleCardClick(registration)}
          >
            {registration.logoUrl && (
              <div className="flex justify-center mb-4">
                <img src={registration.logoUrl} alt={`${registration.collegeName} logo`} className="h-16 w-16 object-contain rounded-full border-2 border-teal-300" />
              </div>
            )}
            <h2 className="text-xl font-bold text-center">{registration.collegeName}</h2>
            <p className="text-center">{registration.email}</p>
            <p className="text-center">{registration.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Registrations;

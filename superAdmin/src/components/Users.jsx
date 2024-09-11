// src/components/Users.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { XCircleIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log('Fetched users:', usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAccept = async (id) => {
    try {
      const userDocRef = doc(db, 'users', id);
      const userData = await getUserData(id);
      if (userData) {
        await setDoc(doc(db, 'registrations', id), userData);
        await deleteDoc(userDocRef);
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (error) {
      console.error("Error accepting user: ", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const userDocRef = doc(db, 'users', id);
      await setDoc(userDocRef, { status: 'rejected' }, { merge: true });
      setUsers(users.map(user => user.id === id ? { ...user, status: 'rejected' } : user));
    } catch (error) {
      console.error("Error rejecting user: ", error);
    }
  };

  const handleRestore = async (id) => {
    try {
      const userDocRef = doc(db, 'users', id);
      await setDoc(userDocRef, { status: 'active' }, { merge: true });
      setUsers(users.map(user => user.id === id ? { ...user, status: 'active' } : user));
    } catch (error) {
      console.error("Error restoring user: ", error);
    }
  };

  const handleCardClick = async (user) => {
    console.log('Navigating with user:', user);
    navigate(`/user/${user.id}`, { state: user });
  };

  const getUserData = async (id) => {
    try {
      const userDocRef = doc(db, 'users', id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return { id: userDocSnap.id, ...userDocSnap.data() };
      } else {
        console.error('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-300 via-teal-300 to-green-400 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Pending Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user.id}
            className={`relative p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
              user.status === 'rejected' ? 'bg-gray-300' : 'bg-white'
            } cursor-pointer`}
            onClick={() => handleCardClick(user)}
          >
            {user.logoUrl && (
              <div className="flex justify-center mb-4">
                <img src={user.logoUrl} alt={`${user.collegeName} logo`} className="h-16 w-16 object-contain rounded-full border-2 border-teal-300" />
              </div>
            )}
            <h2 className="text-xl font-bold text-center">{user.collegeName}</h2>
            <p className="text-center">{user.email}</p>
            <p className="text-center">{user.phone}</p>
            <div className="mt-4 flex justify-between">
              <button
                className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept(user.id);
                }}
              >
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Accept
              </button>
              <button
                className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(user.id);
                }}
              >
                <XCircleIcon className="h-5 w-5 mr-1" /> Reject
              </button>
              {user.status === 'rejected' && (
                <button
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(user.id);
                  }}
                >
                  <ArrowPathIcon className="h-5 w-5 mr-1" /> Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;

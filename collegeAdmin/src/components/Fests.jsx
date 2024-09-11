// src/components/Fests.jsx
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Fests = () => {
  const [fests, setFests] = useState([]);
  const [festName, setFestName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [logo, setLogo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const userId = sessionStorage.getItem("userId"); // Get the logged-in user ID from session storage

  useEffect(() => {
    if (userId) {
      const fetchFests = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "registrations", userId, "fests"));
          const festData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFests(festData);
        } catch (error) {
          console.error("Error fetching fests: ", error);
        }
      };
      fetchFests();
    } else {
      console.error("User ID is missing");
    }
  }, [userId]);

  const handleLogoUpload = async (file) => {
    const storageRef = ref(storage, `logos/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic here

    // Handling logo upload
    let logoUrl = "";
    if (logo) {
      try {
        logoUrl = await handleLogoUpload(logo);
      } catch (error) {
        console.error("Error uploading logo: ", error);
        return;
      }
    }

    // Adding fest to Firestore
    try {
      const docRef = await addDoc(collection(db, "registrations", userId, "fests"), {
        festName,
        fromDate,
        toDate,
        logo: logoUrl,
      });
      setFests([
        ...fests,
        {
          id: docRef.id,
          festName,
          fromDate,
          toDate,
          logo: logoUrl,
        },
      ]);
      setFestName("");
      setFromDate("");
      setToDate("");
      setLogo(null);
      setShowForm(false); // Hide the form after submission
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Fests</h1>
      {!showForm && (
        <div className="text-center mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200" onClick={() => setShowForm(true)}>
            Add Fest
          </button>
        </div>
      )}
      {showForm && (
        <form className="mb-6 bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Fest Name"
              value={festName}
              onChange={(e) => setFestName(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <div className="flex gap-4">
              <input
                type="date"
                placeholder="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="date"
                placeholder="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border rounded"
                required
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
              Add Fest
            </button>
            <button type="button" className="px-4 py-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-200" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fests.map((fest) => (
          <motion.div key={fest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer">
            <Link to={`/dashboard/fests/${fest.id}`} className="block">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{fest.festName}</h2>
                <p className="text-gray-500 mb-2">From: {fest.fromDate}</p>
                <p className="text-gray-500 mb-2">To: {fest.toDate}</p>
              </div>
              {fest.logo && (
                <div className="w-full flex justify-center mb-4">
                  <img src={fest.logo} alt={fest.festName} className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 animate-pulse" />
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Fests;

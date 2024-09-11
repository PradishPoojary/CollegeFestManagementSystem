// src/components/Sponsors.jsx

import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import "../styles/Sponsors.css"; // Import the CSS file

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorLogo, setSponsorLogo] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const fetchSponsors = async () => {
        try {
          const collegeDoc = await getDoc(doc(collection(db, "registrations"), userId));
          if (collegeDoc.exists()) {
            const collegeData = collegeDoc.data();
            setSponsors(collegeData.sponsors || []);
          }
        } catch (error) {
          console.error("Error fetching sponsors: ", error);
        }
      };
      fetchSponsors();
    } else {
      console.error("User ID is missing");
    }
  }, [userId]);

  const handleLogoUpload = async (file) => {
    const storageRef = ref(storage, `sponsors/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoUrl = "";
    if (sponsorLogo) {
      try {
        logoUrl = await handleLogoUpload(sponsorLogo);
      } catch (error) {
        console.error("Error uploading logo: ", error);
        return;
      }
    }

    const newSponsor = {
      name: sponsorName,
      logo: logoUrl,
    };

    try {
      const collegeRef = doc(collection(db, "registrations"), userId);
      await updateDoc(collegeRef, {
        sponsors: sponsors.length ? [...sponsors, newSponsor] : [newSponsor],
      });

      setSponsors([...sponsors, newSponsor]);
      setSponsorName("");
      setSponsorLogo(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding sponsor: ", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Sponsors</h1>
      {!showForm && (
        <div className="text-center mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200" onClick={() => setShowForm(true)}>
            Add Sponsor
          </button>
        </div>
      )}
      {showForm && (
        <form className="mb-6 bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Sponsor Name"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSponsorLogo(e.target.files[0])}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
              Add Sponsor
            </button>
            <button type="button" className="px-4 py-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-200" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {sponsors.length > 0 && (
        <div className="sponsor-section"> {/* Adjusted for better layout */}
          <h3 className="sponsor-heading">Sponsors</h3> {/* Styled heading */}
          <div className="sponsor-slider-container">
            <div className="sponsor-slider">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="sponsor-slide">
                  <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
                  <p className="mt-2 text-center">{sponsor.name}</p>
                </div>
              ))}
              {/* Duplicate sponsors to create infinite loop effect */}
              {sponsors.map((sponsor, index) => (
                <div key={`${index}-duplicate`} className="sponsor-slide">
                  <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
                  <p className="mt-2 text-center">{sponsor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsors;

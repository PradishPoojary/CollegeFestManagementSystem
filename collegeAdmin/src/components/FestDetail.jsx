// src/components/FestDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { motion } from "framer-motion";

const FestDetail = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventLogo, setEventLogo] = useState(null);
  const [eventCategory, setEventCategory] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventBranch, setEventBranch] = useState("");
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && id) {
      const fetchEvents = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(db, "registrations", userId, "fests", id, "events")
          );
          const eventData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventData);
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
      };
      fetchEvents();
    } else {
      console.error("userId or id is missing");
    }
  }, [id, userId]);

  const validate = () => {
    const newErrors = {};
    if (!eventName) newErrors.eventName = "Event name is required";
    if (!eventCategory) newErrors.eventCategory = "Event category is required";
    if (!eventLogo) newErrors.eventLogo = "Event logo is required";
    if (!eventDescription) newErrors.eventDescription = "Event description is required";
    if (!eventBranch) newErrors.eventBranch = "Event branch is required";
    return newErrors;
  };

  const handleLogoUpload = async (file) => {
    const storageRef = ref(storage, `eventLogos/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      let eventLogoUrl = "";
      if (eventLogo) {
        try {
          eventLogoUrl = await handleLogoUpload(eventLogo);
        } catch (error) {
          console.error("Error uploading event logo: ", error);
          return;
        }
      }

      try {
        const docRef = await addDoc(
          collection(db, "registrations", userId, "fests", id, "events"),
          {
            eventName,
            eventLogo: eventLogoUrl,
            eventCategory,
            eventDescription,
            eventBranch,
          }
        );
        setEvents([
          ...events,
          {
            id: docRef.id,
            eventName,
            eventLogo: eventLogoUrl,
            eventCategory,
            eventDescription,
            eventBranch,
          },
        ]);
        setEventName("");
        setEventLogo(null);
        setEventCategory("");
        setEventDescription("");
        setEventBranch("");
        setShowForm(false);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("Validation errors: ", validationErrors);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Events for Fest</h1>
      {!showForm && (
        <div className="text-center mb-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            onClick={() => setShowForm(true)}
          >
            Add Event
          </button>
        </div>
      )}
      {showForm && (
        <form
          className="mb-6 bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`p-2 border rounded ${
                errors.eventName ? "border-red-500" : ""
              }`}
            />
            {errors.eventName && (
              <p className="text-red-500">{errors.eventName}</p>
            )}
            <input
              type="file"
              onChange={(e) => setEventLogo(e.target.files[0])}
              className={`p-2 border rounded ${
                errors.eventLogo ? "border-red-500" : ""
              }`}
            />
            {errors.eventLogo && (
              <p className="text-red-500">{errors.eventLogo}</p>
            )}
            <input
              type="text"
              placeholder="Event Category"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className={`p-2 border rounded ${
                errors.eventCategory ? "border-red-500" : ""
              }`}
            />
            {errors.eventCategory && (
              <p className="text-red-500">{errors.eventCategory}</p>
            )}
            <textarea
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className={`p-2 border rounded ${
                errors.eventDescription ? "border-red-500" : ""
              }`}
              rows={4}
            />
            {errors.eventDescription && (
              <p className="text-red-500">{errors.eventDescription}</p>
            )}
            <input
              type="text"
              placeholder="Event Branch"
              value={eventBranch}
              onChange={(e) => setEventBranch(e.target.value)}
              className={`p-2 border rounded ${
                errors.eventBranch ? "border-red-500" : ""
              }`}
            />
            {errors.eventBranch && (
              <p className="text-red-500">{errors.eventBranch}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              {event.eventLogo && (
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden shadow-md">
                  <img
                    src={event.eventLogo}
                    alt={`${event.eventName} logo`}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2 text-blue-900">
                {event.eventName}
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Category:</strong> {event.eventCategory}
              </p>
              <p className="text-gray-600 mb-2">{event.eventDescription}</p>
              <p className="text-gray-600 mb-4">Branch: {event.eventBranch}</p>
              <button
                className="absolute bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                onClick={() => navigate(`/dashboard/fests/${id}/events/${event.id}/view`)}
              >
                View Details
              </button>
              <button
                className="absolute bottom-4 left-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                onClick={() =>
                  navigate(`/dashboard/fests/${id}/events/${event.id}/update`)
                }
              >
                Update Event
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FestDetail;

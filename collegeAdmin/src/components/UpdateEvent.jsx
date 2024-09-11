import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const UpdateEvent = () => {
  const { festId, eventId } = useParams();
  const [rules, setRules] = useState("");
  const [eventHeads, setEventHeads] = useState([{ name: "", phone: "" }]);
  const [timings, setTimings] = useState([{ round: "", day: "", time: "", location: "" }]);
  const [roundsStatus, setRoundsStatus] = useState([{ round: "", winners: "", ongoing: true }]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const eventDocRef = doc(db, "registrations", sessionStorage.getItem("userId"), "fests", festId, "events", eventId);

    const unsubscribe = onSnapshot(eventDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setRules(data.rules || "");
        setEventHeads(data.eventHeads || [{ name: "", phone: "" }]);
        setTimings(data.timings || [{ round: "", day: "", time: "", location: "" }]);
        setRoundsStatus(data.roundsStatus || [{ round: "", winners: "", ongoing: true }]);
      }
    });

    return () => unsubscribe();
  }, [festId, eventId]);

  const handleFieldChange = (field, value) => {
    const eventDocRef = doc(db, "registrations", sessionStorage.getItem("userId"), "fests", festId, "events", eventId);
    setDoc(eventDocRef, { [field]: value }, { merge: true });
  };

  const toggleOngoing = (index) => {
    const newRoundsStatus = [...roundsStatus];
    newRoundsStatus[index].ongoing = !newRoundsStatus[index].ongoing;
    setRoundsStatus(newRoundsStatus);
    handleFieldChange("roundsStatus", newRoundsStatus);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventDocRef = doc(db, "registrations", sessionStorage.getItem("userId"), "fests", festId, "events", eventId);
    setDoc(eventDocRef, { rules, eventHeads, timings, roundsStatus }, { merge: true })
      .then(() => {
        setSuccessMessage("Successfully updated!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000); // Clear success message after 3 seconds
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        // Handle error state or display error message
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Event Details</h1>
      {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
      <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rules">
            Rules
          </label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => {
              setRules(e.target.value);
              handleFieldChange("rules", e.target.value);
            }}
            className="p-2 border rounded w-full"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Event Heads</label>
          {eventHeads.map((head, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Name"
                value={head.name}
                onChange={(e) => {
                  const newEventHeads = [...eventHeads];
                  newEventHeads[index].name = e.target.value;
                  setEventHeads(newEventHeads);
                  handleFieldChange("eventHeads", newEventHeads);
                }}
                className="p-2 border rounded mr-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={head.phone}
                onChange={(e) => {
                  const newEventHeads = [...eventHeads];
                  newEventHeads[index].phone = e.target.value;
                  setEventHeads(newEventHeads);
                  handleFieldChange("eventHeads", newEventHeads);
                }}
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" className="p-2 bg-blue-600 text-white rounded" onClick={() => {
            const newEventHeads = [...eventHeads, { name: "", phone: "" }];
            setEventHeads(newEventHeads);
            handleFieldChange("eventHeads", newEventHeads);
          }}>
            Add Event Head
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Timings</label>
          {timings.map((timing, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Round"
                value={timing.round}
                onChange={(e) => {
                  const newTimings = [...timings];
                  newTimings[index].round = e.target.value;
                  setTimings(newTimings);
                  handleFieldChange("timings", newTimings);
                }}
                className="p-2 border rounded mr-2"
              />
              <input
                type="date"
                value={timing.day}
                onChange={(e) => {
                  const newTimings = [...timings];
                  newTimings[index].day = e.target.value;
                  setTimings(newTimings);
                  handleFieldChange("timings", newTimings);
                }}
                className="p-2 border rounded mr-2"
              />
              <input
                type="text"
                placeholder="Time"
                value={timing.time}
                onChange={(e) => {
                  const newTimings = [...timings];
                  newTimings[index].time = e.target.value;
                  setTimings(newTimings);
                  handleFieldChange("timings", newTimings);
                }}
                className="p-2 border rounded mr-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={timing.location}
                onChange={(e) => {
                  const newTimings = [...timings];
                  newTimings[index].location = e.target.value;
                  setTimings(newTimings);
                  handleFieldChange("timings", newTimings);
                }}
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" className="p-2 bg-blue-600 text-white rounded" onClick={() => {
            const newTimings = [...timings, { round: "", day: "", time: "", location: "" }];
            setTimings(newTimings);
            handleFieldChange("timings", newTimings);
          }}>
            Add Timing
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rounds Status</label>
          {roundsStatus.map((status, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Round"
                value={status.round}
                onChange={(e) => {
                  const newRoundsStatus = [...roundsStatus];
                  newRoundsStatus[index].round = e.target.value;
                  setRoundsStatus(newRoundsStatus);
                  handleFieldChange("roundsStatus", newRoundsStatus);
                }}
                className="p-2 border rounded mr-2"
              />
              <input
                type="text"
                placeholder="Winners"
                value={status.winners}
                onChange={(e) => {
                  const newRoundsStatus = [...roundsStatus];
                  newRoundsStatus[index].winners = e.target.value;
                  setRoundsStatus(newRoundsStatus);
                  handleFieldChange("roundsStatus", newRoundsStatus);
                }}
                className="p-2 border rounded mr-2"
                disabled={!status.ongoing} // Disable input if round is ongoing
              />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={!status.ongoing}
                  onChange={() => toggleOngoing(index)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Finished</span>
              </label>
            </div>
          ))}
          <button type="button" className="p-2 bg-blue-600 text-white rounded" onClick={() => {
            const newRoundsStatus = [...roundsStatus, { round: "", winners: "", ongoing: true }];
            setRoundsStatus(newRoundsStatus);
            handleFieldChange("roundsStatus", newRoundsStatus);
          }}>
            Add Round Status
          </button>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;

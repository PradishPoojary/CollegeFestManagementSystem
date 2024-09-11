import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ViewEventDetails = () => {
  const { festId, eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(
          doc(db, "registrations", sessionStorage.getItem("userId"), "fests", festId, "events", eventId)
        );
        if (eventDoc.exists()) {
          console.log("Event data fetched:", eventDoc.data());
          setEvent(eventDoc.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event details: ", error);
      }
    };
    fetchEvent();
  }, [festId, eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center p-6">
      {event ? (
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1">
              <h1 className="text-4xl font-bold mb-4 text-indigo-700">{event.eventName}</h1>
              {event.eventLogo && (
                <div className="flex justify-center mb-6">
                  <img
                    src={event.eventLogo}
                    alt={`${event.eventName} logo`}
                    className="w-40 h-40 rounded-full border-4 border-indigo-300 shadow-lg"
                  />
                </div>
              )}
              <p className="text-lg mb-6 text-gray-700" style={{ textAlign: 'justify' }}>{event.eventDescription}</p>
              <div className="mb-6">
                <p className="text-lg text-gray-700 font-semibold mb-2"><strong>Rules:</strong></p>
                <ul className="list-disc list-inside pl-4">
                  {event.rules && event.rules.split('\n').map((rule, index) => (
                    <li key={index} className="text-lg text-gray-700 mb-1">{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-span-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">Event Heads</h2>
                {event.eventHeads && event.eventHeads.map((head, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg text-gray-700"><strong>Name:</strong> {head.name}</p>
                    <p className="text-lg text-gray-700"><strong>Phone Number:</strong> {head.phone}</p>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">Timings</h2>
                {event.timings && event.timings.map((timing, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg text-gray-700"><strong>Round:</strong> {timing.round}</p>
                    <p className="text-lg text-gray-700"><strong>Day:</strong> {timing.day}</p>
                    <p className="text-lg text-gray-700"><strong>Time:</strong> {timing.time}</p>
                    <p className="text-lg text-gray-700"><strong>Location:</strong> {timing.location}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">Rounds Status</h2>
                {event.roundsStatus && event.roundsStatus.map((round, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg text-gray-700"><strong>Round {index + 1}:</strong> {round.ongoing ? 'Ongoing' : 'Finished'}</p>
                    {round.winners && <p className="text-lg text-gray-700"><strong>Winners:</strong> {round.winners}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-2xl text-white">Loading event details...</p>
      )}
    </div>
  );
};

export default ViewEventDetails;

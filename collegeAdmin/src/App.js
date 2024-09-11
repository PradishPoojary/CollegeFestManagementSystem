// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Fests from "./components/Fests";
import FestDetail from "./components/FestDetail";
import MultiStepRegistrationForm from "./components/MultiStepRegistrationForm";
import LoginPage from "./components/CollegeAdminLogin";
import Dashboard from "./components/Dashboard";
import UpdateEvent from "./components/UpdateEvent";
import ViewEventDetails from "./components/ViewEventDetails";
import Sponsors from "./components/Sponsors";
import ForgotPassword from "./components/ForgotPassword"; // Import the ForgotPassword component

const App = () => {
  const [registrationAccepted, setRegistrationAccepted] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("login");
    if (loggedIn) {
      setRegistrationAccepted(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<MultiStepRegistrationForm onRegistrationAccepted={() => setRegistrationAccepted(true)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add ForgotPassword route */}
        {registrationAccepted ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard/fests" />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="fests" element={<Fests />} />
              <Route path="fests/:id" element={<FestDetail />} />
              <Route path="fests/:festId/events/:eventId/update" element={<UpdateEvent />} />
              <Route path="fests/:festId/events/:eventId/view" element={<ViewEventDetails />} />
              <Route path="sponsors" element={<Sponsors />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
        <Route path="*" element={<Navigate to={registrationAccepted ? "/dashboard/fests" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;

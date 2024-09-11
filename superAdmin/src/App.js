// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBar from './components/Topbar';
import Registrations from './components/Registrations';
import UserDetail from './components/UserDetail';
import Users from './components/Users';
import RegistrationDetail from './components/RegistrationDetail';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Navbar />
        <div className="flex flex-col flex-grow">
          <TopBar />
          <div className="flex-grow p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/registrations" element={<Registrations />} />
              <Route path="/User/:id" element={<UserDetail />} />
              <Route path="/registration/:id" element={<RegistrationDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

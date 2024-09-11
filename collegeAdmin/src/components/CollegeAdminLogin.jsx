// src/components/CollegeAdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, where('email', '==', email), where('password', '==', password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        // Login successful
        sessionStorage.setItem('login', true); // Set sessionStorage item
        sessionStorage.setItem('userId', userId); // Store user ID in session storage
        navigate('/dashboard/fests'); // Redirect to Fests
      } else {
        setErrorMessage('Invalid email or password, or your registration has not been accepted by the superadmin.');
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setErrorMessage('An error occurred while logging in. Please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Redirect to Forgot Password page
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">College Admin Login</h2>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-200" disabled={!email || !password}>
          Login
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleRegister}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Register
          </button>
        </div>
        <div className="mt-2 text-center">
  <button type="button" onClick={handleForgotPassword} className="text-blue-500 hover:text-blue-700 transition duration-200">
    Forgot Password?
  </button>
</div>
      </form>
    </div>
  );
};

export default LoginPage;

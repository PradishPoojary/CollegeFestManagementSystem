import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import qs from "qs"; // for encoding the data properly

const MAILGUN_API_KEY = "01936f2f032a800c5f5b203bc3da4788-2b755df8-1a802cd8"; // Replace with your Mailgun API key
const MAILGUN_DOMAIN = "sandbox7c0ebb6eba764c48abcc05eae4fde702.mailgun.org"; // Replace with your Mailgun domain
const MAILGUN_API_BASE_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [storedOtp, setStoredOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePassword = async () => {
    try {
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      console.log("Generated OTP:", generatedOtp); // Log generated OTP
      setStoredOtp(generatedOtp);

      const emailData = qs.stringify({
        from: `Your App <no-reply@${MAILGUN_DOMAIN}>`,
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP for resetting your password is: ${generatedOtp}`,
      });

      await axios.post(MAILGUN_API_BASE_URL, emailData, {
        auth: {
          username: "api",
          password: MAILGUN_API_KEY,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setMessage("OTP has been sent to your email.");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const trimmedUserOtp = userOtp.trim(); // Trim spaces

    console.log("Stored OTP:", storedOtp); // Log stored OTP
    console.log("Entered OTP:", trimmedUserOtp); // Log entered OTP

    if (trimmedUserOtp !== storedOtp) {
      setMessage("Invalid OTP.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const registrationsRef = collection(db, "registrations");
      const q = query(registrationsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;

        await updateDoc(userRef, {
          password: newPassword,
        });

        setMessage("Password updated successfully.");
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("No user found with this email.");
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Forgot Password
        </h2>
        {message && (
          <p
            className={`mb-4 text-center ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
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
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="otp"
          value={userOtp}
          onChange={(e) => setUserOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full hover:bg-yellow-600 transition duration-200 mb-4"
          onClick={handleGeneratePassword}
        >
          Generate OTP
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

const MultiStepRegistrationForm = ({ onRegistrationAccepted }) => {
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    phone: '',
    pinCode: '',
    state: '',
    district: '',
    country: '',
    about: '',
    password: '',
    confirmPassword: '',
    logo: null,
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
    setErrors({ ...errors, logo: '' });
  };

  const validateStep1 = () => {
    let stepErrors = {};
    if (!formData.collegeName) stepErrors.collegeName = 'College name is required';
    if (!formData.email) stepErrors.email = 'Email is required';
    if (!formData.phone) stepErrors.phone = 'Phone number is required';
    if (!formData.pinCode) stepErrors.pinCode = 'Pin code is required';
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    let stepErrors = {};
    if (!formData.state) stepErrors.state = 'State is required';
    if (!formData.district) stepErrors.district = 'District is required';
    if (!formData.country) stepErrors.country = 'Country is required';
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    let stepErrors = {};
    if (!formData.about) stepErrors.about = 'About section is required';
    if (!formData.password) stepErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = 'Passwords do not match';
    if (!formData.logo) stepErrors.logo = 'Logo is required';
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(step + 1);
    if (step === 2 && validateStep2()) setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      // Upload logo to Firebase Storage
      const logoRef = ref(storage, `logos/${formData.logo.name}`);
      await uploadBytes(logoRef, formData.logo);
      const logoUrl = await getDownloadURL(logoRef);

      // Save user data to Firestore
      const docRef = await addDoc(collection(db, 'users'), {
        collegeName: formData.collegeName,
        email: formData.email,
        phone: formData.phone,
        pinCode: formData.pinCode,
        state: formData.state,
        district: formData.district,
        country: formData.country,
        about: formData.about,
        logoUrl: logoUrl,
        password: formData.password, // Note: Handle passwords securely in your application
      });

      console.log('Document written with ID: ', docRef.id);
      setSuccess(true);
      setTimeout(() => {
        onRegistrationAccepted(); // Notify parent component about registration acceptance
        navigate('/login'); // Redirect to login page after successful registration
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error("Error registering user: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        {success ? (
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-bold text-green-600">Registration request sent successfully!</h2>
            <p className="text-lg">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">College Registration</h2>
              <p className="text-gray-600">Step {step} of 3</p>
            </div>
            {step === 1 && (
              <>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Step 1: College Details</h2>
                <input
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="College Name"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.collegeName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.collegeName && <p className="text-sm text-red-500">{errors.collegeName}</p>}
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="Pin Code"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.pinCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.pinCode && <p className="text-sm text-red-500">{errors.pinCode}</p>}
                <div className="flex justify-end">
                  <button type="button" onClick={handleNext} className="px-6 py-2 text-white bg-blue-500 rounded-lg">Next</button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Step 2: Location Details</h2>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="District"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                <div className="flex justify-between">
                  <button type="button" onClick={handleBack} className="px-6 py-2 text-white bg-gray-500 rounded-lg">Back</button>
                  <button type="button" onClick={handleNext} className="px-6 py-2 text-white bg-blue-500 rounded-lg">Next</button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Step 3: Additional Information</h2>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="About College"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.about ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.about && <p className="text-sm text-red-500">{errors.about}</p>}
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`mb-3 p-3 w-full border rounded-lg ${errors.logo ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                <div className="flex justify-between">
                  <button type="button" onClick={handleBack} className="px-6 py-2 text-white bg-gray-500 rounded-lg">Back</button>
                  <button type="button" onClick={handleSubmit} className="px-6 py-2 text-white bg-green-500 rounded-lg">Submit</button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default MultiStepRegistrationForm;

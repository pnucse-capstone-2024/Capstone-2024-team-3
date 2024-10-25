"use client";

import React, { useState } from 'react';
import { CardBody, CardContainer, CardItem } from "@/app/components/3d-card";
import axios from 'axios';



const ThreeDCardDemoThree = () => {
  // Registration form state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill('')); // Code state as an array of 6 empty strings
  const [isCodeSent, setIsCodeSent] = useState(false); // Control transition to verification form
  const [isVerified, setIsVerified] = useState(false); // Track if verification was successful

  // Handle form submission for registration
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
  
    // Retrieve anonymousUserId from localStorage
    const anonymousUserId = localStorage.getItem('anonymousUserId');
  
    // Prepare the data to send, including the anonymousUserId
    const userData = {
      anonymousUserId: anonymousUserId, // Add the anonymous user ID to the request
      email: email
    };
  
    try {
      // Send a POST request to the server
      const response = await fetch('http://43.201.250.98/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      // Get the response data
      const result = await response.json();
      setMessage(result.message); // Display success or error message
      setIsCodeSent(true); // Transition to verification code form
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  // Handle code input (update individual code box)
  const handleCodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) { // Allow only digits
      let newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
    }
  };

  // Handle verification code submission
  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    const code = verificationCode.join(''); // Join the array into a single string

    try {
      // Send POST request to backend to verify the code
      const response = await axios.post('http://43.201.250.98/verify-code', { email, code });
      setMessage(response.data.message);
      setIsVerified(true); // Mark as verified if successful
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error verifying code');
    }
  };

  return (
    <CardContainer className="inter-var m-8 font-sans">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        {/* Registration Form */}
        <div className="mt-2">
  <div className="mb-4 flex justify-center items-center">
    <h2 className="text-lg font-bold dark:text-white" style={{ fontSize: '24px' }}>register</h2>
  </div>
  {!isCodeSent ? (
  <form onSubmit={handleSubmit}>
  <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        email:
      </label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 rounded-md w-full text-neutral-700 dark:text-white h-10" // Set height here
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold h-10" // Set height here
      style={{ fontSize: '14px' }}
    >
      verify email
    </button>
  </form>
    ) : !isVerified ? (
        // Verification code input form
        <form onSubmit={handleCodeSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Enter Verification Code:
            </label>
            <div className="flex space-x-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  required
                  className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg"
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
            style={{ fontSize: '14px' }}
          >
            Verify Code
          </button>
        </form>
      ) : (
        // Success message after verification
        <p className="text-green-600 font-bold">Verification successful!</p>
      )}
          {/* Display message after registration */}
          {message && (
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
              {message}
            </p>
          )}
</div>
      </CardBody>
    </CardContainer>
  );

  
}

export default ThreeDCardDemoThree;
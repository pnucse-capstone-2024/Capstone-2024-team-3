"use client";

import React, { useState } from 'react';
import axios from 'axios';

const EmailVerificationForm = () => {
  const [email, setEmail] = useState(''); // Email input state
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill('')); // Code state as an array of 6 empty strings
  const [message, setMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false); // Control transition to verification form
  const [isVerified, setIsVerified] = useState(false); // Track if verification was successful

  // Handle email submission to send verification email
  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to backend to send the verification email
      const response = await axios.post('http://your-flask-backend-url/send-email', { email });
      setMessage(response.data.message); // Show success message
      setIsCodeSent(true); // Transition to verification code form
    } catch (error) {
      setMessage('Error sending verification email');
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
      const response = await axios.post('http://your-flask-backend-url/verify-code', { email, code });
      setMessage(response.data.message);
      setIsVerified(true); // Mark as verified if successful
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error verifying code');
    }
  };

  return (
    <div className="m-8 font-sans">
      {!isCodeSent ? (
        // Email input form
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
            style={{ fontSize: '14px' }}
          >
            Send Verification Email
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

      {/* Display message */}
      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

export default EmailVerificationForm;

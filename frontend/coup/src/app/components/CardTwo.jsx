"use client";

import Image from "next/image";
import React, { useState } from 'react';
import { CardBody, CardContainer, CardItem } from "@/app/components/3d-card";
import Link from "next/link";


const ThreeDCardDemoTwo = () => {
  // Registration form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission for registration
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
  
    // Retrieve anonymousUserId from localStorage
    const anonymousUserId = localStorage.getItem('anonymousUserId');
  
    // Prepare the data to send, including the anonymousUserId
    const userData = {
      anonymousUserId: anonymousUserId, // Add the anonymous user ID to the request
      username: username,
      password: password
    };
  
    try {
      // Send a POST request to the server
      const response = await fetch('http://43.201.250.98/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      // Get the response data
      const result = await response.json();
      setMessage(result.message); // Display success or error message
    } catch (error) {
      setMessage('Error registering user');
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
  <form onSubmit={handleSubmit}>
  <div className="mb-4">
    </div>
    <div className="mb-4">
      <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        username:
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="mt-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 rounded-md w-full text-neutral-700 dark:text-white h-10" // Set height here
      />
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        password:
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 rounded-md w-full text-neutral-700 dark:text-white h-10" // Set height here
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold h-10" // Set height here
      style={{ fontSize: '14px' }}
    >
      register
    </button>
  </form>

          {/* Display message after registration */}
          {message && (
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
              {message}
            </p>
          )}
          <button className="gsi-material-button w-full mt-4 flex justify-center items-center p-2 rounded-xl bg-black dark:bg-black h-10"> {/* Set height here */}
    <div className="gsi-material-button-state"></div>
    <div className="gsi-material-button-content-wrapper flex items-center">
      <div className="gsi-material-button-icon mr-2">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '24px', height: '24px' }}>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
      </div>
      <span className="gsi-material-button-contents text-sm font-bold text-white">continue with Google</span>
    </div>
  </button>
</div>
      </CardBody>
    </CardContainer>
  );

  
}

export default ThreeDCardDemoTwo;
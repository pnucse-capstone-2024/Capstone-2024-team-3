import React, { useState } from 'react';

export default function ClearStorageButton() {
  const [message, setMessage] = useState('');

  const clearStorage = () => {
    // Clear all items in localStorage
    localStorage.clear();
    setMessage('Local storage cleared!');
  };

  return (
    <div style={{ backgroundColor: 'black', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <button 
        onClick={clearStorage} 
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Clear Local Storage
      </button>
      {message && (
        <p style={{ color: 'white', marginTop: '20px', fontSize: '18px' }}>
          {message}
        </p>
      )}
    </div>
  );
}

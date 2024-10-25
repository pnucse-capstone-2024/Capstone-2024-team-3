"use client";

import { useEffect } from 'react';
import { Vortex } from "@/app/components/vortex";
import HeroScrollDemo from "@/app/components/scroll";
import LayoutGridDemo from "@/app/components/bento";
import ReportIntro from "@/app/components/third-item-main"

export default function Home() {
  useEffect(() => {
    const registeranon = async () => {
      // Check if UID already exists in localStorage; if so, skip registration
      const storedUid = localStorage.getItem('anonymousUserId');
      if (storedUid) {
        console.log('Anonymous user ID already exists:', storedUid);
        return;
      }

      try {
        const response = await fetch('http://43.201.250.98/registeranon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Anonymous user registered:', data);
          // Store the new UID in localStorage
          localStorage.setItem('anonymousUserId', data.uid);
        } else {
          console.error('Error registering anonymous user:', data.message);
        }
      } catch (error) {
        console.error('Network error registering anonymous user:', error);
      }
    };

    registeranon();
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('anonymousUserId');
    console.log('Cleared anonymousUserId from localStorage');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <br></br>
      <br></br>
      <br></br>
      <button onClick={clearLocalStorage}>Clear Anonymous User ID</button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <HeroScrollDemo />
      <LayoutGridDemo />
      <ReportIntro />
    </main>
  );
}

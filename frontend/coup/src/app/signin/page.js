"use client";

import ThreeDCardDemoTwo from "../components/CardTwo";
import ClearStorageButton from "../components/clear";
import ThreedCardDemoThree from "../components/CardThree";
import EmailVerificationForm from "../components/email"

export default function Home() {
    return (
      <main className="min-h-screen p-5">
        <ThreeDCardDemoTwo></ThreeDCardDemoTwo>
        <ClearStorageButton></ClearStorageButton>
        <ThreedCardDemoThree/>
        <EmailVerificationForm/>
      </main>
    );
  }
  

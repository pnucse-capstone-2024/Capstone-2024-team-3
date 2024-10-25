import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navv";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "coup",
  description: "brought by coup de grace team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-black">
          <Navbar/>
          {children}
        </div>
        </body>
    </html>
  );
}

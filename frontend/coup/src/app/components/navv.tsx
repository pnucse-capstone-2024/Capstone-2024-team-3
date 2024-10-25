"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/app/components/navbar-menu";
import { cn } from "@/lib/utils";
import wall from "@/app/wall.jpg";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
    // className={cn("w-[40vw] inset-x-0 mx-auto z-50 p-2 font-sans", className)}
    className={cn("fixed w-[40vw] top-10 left-1/2 transform -translate-x-1/2 z-50 p-5 font-sans", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#start">bring me to the start</HoveredLink>
            <HoveredLink href="/#second">continue</HoveredLink>
            <HoveredLink href="/#end">end</HoveredLink>
          </div>
        </MenuItem>
        {/* <MenuItem setActive={setActive} active={active} item="run">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/upload">upload</HoveredLink>
            <HoveredLink href="/download">download</HoveredLink>
          </div>
        </MenuItem> */}
        <HoveredLink href="/upload">run</HoveredLink>
        <MenuItem setActive={setActive} active={active} item="learn">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/learn/#introduction">begin</HoveredLink>
            <HoveredLink href="/learn/#webdev">web development</HoveredLink>
            <HoveredLink href="/learn/#dataprep">data preprocessing</HoveredLink>
            <HoveredLink href="/learn/#modelbuild">model building</HoveredLink>
            <HoveredLink href="/learn/#visua">visualization</HoveredLink>
          </div>
        </MenuItem>
        {/* <HoveredLink href="/niiviewer">viewer</HoveredLink> */}
        <HoveredLink href="/visualization">visualization</HoveredLink>
        <HoveredLink href="/signin">profile</HoveredLink>
        {/* <MenuItem setActive={setActive} active={active} item="about">
          <div className="flex items-center space-x-4">
            <ProductItem
              title="Web Development"
              href="https://algochurn.com"
              src={wall}
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Data Preprocessing"
              href="https://tailwindmasterkit.com"
              src={wall}
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Model Building"
              href="https://gomoonbeam.com"
              src={wall}
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Visualization"
              href="https://userogue.com"
              src={wall}
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem> */}
        {/* <MenuItem setActive={setActive} active={active} item="profile">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/signin">one-time</HoveredLink>
            <HoveredLink href="/status">email</HoveredLink>
            <HoveredLink href="/download">google</HoveredLink>
          </div>
        </MenuItem> */}
      </Menu>
    </div>
  );
};

export default Navbar;

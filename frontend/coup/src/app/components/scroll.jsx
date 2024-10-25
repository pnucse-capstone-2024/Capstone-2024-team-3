"use client";
import React from "react";
import { ContainerScroll } from "@/app/components/container-scroll-animation";
import Image from "next/image";
import tissue from "@/app/resources/tissue.jpg"

const HeroScrollDemo = () => {
  return (
    <div className="flex flex-col overflow-hidden" id="start">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl  text-white font-sans">
              graduation project for team<br />
              <span className="text-4xl md:text-[6rem]  mt-1 leading-none font-sans">
                Coup de Grace
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={tissue}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default HeroScrollDemo;
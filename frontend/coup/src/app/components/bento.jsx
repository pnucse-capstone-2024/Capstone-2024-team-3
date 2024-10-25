"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "@/app/components/layout-grid";

const LayoutGridDemo = () => {
  return (
    <div className="h-screen py-20 w-full" id="second">
      <LayoutGrid cards={cards} />
    </div>
  );
}

export default LayoutGridDemo;

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Diagnostic Accuracy and Biomarkers
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
        MRI has been shown to be effective in detecting PD-related brain changes, such as iron accumulation in the substantia nigra or changes in brain volume
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Dataset
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      The dataset for our Parkinson’s Disease Prediction Model project is sourced

from the Parkinson’s Progression Markers Initiative (PPMI), a comprehen-
sive observational study focused on identifying biomarkers for the progres-
sion of Parkinson’s Disease
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Parkinson’s disease
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
         is the second most common neurodegenerative dis-
        order and the most common movement-related brain disease
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Neural Network
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      By harnessing the power of AI to analyze MRI im-
ages, there’s potential to revolutionize the diagnostic process, enabling more

accurate and timely identification of Parkinson’s disease
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://assets.kimshospitals.com/images/blogs/75_1573199315.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://i.pinimg.com/564x/3b/79/d1/3b79d11f974a61b66f5b762525e663e2.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2011/01/01/16/526913_1.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://i.pinimg.com/564x/91/1f/48/911f4809d3063a618b53f02d8b9f370e.jpg",
  },
];

"use client";
import React from "react";
import Image from "next/image";
import spectImage from "@/app/resources/spect.jpg";
import control from "@/app/resources/control.png";
import architecture from "@/app/resources/architecture.jpeg";
import original from "@/app/resources/1.jpeg";
import second from "@/app/resources/2.jpeg";
import third from "@/app/resources/3.jpeg";

const PresentationPage = () => {
  return (
    <div
      className="w-full min-h-screen bg-white text-black overflow-hidden"
      style={{ fontFamily: "Courier, Courier New, monospace" }}
    >
      {/* Intro Section */}
      <section id="intro" className="relative flex flex-col items-center justify-center h-screen text-center p-8 bg-black text-white">
        <h1 className="text-4xl md:text-[4rem] font-bold leading-none">
          AI-Powered Parkinson's Diagnosis
        </h1>
        <p className="mt-4 text-xl">
          A Journey through Web Development, Data Preprocessing, Model Building, and Visualization
        </p>
      </section>

      {/* Web Development Section */}
      <section id="webdev" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Web Development</h2>
          <p className="text-lg">
            Our web application features a responsive interface designed to enhance user interaction. Key components include seamless image uploads, dynamic data rendering, and effective integration of machine learning models to support healthcare professionals in making timely diagnoses.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src={spectImage}
            alt="Web Development"
            className="rounded-xl object-cover"
            draggable={false}
          />
        </div>
      </section>

      {/* Data Preprocessing Section */}
      <section id="dataprep" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6 order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-4">Data Preprocessing</h2>
          <p className="text-lg">
            Our data preprocessing phase involves critical steps to ensure model readiness, including data cleaning to remove artifacts, augmentation to enrich the dataset, normalization to standardize inputs, and format conversion to optimize compatibility with machine learning algorithms.
          </p>
        </div>
        <div className="md:w-1/2 order-1 md:order-2">
          <Image
            src={control}
            alt="Data Preprocessing"
            className="rounded-xl object-cover"
            draggable={false}
          />
        </div>
      </section>

      {/* Model Building Section */}
      <section id="modelbuild" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Model Building</h2>
          <p className="text-lg">
            We developed a cutting-edge deep learning architecture tailored for Parkinson’s diagnosis from SPECT images. Utilizing a 3D ResNet model, we ensured high accuracy through comprehensive training on curated datasets, facilitating early detection of the disease.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src={architecture}
            alt="Model Building"
            className="rounded-xl object-cover"
            draggable={false}
          />
        </div>
      </section>

      {/* Visualization Section */}

        <section id="visua" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6 order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">Visualization</h2>
            <p className="text-lg">
            We employ saliency maps to highlight critical areas within the SPECT images, providing transparency in the model’s predictions. This visualization aids healthcare professionals in understanding the model's focus, enhancing trust and interpretability in the diagnostic process.
            </p>
        </div>
        <div className="md:w-1/2 order-1 md:order-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-center">
            <Image
                src={original}
                alt="Original Image"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            />
            </div>
            <div className="flex justify-center">
            <Image
                src={third}
                alt="Saliency Map"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            />
            </div>
            <div className="flex justify-center">
            <Image
                src={second}
                alt="Overlay"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            />
            </div>
        </div>
        </section>


    </div>
  );
};

export default PresentationPage;
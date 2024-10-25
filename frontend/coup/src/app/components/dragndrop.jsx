import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const MyDropzone = ({ onFileSelect }) => {
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/nii': ['.nii', '.nii.gz'] }, // Restrict to .nii files
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError("Only .nii files are allowed");
      } else {
        setError(""); // Clear any previous error
        if (acceptedFiles.length > 0) {
          onFileSelect(acceptedFiles[0]); // Pass the file to the parent component
        }
      }
    }
  });

  return (
    <div {...getRootProps()} className="w-[40vw] bg-black rounded-2xl border-2 border-white border-dashed p-5 h-[10vh] flex justify-center items-center text-center">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-white">Drop the files here ...</p>
      ) : (
        <p className="text-white font-sans">Drag 'n' drop a .nii file here, or click to select files</p>
      )}
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default MyDropzone;

import React, { useEffect, useRef } from 'react';
import './niivue.css'; // Adjust the path to match your project structure

const NiivueViewer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const initializeNiivue = async () => {
      // Import Niivue dynamically (only on the client-side)
      const { Niivue } = await import('./niivue/index.ts');

      const defaults = {
        backColor: [0, 0, 0, 1], // background color
        show3Dcrosshair: true, // show the crosshair
        loglevel: 'debug', // log level for debugging
        isRuler: true, // enable ruler
      };

      // Initialize Niivue with the defaults
      const nv1 = new Niivue(defaults);
      if (canvasRef.current) {
        nv1.attachToCanvas(canvasRef.current);
      }

      // Define volumes with file paths
      const volumeList = [
        { url: '/aligned_mri.nii', colormap: 'gray' },
        { url: '/segmented_mri.nii', colormap: 'warm' },
      ];

      // Debug: Check if the volume list contains valid URLs
      console.log('Loading volumes from URLs:', volumeList.map(v => v.url));

      // Try to load volumes and handle any errors
      try {
        await nv1.loadVolumes(volumeList);
      } catch (error) {
        console.error('Error loading volumes:', error);
      }
    };

    // Initialize Niivue on component mount
    initializeNiivue();
  }, []);

  return (
    <div style={{ display: 'flex', width: '10%', height: '10%' }}>
      <canvas ref={canvasRef} id="gl1" style={{ width: '10%', height: '10%' }}></canvas>
    </div>
  );
};

export default NiivueViewer;

// Eyedropper.jsx

import React, { useState } from 'react';

export default function Eyedropper() {
  const [color, setColor] = useState('#ffffff');

  const handlePickColor = async () => {
    if (!('EyeDropper' in window)) {
      alert('EyeDropper API is not supported in this browser.');
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
      console.log('Selected color:', result.sRGBHex);
    } catch (error) {
      console.error('Color selection canceled or failed:', error);
    }
  };

  return (
    <div>
      <h1>Eyedropper</h1>
      <button onClick={handlePickColor}>Pick Color</button>
      <div
        style={{
          marginTop: '20px',
          width: '100px',
          height: '100px',
          backgroundColor: color,
          border: '1px solid #000',
        }}
      >
        <p>{color}</p>
      </div>
    </div>
  );
}
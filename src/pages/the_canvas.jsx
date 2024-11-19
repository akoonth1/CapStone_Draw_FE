import React, { useEffect, useRef } from 'react';
import './canvas.css';

export default function TheCanvas({ width, height, resolution, brushColor, brushOpacity }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const draw = (x, y) => {
      const rgbaColor = hexToRgba(brushColor, brushOpacity);
      context.strokeStyle = rgbaColor;
      context.lineWidth = resolution;
      context.lineCap = 'round';

      context.beginPath();
      context.moveTo(lastX.current, lastY.current);
      context.lineTo(x, y);
      context.stroke();

      lastX.current = x;
      lastY.current = y;
    };

    const handleMouseDown = (event) => {
      isDrawing.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      lastX.current = x;
      lastY.current = y;
      draw(x, y);
    };

    const handleMouseMove = (event) => {
      if (!isDrawing.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      draw(x, y);
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [brushColor, brushOpacity, resolution]);

//   const handleSave = () => {
//     const canvas = canvasRef.current;
//     canvas.toBlob((blob) => {
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'canvas.png';
//       link.click();
//       console.log(blob);
//       console.log(link);
//     }, 'image/png');
//   };

const handleSave = () => {
    const canvas = canvasRef.current;
  
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Canvas is empty or failed to convert to blob.');
        alert('Failed to convert canvas to image.');
        return;
      }
  
      // Create FormData and append the blob
      const formData = new FormData();
      formData.append('file', blob, 'canvas.png'); // 'file' is the key your backend expects
  
      try {
        const response = await fetch('http://localhost:3000/api/blob/', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log('Success:', result);
        alert('Canvas has been successfully saved to the database!');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to save the canvas. Please try again.');
      }
    }, 'image/png');
  };

  return (
    <div className="tocanvas">
      <canvas ref={canvasRef} width={width} height={height} />
      <button onClick={handleSave}>Save Canvas</button>
    </div>
  );
}

function hexToRgba(hex, opacity) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r},${g},${b},${opacity})`;
}
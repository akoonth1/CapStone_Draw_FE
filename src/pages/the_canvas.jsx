import React, { useEffect, useRef, useState, } from 'react';
import './canvas.css';

export default function TheCanvas({ width, height, resolution, brushColor, brushOpacity, tool }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const [pictureName, setPictureName] = useState('');

    // History stack for undo functionality
    const historyRef = useRef([]);
    const maxHistory = 5; // Maximum number of undo steps
    let redoRef = useRef(null);

// Function to save canvas to local storage
const saveCanvasToLocalStorage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('savedCanvas', dataURL);
  };

  // Function to load canvas from local storage
  const loadCanvasFromLocalStorage = () => {
    const dataURL = localStorage.getItem('savedCanvas');
    if (dataURL) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
      };
      image.src = dataURL;
    }
  };

  // Function to save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    historyRef.current.push(canvas.toDataURL());
    // Limit history to prevent excessive memory usage
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    }
  };

  // Function to handle Undo action
  const handleUndo = () => {
    if (historyRef.current.length === 0) {
      alert('No more actions to undo.');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Remove the last state
    redoRef =historyRef.current.pop();

    // Get the previous state
    const previousState = historyRef.current[historyRef.current.length - 1];

    if (previousState) {
      const img = new Image();
      img.src = previousState;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        saveCanvasToLocalStorage();
      };
    } else {
      // If no previous state exists, clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      saveCanvasToLocalStorage();
    }
  };



  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
      // Load saved canvas if available
      loadCanvasFromLocalStorage();
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const draw = (x, y) => {
        const context = canvasRef.current.getContext('2d');
        context.lineWidth = resolution;
        context.lineCap = 'round';
      
        //Eraser removes  pixels

        if (tool === 'eraser') {
          context.globalCompositeOperation = 'destination-out';
          context.strokeStyle = `rgba(0,0,0,${brushOpacity})`;
        } else {
          context.globalCompositeOperation = 'source-over';
          const rgbaColor = hexToRgba(brushColor, brushOpacity);
          context.strokeStyle = rgbaColor;
        }
      
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
        if (isDrawing.current) {
          isDrawing.current = false;
          saveToHistory();
          saveCanvasToLocalStorage();
        }
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
  }, [brushColor, brushOpacity, resolution, tool]);


const handleSave = () => {
    const canvas = canvasRef.current;
  
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Canvas is empty or failed to convert to blob.');
        alert('Failed to convert canvas to image.');
        return;
      }

      if (!pictureName.trim()) {
        alert('Please enter a name for your picture.');
        return;
      }
    

      // Create FormData and append the blob
      const formData = new FormData();
      formData.append('file', blob, `${pictureName}.png`); // 'file' is the key your backend expects
  
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


  const handleReset = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Optionally, fill the canvas with a white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Remove saved canvas from local storage
    localStorage.removeItem('savedCanvas');

    // Clear history
    historyRef.current = [];
    
    // Save the cleared state
    saveToHistory();
  };

console.log( historyRef.current)

    const handleRedo = () => {
        if (redoRef) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
      
          const img = new Image();
          img.src = redoRef;
          img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
            saveCanvasToLocalStorage();
          };
      
          redoRef = null;
        } else {
          alert('No more actions to redo.');
        }
      }
  
  return (
    <div className="tocanvas">
      <canvas ref={canvasRef} width={width} height={height} />

      <input
        type="text"
        placeholder="Name of picture"
        value={pictureName}
        onChange={(e) => setPictureName(e.target.value)}
        required
      />
 
      <button onClick={handleSave}>Save Canvas</button>
      <button onClick={handleReset}>Reset Canvas</button>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
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
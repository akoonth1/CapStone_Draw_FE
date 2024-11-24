import React, { useEffect, useRef, useState, useContext} from 'react';
import './canvas.css';
import BookContext from '../Context/BookContext'; // Import BookContext
import AuthContext from '../Context/auth_context';

export default function TheCanvas({ 
    id,
    width, 
    height, 
    resolution, 
    brushColor, 
    brushOpacity, 
    tool }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const { setOrderedIds } = useContext(BookContext); // Access setOrderedIds from context

  const [pictureName, setPictureName] = useState('');

  const {user} = useContext(AuthContext);
 

  console.log('id:', id);// Null when creating new image, otherwise contains the image ID

    // History stack for undo functionality
    const historyRef = useRef([]);
    const maxHistory = 6; // Maximum number of undo steps
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
  // Fix undo to not have last step as reset
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
  // const context = canvas.getContext('2d');

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

  useEffect(() => {
    if (id) {
      // Fetch the pictureName if id exists
      async function fetchPictureName() {
        try {
          const response = await fetch(`http://localhost:3000/api/blob/${id}/pictureName`);
          if (!response.ok) {
            throw new Error(`Error fetching picture name: ${response.statusText}`);
          }
          const data = await response.json();
          setPictureName(data.pictureName);
        } catch (error) {
          console.error('Failed to fetch picture name:', error);
          alert('Failed to fetch picture name.');
        }
      }

      fetchPictureName();
    }
  }, [id]);

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

    // Create FormData and append the required fields

    try {
      let response;

      if (id) {
        // **Editing Mode: Update existing image**
        const formData = new FormData();

        formData.append('data', blob, `${pictureName.trim()}.png`); 
        formData.append('contentType', blob.type);                   
        formData.append('pictureName', pictureName.trim());         

        response = await fetch(`http://localhost:3000/api/blob/${id}`, {
          method: 'PUT',
          body: formData,

        });
      } else {


        // **Creating Mode: Save new image**

        const formData = new FormData();
        formData.append('file', blob, `${pictureName || 'untitled'}.png`); // 'file' is the key your backend expects
        if (userId) {
        formData.append('userId', userId);
        }
        console.log(formData);
        response = await fetch('http://localhost:3000/api/blob/', {
          method: 'POST',
          body: formData,

        });
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      alert(`Canvas has been successfully ${id ? 'updated' : 'saved'}.`);

      // Optionally, clear the local storage after saving
      localStorage.removeItem('savedCanvas');
    } catch (error) {
      console.error('Error saving the canvas:', error);
      alert(`Failed to ${id ? 'update' : 'save'} the canvas. Please try again.`);
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

     

    //   const handleRemoveId = () => {
    //     if (!id) {
    //         console.warn('onRemoveId prop is not provided or not a function.');

    //     } else { id = null;
    //     }
    //   };
    
    // const handleSaveAsNew = async () => {
    //     const canvas = canvasRef.current;
    //     canvas.toBlob(async (blob) => {
    //       if (blob) {
    //         try {
    //           const formData = new FormData();
    //           formData.append('image', blob, `${pictureName || 'canvas'}_${Date.now()}.png`);
    
    //           const response = await fetch('http://localhost:3000/api/blob', {
    //             method: 'POST',
    //             body: formData,
    //           });
    
    //           if (!response.ok) {
    //             const errorText = await response.text();
    //             console.error(`Error saving image: ${response.status} - ${errorText}`);
    //             alert('Failed to save the image.');
    //             return;
    //           }
    
    //           const data = await response.json();
    //           const newImageId = data._id; // Adjust based on your API response
    
    //           // Update the orderedIds in BookContext
    //           setOrderedIds((prevIds) => [...prevIds, newImageId]);
    
    //           alert('Canvas has been saved as a new image!');
    //         } catch (error) {
    //           console.error('Error saving canvas:', error);
    //           alert('An unexpected error occurred while saving the image.');
    //         }
    //       } else {
    //         alert('Failed to generate image from canvas.');
    //       }
    //     }, 'image/png');
    //   };
    const handleSaveAsNew = async () => {
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const formData = new FormData();
              formData.append('file', blob, `${pictureName}clone.png`);
              
              const response = await fetch('http://localhost:3000/api/blob', {
                method: 'POST',
                body: formData,
              });
    
              const result = await response.json();
              if (response.ok) {
                alert('Image saved successfully!');
              } else {
                alert(`Error: ${result.error}`);
              }
            } catch (error) {
              console.error('Error uploading image:', error);
              alert('Failed to upload image.');
            }
          }
        });
      };
    
  return (
    <div className="tocanvas">
               <div className="toolbar">
      <input
        type="text"
        placeholder="Name of picture"
        value={pictureName}
        onChange={(e) => setPictureName(e.target.value)}
        required
        disabled={!!id} // Disable input if editing
      />
 
      <button onClick={handleSave}>Save Canvas</button>
      {id && (
        <>
          <button onClick={handleSaveAsNew}>Save as New</button>
        </>
      )}
     {/* {id && <button onClick={handleRemoveId}>Stop Editing</button>} */}
      <button onClick={handleReset}>Reset Canvas</button>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
 
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
import React, { useState, useEffect } from 'react';
import FullList from '../components/FullList';
import { useNavigate } from 'react-router-dom';

export default function FindDrawing() {
  const [selectedId, setSelectedId] = useState('');
  const [imageData, setImageData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedId) {
      const fetchImage = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${selectedId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageData(imageUrl);
        } catch (error) {
          console.error('Error fetching image:', error);
          setImageData(null); // Clear image data on error
        }
      };

      fetchImage();
    } else {
      // Reset imageData when no ID is selected
      setImageData(null);
    }
  }, [selectedId]);

    // const handleDelete = async () => {
    //     const confirmed = window.confirm('Are you sure you want to delete this canvas?');
    //     if (!confirmed) return;

    //   try {
    //     const response  = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/PageChecker/${selectedId}`, {
    //       method: 'GET',
    //     });
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //     return;

    //   } catch (error) {
    //     console.error('Error fetching image:', error);
    //     alert('Failed to load the canvas for editing. Please try again.');
        
    //   }

    
    // try {
    //   const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${selectedId}`, {
    //     method: 'DELETE',
    //   });
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   setImageData(null);
    //   setSelectedId('');
    //   alert('Canvas deleted successfully.');
    // } catch (error) {
    //   console.error('Error deleting image:', error);
    
    // }
    // window.location.reload();
    // }
// SingleImageLoader.jsx

const handleDelete = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this canvas?');
  if (!confirmed) return;

  try {
    // Check if related data exists

    try{
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/PageChecker/${selectedId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });



    const data = await response.json();
    console.log('PageChecker data:', data);
    console.log(data.message);

    // Assuming the API returns an object with an 'exists' property
    if (data.message !=='No books found containing the given page.') {
      alert('Cannot delete the canvas because related data exists.');
      return; // Abort the delete operation
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } } catch (error) {
      console.error('Error fetching image:', error);
      // alert('Failed to load the canvas for editing. Please try again.');
    }
    // Proceed to delete since no related data exists
    const deleteResponse = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${selectedId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Delete failed! status: ${deleteResponse.status}`);
    }

    alert('Canvas deleted successfully.');

    // navigate('/books');
  } catch (error) {
    console.error('Error handling delete:', error);
    alert('Failed to delete the canvas. Please try again.');
  }
};
  
    const handleEdit = async () => {
        const confirmed = window.confirm('Are you sure you want to edit this canvas?');
        if (!confirmed) return;
    
        try {
          const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${selectedId}`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const blob = await response.blob();
    
          // Convert Blob to Data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataURL = reader.result;
            // Save the Data URL into local storage
            localStorage.setItem('savedCanvas', dataURL);
            // Navigate to TheCanvas component with the id
            navigate(`/draw/${selectedId}`); // Updated route with id
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error fetching image for editing:', error);
          alert('Failed to load the canvas for editing. Please try again.');
        }
      };

  return (
    <div>
      <h1>Find Drawing</h1>
      <FullList onSelect={setSelectedId} />
      <button onClick={handleDelete}>Delete Canvas</button>
      <button onClick={handleEdit}>Edit Canvas</button>
      {imageData && (
        <div>
          <h2>Displaying Image for ID: {selectedId}</h2>
          <img src={imageData} alt={`Drawing ${selectedId}`} style={{ maxWidth: '100%', height: 'auto' }} />
       
        </div>
      )}
   
    </div>
  );
}
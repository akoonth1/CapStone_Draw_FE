import React, { useState, useEffect } from 'react';
import FullList from './FullList';

export default function FindDrawing() {
  const [selectedId, setSelectedId] = useState('');
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (selectedId) {
      const fetchImage = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/blob/${selectedId}`);
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

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this canvas?');
        if (!confirmed) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/blob/${selectedId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setImageData(null);
      setSelectedId('');
      alert('Canvas deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
    
    }
    }

  

  return (
    <div>
      <h1>Find Drawing</h1>
      <FullList onSelect={setSelectedId} />
      {imageData && (
        <div>
          <h2>Displaying Image for ID: {selectedId}</h2>
          <img src={imageData} alt={`Drawing ${selectedId}`} style={{ maxWidth: '100%', height: 'auto' }} />
       
        </div>
      )}
         <button onClick={handleDelete}>Delete Canvas</button>
    </div>
  );
}
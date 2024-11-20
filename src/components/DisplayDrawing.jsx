// DisplayDrawing.jsx

import React, { useEffect, useState } from 'react';

export default function DisplayDrawing() {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch the drawings
    async function fetchDrawings() {
      try {
        const response = await fetch('http://localhost:3000/api/blobs');
        
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDrawings(data);
      } catch (err) {
        console.error('Error fetching drawings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Invoke the fetch function
    fetchDrawings();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <div><h1>Display Drawing</h1><p>Loading...</p></div>;
  }

  if (error) {
    return <div><h1>Display Drawing</h1><p>Error: {error}</p></div>;
  }

  return (
    <div>

      {drawings.length > 0 ? (
        drawings.map((blob) => (
          <div key={blob._id} style={{ marginBottom: '20px' }}>
            <img
              src={`http://localhost:3000/api/blob/${blob._id}`}
              alt={`Drawing ${blob._id}`}
              style={{ maxWidth: '500px', height: 'auto', border: '1px solid #ccc', padding: '10px' }}
            />
           
          </div>
        ))
      ) : (
        <p>No drawings found.</p>
      )}
    </div>
  );
}
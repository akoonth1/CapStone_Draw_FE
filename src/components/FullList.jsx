// FullList.jsx
import React, { useState, useEffect } from 'react';

export default function FullList({ onSelect }) {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    async function getDrawingsList() {  
      try {
        const response = await fetch('http://localhost:3000/api/blobslist');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ids = await response.json();

        // Fetch picture name for each id
        const drawingsWithNames = await Promise.all(
          ids.map(async (id) => {
            const nameResponse = await fetch(`http://localhost:3000/api/blob/${id}/pictureName`);
            if (!nameResponse.ok) {
              throw new Error(`Error fetching picture name for id ${id}`);
            }
            const { pictureName } = await nameResponse.json();
            return { id, pictureName };
          })
        );

        setDrawings(drawingsWithNames);
      } catch (err) {
        console.error('Error fetching drawings:', err);
      }
    }

    getDrawingsList();
  }, []);

  return (
    <div>
      <h2>Select a Drawing</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="" disabled selected>
          Select a drawing
        </option>
        {drawings.map(({ id, pictureName }) => (
          <option key={id} value={id}>
            {pictureName}
          </option>
        ))}
      </select>
    </div>
  );
}
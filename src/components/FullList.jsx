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
        const data = await response.json();
        console.log(data);
        setDrawings(data);
      } catch (err) {
        console.error('Error fetching drawings:', err);
      }
    }

    getDrawingsList();
  }, []);

  return (
    <div>
      <h2>Select a Drawing ID</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="" disabled selected>
          Select an ID
        </option>
        {drawings.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  );
}
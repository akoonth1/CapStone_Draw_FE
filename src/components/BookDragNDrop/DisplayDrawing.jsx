
import React, { useState, useEffect, useContext } from 'react';
import BookDrager from './BookDrager'; // Ensure the correct import path
import  BookContext from '../../Context/BookContext'; // Adjust the import path as needed
import TextContext from '../../Context/TextContext';

export default function DisplayDrawing({ id, pictureName, imageUrl }) {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const initialColumnsData = {
    column1: drawings,
    column2: [],
  };
// localStorage.setItem('columnsData', JSON.stringify(initialColumnsData));   

const [columns, setColumns] = useState(() => {
  const savedColumns = localStorage.getItem('columnsData');
  if (savedColumns && savedColumns !== JSON.stringify(initialColumnsData)) {
    console.log('Initializing columns from localStorage');
    return JSON.parse(savedColumns);
  } else {
    console.log('Initializing columns with initialColumnsData');
    return initialColumnsData;
  }
});

  const EmptyColumns = 
  {
    column1: [],
    column2: [],
  };
// if (localStorage.getItem('columnsData')===) {
  

  const savedColumns = localStorage.getItem('columnsData');
console.log(savedColumns);
console.log(EmptyColumns)
console.log(savedColumns===EmptyColumns)
console.log(initialColumnsData)

  const [pages, setPages] = useState([]);

  // Consume the BookContext
  const { orderedIds, setOrderedIds } = useContext(BookContext);
  const  {textData, setTextData} = useContext(TextContext);

  useEffect(() => {
    // Fetch drawings from the API
    async function fetchDrawings() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blobs`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the raw data to inspect its structure
        console.log('Fetched Data:', data);

        // Add 'content' key and map '_id' to 'id' for consistency
        const updatedDrawings = data.map(drawing => ({
          ...drawing,
          id: drawing._id, // Map '_id' to 'id' for consistency
          content: `${import.meta.env.VITE_BE_URL}/api/blob/${drawing._id}`, // Use '_id' here
        }));

        setDrawings(updatedDrawings);
        setLoading(false);
        console.log('Updated Drawings:', updatedDrawings);



                // If columnsData is not in localStorage, initialize it
                const savedColumns = localStorage.getItem('columnsData');
                if (!savedColumns || savedColumns === JSON.stringify(initialColumnsData)) {
                  const newColumnsData = {
                    column1: updatedDrawings,
                    column2: [],
                  };
                  setColumns(newColumnsData);
                  localStorage.setItem('columnsData', JSON.stringify(newColumnsData));
                }
        
        
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchDrawings();
  }, []);
   

 // Save columns to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('columnsData', JSON.stringify(columns));
  }, [columns]);

  
  const handleColumnsChange = (updatedColumns) => {
    setColumns(updatedColumns);
  };

  // const handleSaveOrder = () => {
  //   setOrderedIds(drawings.map((d) => d._id));
  //   console.log('Order saved:', drawings.map((d) => d._id));
  //   alert('Image order has been saved!');
  // };

const handleSaveOrder = () => {
    // Extract page IDs from column2
    const column2PageIds = columns.column2.map((drawing) => drawing.id);
    setOrderedIds(column2PageIds);
    console.log('Order saved:', column2PageIds);
    // alert('Image order in Column 2 has been saved!');
  };

  useEffect(() => {
    if (columns && columns.column2) {
      handleSaveOrder();
    }

  }, [columns.column2]);

  const resetLocalStorage = () => {
    localStorage.removeItem('columnsData');
    localStorage.removeItem('textData');
    setColumns(initialColumnsData);
    setTextData({});
    console.log('Local storage has been cleared.');
    window.location.reload();
  };
  


  return (
    <div>
           {/* <div className="save-order-button-container">
        <button onClick={handleSaveOrder} className="save-order-button">
          Save Order
        </button>
      </div> */}

      {loading && <p>Loading drawings...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && drawings.length > 0 && (
        // <BookDrager initialColumns={initialColumnsData}   setColumns={handleColumnsChange} />
       // <BookDrager initialColumns={initialColumnsData}   onColumnsChange={handleColumnsChange} />
<BookDrager columns={columns} setColumns={setColumns} />

      )}
      {!loading && !error && drawings.length === 0 && (
        <p>No drawings available.</p>
      )}
    <button onClick={resetLocalStorage}>Reset Data</button>
    </div>
  );
}
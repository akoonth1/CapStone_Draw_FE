// // DisplayDrawing.jsx

// import React, { useEffect, useState, useContext } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//     useDroppable,
//     rectIntersection,
//     closestCorners,
    
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//     rectSortingStrategy,
//   verticalListSortingStrategy,
//     useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import DraggableItem from './draggableItem';
// import Droppable from './droppable';
// import SortableItem from './SortableItem';


// import './DisplayDrawing.css'; // Ensure CSS is updated
// import BookContext from './BookContext'; // Import the BookContext
// import Task from './Task';
// import Column from './Column';
// import BookDrager from './BookDrager';

// // const initialColumnsData = {
// //     column1: [
// //       { id: 'task-1', content: 'Task 1' },
// //       { id: 'task-2', content: 'Task 2' },
// //       { id: 'task-3', content: 'Task 3' },
// //     ]}


// export default function DisplayDrawing( { id, pictureName, imageUrl }) {

//   const [drawings, setDrawings] = useState([]);
//   const [emptyColumn, setEmptyColumn] = useState([]); // State for the empty column
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pages, setPages] = useState([]);

//   // Consume the BookContext
//   const { orderedIds, setOrderedIds } = useContext(BookContext);

//   // Initialize sensors
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 5,
//       },
//     })
//   );

//   // useDroppable for empty column
//   const { setNodeRef: setEmptyColumnRef, isOver } = useDroppable({
//     id: 'empty-column',
//   });
// // DisplayDrawing.jsx

// useEffect(() => {
//   // Fetch drawings from the API
//   async function fetchDrawings() {
//     try {
//       const response = await fetch('http://localhost:3000/api/blobs');

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Log the raw data to inspect its structure
//       console.log('Fetched Data:', data);

//       // Add 'content' key and map '_id' to 'id' for consistency
//       const updatedDrawings = data.map(drawing => ({
//         ...drawing,
//         id: drawing._id, // **Uncommented:** Map '_id' to 'id'
//         content: `http://localhost:3000/api/blob/${drawing._id}`, // Use '_id' here
//       }));

//       setDrawings(updatedDrawings);
//       setLoading(false);
//       console.log('Updated Drawings:', updatedDrawings);
      
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   }

//   fetchDrawings();
// }, []);

//  // Prepare initial column data once drawings are fetched
//  const initialColumnsData = {
//     column1: drawings, // All drawings are initially in 'column1'
//   };

// // Fetch Pages for selected book
// // useEffect(() => {
// //     async function fetchPages() {
// //         try {
// //         const response = await fetch(`http://localhost:3000/books/booklist/${selectedBookId}`);
// //         if (!response.ok) {
// //             throw new Error(`Error fetching pages for book ID ${selectedBookId}: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         setPages(data);
// //         } catch (error) {
// //         console.error(error);
// //         }
// //     }
// //     if (selectedBookId) {
// //         fetchPages();
// //     }
// // }, [selectedBookId]);







//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over) return;

//     if (over.id === 'empty-column') {
//       // Copy the item to the empty column
//       const draggedItem = drawings.find((item) => item._id === active.id);
//       if (draggedItem) {
//         const copiedItem = {
//           ...draggedItem,
//           _id: uuidv4(), // Ensure unique ID
//         };
//         setEmptyColumn((prev) => [...prev, copiedItem]);
//       }
//       return;
//     }

//     // Reorder within drawings
//     if (active.id !== over.id) {
//       const oldIndex = drawings.findIndex((item) => item._id === active.id);
//       const newIndex = drawings.findIndex((item) => item._id === over.id);
//       const newDrawings = arrayMove(drawings, oldIndex, newIndex);
//       setDrawings(newDrawings);
//       setOrderedIds(newDrawings.map((d) => d._id)); // Save the new order to context
//       console.log('New Order of IDs:', newDrawings.map((d) => d._id)); // Log the ordered IDs
//     }
//   };

//   const handleSaveOrder = () => {
//     setOrderedIds(drawings.map((d) => d._id));
//     console.log('Order saved:', drawings.map((d) => d._id));
//     alert('Image order has been saved!');
//   };

//   if (loading) {
//     return (
//       <div>
//         <h1>Display Drawing</h1>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Display Drawing</h1>
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="display-drawing-container">
//       <h1>Display Drawing</h1>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         {/* Empty Column as a Droppable Area */}
//         <div
//           className={`empty-column ${isOver ? 'drag-over' : ''}`}
//           ref={setEmptyColumnRef}
//         >
//           {emptyColumn.length === 0 && (
//             <p className="empty-column-placeholder">Drop here to copy</p>
//           )}
//           {emptyColumn.map((blob) => (
//             <SortableItem
//               key={blob._id}
//               id={blob._id}
//               pictureName={blob.pictureName}
//               imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
//             />
//           ))}
//         </div>

//         {/* Grid Container */}
//         <SortableContext
//           items={drawings.map((drawing) => drawing._id)}
//           strategy={rectSortingStrategy}
//         >
//           <div className="grid-container">
//             {drawings.map((blob) => (
//               <SortableItem
//                 key={blob._id}
//                 id={blob._id}
//                 pictureName={blob.pictureName}
//                 imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
//               />
//             ))}
//           </div>
//         </SortableContext>
//       </DndContext>

//       <div className="save-order-button-container">
//         <button onClick={handleSaveOrder} className="save-order-button">
//           Save Order
//         </button>
//       </div>

//       <div className="ordered-ids">
//         <h2>Ordered Image IDs:</h2>
//         <ul>
//           {orderedIds.map((id) => (
//             <li key={id}>{id}</li>
//           ))}
//         </ul>
//       </div>
//       <BookDrager initialColumns={initialColumnsData} />
//     </div>
//   );
// }


// DisplayDrawing.jsx

import React, { useState, useEffect, useContext } from 'react';
import BookDrager from './BookDrager'; // Ensure the correct import path
import  BookContext from './BookContext'; // Adjust the import path as needed

export default function DisplayDrawing({ id, pictureName, imageUrl }) {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState({ column1: [], column2: [] }); // Initialize columns

  const [pages, setPages] = useState([]);

  // Consume the BookContext
  const { orderedIds, setOrderedIds } = useContext(BookContext);

  useEffect(() => {
    // Fetch drawings from the API
    async function fetchDrawings() {
      try {
        const response = await fetch('http://localhost:3000/api/blobs');

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
          content: `http://localhost:3000/api/blob/${drawing._id}`, // Use '_id' here
        }));

        setDrawings(updatedDrawings);
        setLoading(false);
        console.log('Updated Drawings:', updatedDrawings);
        
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchDrawings();
  }, []);
   

  // Prepare initial column data once drawings are fetched
  const initialColumnsData = {
    column1: drawings, // All drawings are initially in 'column1'
    column2: [], 
  };
  const handleColumnsChange = (updatedColumns) => {
    setColumns(updatedColumns);
  };

//   const handleSaveOrder = () => {
//     setOrderedIds(drawings.map((d) => d._id));
//     console.log('Order saved:', drawings.map((d) => d._id));
//     alert('Image order has been saved!');
//   };

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
    // You can add more dependencies if needed
  }, [columns.column2]);


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
        <BookDrager initialColumns={initialColumnsData }   setColumns={handleColumnsChange} />
      )}
      {!loading && !error && drawings.length === 0 && (
        <p>No drawings available.</p>
      )}
      {/* Additional UI components can go here */}
    </div>
  );
}
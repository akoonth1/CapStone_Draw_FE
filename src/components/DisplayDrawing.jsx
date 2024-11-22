// // DisplayDrawing.jsx

// import React, { useEffect, useState, useContext } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// KeyboardSensor,
    
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//     rectSortingStrategy,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import DraggableItem from './draggableItem';
// import Droppable from './droppable';
// import SortableItem from './SortableItem';


// import './DisplayDrawing.css'; // Ensure CSS is updated
// import BookContext from './BookContext'; // Import the BookContext

// export default function DisplayDrawing( { id, pictureName, imageUrl }) {

//   const [drawings, setDrawings] = useState([]);
//   const [emptyColumn, setEmptyColumn] = useState([]); // State for the empty column
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   useEffect(() => {
//     // Fetch drawings from the API
//     async function fetchDrawings() {
//       try {
//         const response = await fetch('http://localhost:3000/api/blobs');

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setDrawings(data);
//       } catch (err) {
//         console.error('Error fetching drawings:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDrawings();
//   }, []);

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
//     </div>
//   );
// }
// DisplayDrawing.jsx
// DisplayDrawing.jsx

// DisplayDrawing.jsx


import React, { useContext, useEffect, useState } from 'react';
import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  KeyboardSensor, 
  closestCenter 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem'; // Ensure this component is correctly implemented
import Droppable from './Droppable'; // Your Droppable component
import BookContext from './BookContext'; // Ensure this context is correctly set up
import './DisplayDrawing.css'; // Import your styles

export default function DisplayDrawing() {
  // State for columns
  const [columns, setColumns] = useState({
    column1: [], // Existing column
    'image-drop-area': [], // New droppable area for images
    // Add more columns if needed
  });

  // State for drawings fetched from API
  const [drawings, setDrawings] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consume the BookContext
  const { orderedIds, setOrderedIds } = useContext(BookContext);

  // Initialize sensors for DnD Kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch drawings from the API on component mount
  useEffect(() => {
    async function fetchDrawings() {
      try {
        const response = await fetch('http://localhost:3000/api/blobs');

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

    fetchDrawings();
  }, []);

  // Update columns when drawings change (assign all drawings to column1)
  useEffect(() => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      column1: drawings,
    }));
  }, [drawings]);

  // Handle drag end event
const handleDragEnd = (event) => {
  const { active, over } = event;

  if (!over) return;

  const activeColumn = findColumn(active.id);
  const overColumn = findColumn(over.id);

  if (!activeColumn || !overColumn) return;

  // Prevent moving items within the image-drop-area if desired
  if (activeColumn.id === 'image-drop-area' && overColumn.id === 'image-drop-area') {
    return;
  }

  // Moving to image-drop-area
  if (overColumn.id === 'image-drop-area') {
    setColumns((prevColumns) => {
      const sourceItems = Array.from(prevColumns[activeColumn.id]);
      const targetItems = Array.from(prevColumns['image-drop-area']);

      const sourceIndex = sourceItems.findIndex(item => item._id === active.id);
      if (sourceIndex === -1) return prevColumns;

      const [movedItem] = sourceItems.splice(sourceIndex, 1);
      targetItems.push(movedItem);

      return {
        ...prevColumns,
        [activeColumn.id]: sourceItems,
        'image-drop-area': targetItems,
      };
    });
    return;
  }

  // Reordering within the same column
  if (activeColumn.id === overColumn.id) {
    const oldIndex = activeColumn.items.findIndex(item => item._id === active.id);
    const newIndex = overColumn.items.findIndex(item => item._id === over.id);

    if (oldIndex !== newIndex) {
      setColumns((prevColumns) => ({
        ...prevColumns,
        [activeColumn.id]: arrayMove(prevColumns[activeColumn.id], oldIndex, newIndex),
      }));
    }
    return;
  }

  // Optional: Handle moving between other columns if applicable
};
  // Helper function to find which column an item belongs to
const findColumn = (id) => {
  for (const [columnId, items] of Object.entries(columns)) {
    if (items.find(item => item._id === id)) {
      console.log(`Item ${id} found in column ${columnId}`);
      return { id: columnId, items };
    }
  }
  console.warn(`Item ${id} not found in any column`);
  return { id: null, items: [] };
};
  // Render loading or error states
  if (loading) return <p>Loading drawings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="display-drawing-container">
        {/* Existing Column */}
        <Droppable theuniqueIdentifier="column1">
          <SortableContext
            items={columns.column1.map(item => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="sortable-column">
              {columns.column1.map((blob) => (
                <SortableItem
                  key={blob._id}
                  id={blob._id}
                  pictureName={blob.pictureName}
                  imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
                />
              ))}
            </div>
          </SortableContext>
        </Droppable>

        {/* New Droppable Area for Images */}
        <Droppable theuniqueIdentifier="image-drop-area">
          <SortableContext
            items={columns['image-drop-area'].map(item => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="image-drop-area sortable-column">
              {columns['image-drop-area'].length === 0 && (
                <p className="image-drop-placeholder">Drop images here</p>
              )}
              {columns['image-drop-area'].map((blob) => (
                <SortableItem
                  key={blob._id}
                  id={blob._id}
                  pictureName={blob.pictureName}
                  imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
                />
              ))}
            </div>
          </SortableContext>
        </Droppable>
      </div>
    </DndContext>
  );
}
// DisplayDrawing.jsx

import React, { useEffect, useState, useContext } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs
import './DisplayDrawing.css'; // Ensure CSS is updated
import BookContext from './BookContext'; // Import the BookContext

export default function DisplayDrawing() {
  const [drawings, setDrawings] = useState([]);
  const [emptyColumn, setEmptyColumn] = useState([]); // State for the empty column
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consume the BookContext
  const { orderedIds, setOrderedIds } = useContext(BookContext);

  // Initialize sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // useDroppable for empty column
  const { setNodeRef: setEmptyColumnRef, isOver } = useDroppable({
    id: 'empty-column',
  });

  useEffect(() => {
    // Fetch drawings from the API
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === 'empty-column') {
      // Copy the item to the empty column
      const draggedItem = drawings.find((item) => item._id === active.id);
      if (draggedItem) {
        const copiedItem = {
          ...draggedItem,
          _id: uuidv4(), // Ensure unique ID
        };
        setEmptyColumn((prev) => [...prev, copiedItem]);
      }
      return;
    }

    // Reorder within drawings
    if (active.id !== over.id) {
      const oldIndex = drawings.findIndex((item) => item._id === active.id);
      const newIndex = drawings.findIndex((item) => item._id === over.id);
      const newDrawings = arrayMove(drawings, oldIndex, newIndex);
      setDrawings(newDrawings);
      setOrderedIds(newDrawings.map((d) => d._id)); // Save the new order to context
      console.log('New Order of IDs:', newDrawings.map((d) => d._id)); // Log the ordered IDs
    }
  };

  const handleSaveOrder = () => {
    setOrderedIds(drawings.map((d) => d._id));
    console.log('Order saved:', drawings.map((d) => d._id));
    alert('Image order has been saved!');
  };

  if (loading) {
    return (
      <div>
        <h1>Display Drawing</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Display Drawing</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="display-drawing-container">
      <h1>Display Drawing</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Empty Column as a Droppable Area */}
        <div
          className={`empty-column ${isOver ? 'drag-over' : ''}`}
          ref={setEmptyColumnRef}
        >
          {emptyColumn.length === 0 && (
            <p className="empty-column-placeholder">Drop here to copy</p>
          )}
          {emptyColumn.map((blob) => (
            <SortableItem
              key={blob._id}
              id={blob._id}
              pictureName={blob.pictureName}
              imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
            />
          ))}
        </div>

        {/* Grid Container */}
        <SortableContext
          items={drawings.map((drawing) => drawing._id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid-container">
            {drawings.map((blob) => (
              <SortableItem
                key={blob._id}
                id={blob._id}
                pictureName={blob.pictureName}
                imageUrl={`http://localhost:3000/api/blob/${blob._id}`}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="save-order-button-container">
        <button onClick={handleSaveOrder} className="save-order-button">
          Save Order
        </button>
      </div>

      <div className="ordered-ids">
        <h2>Ordered Image IDs:</h2>
        <ul>
          {orderedIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SortableItem({ id, pictureName, imageUrl }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid-item"
      {...attributes}
      {...listeners}
    >
      <div className="image-container">
        <img
          src={imageUrl}
          alt={pictureName}
          className="grid-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.png'; // Provide a valid placeholder image path
          }}
        />
        <div className="caption">
          <span className="picture-name">{pictureName}</span>
          <span className="picture-id">ID: {id}</span>
        </div>
      </div>
    </div>
  );
}
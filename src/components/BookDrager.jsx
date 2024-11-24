// BookDrager.jsx

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column'; // Ensure correct import path
import './DisplayDrawing.css';
import StoryBoard from './StoryBoard';


function BookDrager({ columns, setColumns }) {

  


  // Initialize state for columns from props
  const [columnsState, setColumnsState] = useState(columns);

  


  // Initialize sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Helper function to find which column a task or column ID belongs to
  const findContainer = (id) => {
    for (const columnId in columnsState) {
      if (columnsState[columnId].some(item => item.id === id) || id === columnId) {
        return columnId;
      }
    }
    return null;
  };

  // Handle drag start event
  const handleDragStart = (event) => {
    // You can implement any logic needed on drag start
  };

  // Handle drag cancel event
  const handleDragCancel = () => {
    // You can implement any logic needed on drag cancel
  };

  // Handle drag end event
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceContainer = findContainer(active.id);
    const destinationContainer = findContainer(over.id);

    if (!sourceContainer || !destinationContainer) return;

    if (sourceContainer === destinationContainer) {
      // Reordering within the same column
      const items = columnsState[sourceContainer];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = over.id
        ? items.findIndex((item) => item.id === over.id)
        : items.length;

      if (oldIndex !== newIndex) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedColumns = {
          ...columnsState,
          [sourceContainer]: newItems,
        };
        setColumnsState(updatedColumns);
        setColumns(updatedColumns); // Update parent
      }
    } else {
      // Moving between different columns
      const sourceItems = Array.from(columnsState[sourceContainer]);
      const destinationItems = Array.from(columnsState[destinationContainer]);
      const activeIndex = sourceItems.findIndex((item) => item.id === active.id);

      if (activeIndex !== -1) {
        const [movedItem] = sourceItems.splice(activeIndex, 1);



               // If moving to column2, initialize text field if not present
               if (destinationContainer === 'column2') {
                movedItem.text = movedItem.text || ''; // Initialize text if not present
              } else {
                delete movedItem.text; // Remove text if moving out of column2
              }
      



        // Insert into destination column
        if (over.id === destinationContainer) {
          destinationItems.push(movedItem);
        } else {
          const overIndex = destinationItems.findIndex((item) => item.id === over.id);
          if (overIndex === -1) {
            destinationItems.push(movedItem);
          } else {
            destinationItems.splice(overIndex, 0, movedItem);
          }
        }

        const updatedColumns = {
          ...columnsState,
          [sourceContainer]: sourceItems,
          [destinationContainer]: destinationItems,
        };

        setColumnsState(updatedColumns);
        setColumns(updatedColumns); // Update parent
      }
    }
  };
 // Handle text input changes for items in column2
 const handleTextChange = (itemId, newText) => {
    const updatedColumns = { ...columnsState };
    updatedColumns['column2'] = updatedColumns['column2'].map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    setColumnsState(updatedColumns);
    setColumns(updatedColumns); // Update parent
  };

// Custom Collision is acting strange
  const customCollisionDetection = (args) => {
    const rectIntersectionResult = rectIntersection(args);
    const closestCenterResult = closestCenter(args);

    // Combine the results of both strategies
    return closestCenterResult.length > 0 ? closestCenterResult : rectIntersectionResult;
  };
  


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>
        {Object.keys(columnsState).map((columnId) => (
          <SortableContext
            key={columnId}
            items={columnsState[columnId].map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column id={columnId} tasks={columnsState[columnId]} />
          </SortableContext>
        ))}
      
      <StoryBoard ids={columnsState.column2.map((item) => item.id)} />
      </div>
    </DndContext>
  );
}

export default BookDrager;

// onTextChange={handleTextChange} 
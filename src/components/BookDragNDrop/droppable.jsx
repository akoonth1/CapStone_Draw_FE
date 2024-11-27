// Droppable.jsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';


export default function Droppable({ theuniqueIdentifier, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: theuniqueIdentifier,
  });

  const style = {
    border: isOver ? '2px dashed #28a745' : '2px dashed #ccc',
    padding: '20px',
    borderRadius: '8px',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
    minHeight: '150px', // Ensure the droppable area has a minimum height
    backgroundColor: isOver ? '#e0ffe0' : '#f9f9f9', // Background color change on hover
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
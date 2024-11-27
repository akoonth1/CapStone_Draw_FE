
// SortableItem.jsx

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SortableItem.css'; // Ensure this CSS file exists

export default function SortableItem({ id, pictureName, imageUrl }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    padding: '8px',
    margin: '4px 0',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: isDragging ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
  };


  return (
    <div ref={setNodeRef} style={style} className="sortable-item" {...attributes} {...listeners}>
      <img src={imageUrl} alt={pictureName} className="sortable-item-image" />
      <p className="sortable-item-name">{pictureName}</p>
    </div>
  );
}
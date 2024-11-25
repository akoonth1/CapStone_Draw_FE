
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './DisplayDrawing.css';

const Task = ({ id, content, pictureName, isEditable, onContentChange }) => {
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
    transition: transform ? 'none' : transition, // Better to remove transition when dragging
    opacity: isDragging ? 0.5 : 1,
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab',
    textAlign: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img 
        src={content} 
        alt={ 'Drawing'} 
        style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
      />
      <p>{pictureName || ''}</p>
        
      

    </div>
  );
};

export default Task;
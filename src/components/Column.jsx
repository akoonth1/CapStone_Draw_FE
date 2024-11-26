
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task'; // Ensure the correct import path
import './DisplayDrawing.css';

const Column = ({ id, tasks, onContentChange }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`droppable ${isOver ? 'is-over' : ''}`}
      style={{
        margin: '0 10px',
        padding: '10px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        width: '200px',
        minHeight: '100px',
      }}
    >
      <h2>{id.toUpperCase()}</h2>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.length === 0 && (
          <div className="column-placeholder" style={{ textAlign: 'center', color: '#999' }}>
            Drop items here
          </div>
        )}
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            content={task.content}
            pictureName={task.pictureName}
            isEditable={id === 'column1'} // Adjust as needed
            onContentChange={onContentChange}
          />
        ))}
      </SortableContext>
      <p className="last-task-id">
        Last Task ID: {tasks.length > 0 ? tasks[tasks.length - 1].id : 'No tasks'}
      </p>
    </div>
  );
};

export default Column;



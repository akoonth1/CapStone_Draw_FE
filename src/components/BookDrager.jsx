// BookDrager.jsx

import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  rectIntersection,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Task component
const Task = ({ id, content, isEditable, onContentChange }) => {
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
    transition: transform ? 'none' : transition, // Remove transition when dragging
    opacity: isDragging ? 0.5 : 1,
    padding: '8px',
    margin: '4px 0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isEditable ? (
        <input
          type="text"
          value={content}
          onChange={(e) => onContentChange(id, e.target.value)}
        />
      ) : (
        content
      )}
    </div>
  );
};

// Column component
const Column = ({ id, tasks, onContentChange }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Function to get the last task ID in the column
  const getLastTaskId = (tasks) => {
    if (tasks.length === 0) return 'No tasks';
    return tasks[tasks.length - 1].id;
  };

  return (
    <div ref={setNodeRef} className={`droppable ${isOver ? 'is-over' : ''}`} style={{ margin: '0 10px', padding: '10px', border: '2px dashed #ccc', borderRadius: '8px', width: '200px', minHeight: '100px' }}>
      <h2>{id.toUpperCase()}</h2>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.length === 0 && (
          <div className="column-placeholder" style={{ textAlign: 'center', color: '#999' }}>Drop items here</div>
        )}
        {tasks.map((task, index) => (
          <Task
            key={task.id}
            id={task.id}
            content={task.content}
            isEditable={id === 'column3' && index === 0}
            onContentChange={onContentChange}
          />
        ))}
      </SortableContext>
      <p className="last-task-id">Last Task ID: {getLastTaskId(tasks)}</p>
    </div>
  );
};

function BookDrager() {
  // State for tasks in columns
  const [columns, setColumns] = useState({
    column1: [
      { id: 'task-1', content: 'Task 1' },
      { id: 'task-2', content: 'Task 2' },
      { id: 'task-3', content: 'Task 3' },
    ],
    column2: [
      { id: 'task-4', content: 'Task 4' },
    ],
    column3: [
      { id: 'task-5', content: 'Task 5' },
    ],
  });

  // State to keep track of the number of columns
  const [columnCount, setColumnCount] = useState(3);

  // State for the active drag item
  const [activeDragItem, setActiveDragItem] = useState(null);

  // Initialize sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Helper function to find which column a task or column ID belongs to
  const findContainer = (id) => {
    if (columns.column1.find((item) => item.id === id) || id === 'column1') return 'column1';
    if (columns.column2.find((item) => item.id === id) || id === 'column2') return 'column2';
    if (columns.column3.find((item) => item.id === id) || id === 'column3') return 'column3';
    // Check dynamically added columns
    const dynamicColumns = Object.keys(columns).filter(col => !['column1', 'column2', 'column3'].includes(col));
    for (let col of dynamicColumns) {
      if (columns[col].find(item => item.id === id) || id === col) return col;
    }
    return null;
  };

  // Handle drag start event
  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;

    // Find the active task
    const activeTask =
      columns.column1.find((item) => item.id === activeId) ||
      columns.column2.find((item) => item.id === activeId) ||
      columns.column3.find((item) => item.id === activeId) ||
      Object.values(columns).flat().find((item) => item.id === activeId);

    setActiveDragItem(activeTask);
  };

  // Handle drag cancel event
  const handleDragCancel = () => {
    setActiveDragItem(null);
  };

  // Handle drag end event
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceContainer = findContainer(active.id);
    const destinationContainer = findContainer(over.id);

    if (!sourceContainer || !destinationContainer) return;

    if (sourceContainer === destinationContainer) {
      // Reordering within the same column
      const items = columns[sourceContainer];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== newIndex) {
        const newItems = arrayMove(items, oldIndex, newIndex);

        setColumns((prev) => ({
          ...prev,
          [sourceContainer]: newItems,
        }));
      }
    } else {
      // Moving between different columns
      const sourceItems = Array.from(columns[sourceContainer]);
      const destinationItems = Array.from(columns[destinationContainer]);
      const activeIndex = sourceItems.findIndex((item) => item.id === active.id);

      if (activeIndex !== -1) {
        const [movedItem] = sourceItems.splice(activeIndex, 1);

        // If over.id is a column ID, add the item to the end
        if (over.id === destinationContainer) {
          destinationItems.push(movedItem);
        } else {
          // Insert the item at the correct position
          const overIndex = destinationItems.findIndex((item) => item.id === over.id);
          if (overIndex === -1) {
            destinationItems.push(movedItem);
          } else {
            destinationItems.splice(overIndex, 0, movedItem);
          }
        }

        setColumns((prev) => ({
          ...prev,
          [sourceContainer]: sourceItems,
          [destinationContainer]: destinationItems,
        }));
      }
    }

    // Reset the active drag item
    setActiveDragItem(null);
  };

  // Handle content change for the input text element
  const handleContentChange = (id, newContent) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const column in newColumns) {
        const taskIndex = newColumns[column].findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          newColumns[column][taskIndex].content = newContent;
          break;
        }
      }
      return newColumns;
    });
  };

  // Function to add a new column
  const handleAddColumn = () => {
    const newColumnId = `column${columnCount + 1}`;
    setColumns((prev) => ({
      ...prev,
      [newColumnId]: [],
    }));
    setColumnCount(columnCount + 1);
  };

  // Custom collision detection to handle empty columns
  const customCollisionDetection = (args) => {
    const rectIntersectionResult = rectIntersection(args);
    const closestCenterResult = closestCenter(args);

    // Combine the results of both strategies
    return closestCenterResult.length > 0 ? closestCenterResult : rectIntersectionResult;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <h1>Book Drager</h1>
      <button onClick={handleAddColumn} style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Add Column
      </button>
      <div className="container" style={{ display: 'flex', overflowX: 'auto' }}>
        <div className="sideby" style={{ display: 'flex' }}>
          {Object.keys(columns).map((columnId) => (
            <div key={columnId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Column id={columnId} tasks={columns[columnId]} onContentChange={handleContentChange} />
              <p>Last Task ID in {columnId}: {columns[columnId].length > 0 ? columns[columnId][columns[columnId].length - 1].id : 'No tasks'}</p>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default BookDrager;

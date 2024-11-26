
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
      <h2>{}</h2>
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

//Turn to row

// import React from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
// import Task from './Task'; // Ensure the correct import path
// import './DisplayDrawing.css';

// const Column = ({ id, tasks, onContentChange }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`droppable ${isOver ? 'is-over' : ''}`}
//       style={{
//         display: 'flex', // Use flex layout
//         flexDirection: 'row', // Arrange items in a row
//         alignItems: 'flex-start',
//         margin: '10px 0',
//         padding: '10px',
//         border: '2px dashed #ccc',
//         borderRadius: '8px',
//         minHeight: '100px',
//         overflowX: 'auto', // Allow horizontal scrolling if needed
//       }}
//     >
     

//       <SortableContext
//         items={tasks.map((task) => task.id)}
//         strategy={horizontalListSortingStrategy} // Use horizontal sorting strategy
//       >
//         {tasks.length === 0 && (
//           <div
//             className="column-placeholder"
//             style={{ textAlign: 'center', color: '#999', flex: '1 0 auto' }}
//           >
//             Drop items here
//           </div>
//         )}
//         {tasks.map((task) => (
//           <Task
//             key={task.id}
//             id={task.id}
//             content={task.content}
//             pictureName={task.pictureName}
//             isEditable={id === 'column1'} // Adjust as needed
//             onContentChange={onContentChange}
//           />
//         ))}
//       </SortableContext>
      
//       {/* Optional: Display last task ID */}
//       {/* <p className="last-task-id">
//         Last Task ID: {tasks.length > 0 ? tasks[tasks.length - 1].id : 'No tasks'}
//       </p> */}
//     </div>
//   );
// };

// export default Column;
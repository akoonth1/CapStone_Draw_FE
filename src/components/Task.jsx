

import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

const Task = ({id, content}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useDraggable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px',
        margin: '4px 0',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    };
    return <div ref={setNodeRef} {...attributes} {...listeners} style={style} className='task'>
        <input type='checkbox' />
        {content}
        </div> 
};

export default Task;
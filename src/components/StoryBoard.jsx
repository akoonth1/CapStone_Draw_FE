import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Story.css';

export function StoryBoard() {
  const [items, setItems] = useState(['1', '2', '3', '4', '5']);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = [...items];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, active.id);
      setItems(newItems);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="board">
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="gray-square"
      {...attributes}
      {...listeners}
    >
      {id}
    </div>
  );
}
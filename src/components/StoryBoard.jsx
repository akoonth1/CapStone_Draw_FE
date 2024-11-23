// StoryBoard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { DndContext } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Story.css';
import BookContext from './BookContext';
import TextContext from './TextContext';

export function StoryBoard({ ids }) {

  const { orderedIds, setOrderedIds } = useContext(BookContext);
  const { setTextData, textData } = useContext(TextContext); // Destructure setTextData and textData from TextContext

  // Initialize items with string IDs and preserve text
  const [items, setItems] = useState(() =>
    ids.map((id) => ({
      id: id.toString(),
      text: '',
    }))
  );

  useEffect(() => {
    setItems((prevItems) => {
      // Create a map of previous items for quick lookup
      const prevItemsMap = {};
      prevItems.forEach((item) => {
        prevItemsMap[item.id] = item;
      });

      // Build the new items array, preserving text where possible
      const newItems = ids.map((id) => {
        const idStr = id.toString();
        if (prevItemsMap[idStr]) {
          // Preserve existing item with text
          return prevItemsMap[idStr];
        } else {
          // Create a new item with empty text
          return { id: idStr, text: '' };
        }
      });

      // Check if newItems are different from current items
      const isSame =
        newItems.length === prevItems.length &&
        newItems.every((newItem, index) => 
          newItem.id === prevItems[index].id &&
          newItem.text === prevItems[index].text
        );

      if (isSame) {
        return prevItems; // No change
      }
      return newItems;
    });
    console.log(setTextData);
  }, [ids]);



  useEffect(() => {
    const textData = items.map((item) => ({ id: item.id, text: item.text }));
    setTextData(textData);
  
  }, [items, setTextData]);

  // Handle drag end to reorder items
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== newIndex) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  };

  // Handle text changes in SortableItem
  const handleTextChange = (id, newText) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="board">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              text={item.text}
              onTextChange={handleTextChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// SortableItem Component
function SortableItem({ id, text, onTextChange }) {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Style for the draggable item
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    padding: '10px',
    margin: '0 10px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab',
    minWidth: '150px',
    textAlign: 'center',
  };

  // Handle input change
  const handleChange = (e) => {
    onTextChange(id, e.target.value);
  };
  // Handle key down to prevent Spacebar from triggering drag
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
 <input
  type="text"
  value={text}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  className="sortable-item-input"
  placeholder="Enter text"
  aria-label={`Editable text for item ${id}`}
/>
    </div>
  );
}

export default StoryBoard;

import React, { useState, useEffect, useContext } from 'react';
import BookContext from '../../Context/BookContext';
import TextContext from '../../Context/TextContext';
import './Story.css';

export function StoryBoard({ ids }) {


  const { orderedIds, setOrderedIds } = useContext(BookContext);
  const { textData, setTextData } = useContext(TextContext); // Destructure setTextData and textData from TextContext

  // Initialize items with string IDs and preserve text
  const [items, setItems] = useState(() =>
    ids.map((id) => ({
      id: id.toString(),
      text: '',
    }))
  );

  // Load textData from localStorage on component mount
  useEffect(() => {
    const savedTextData = localStorage.getItem('textData');
    console.log(savedTextData); 
    if (savedTextData) {
      try {
        const parsedTextData = JSON.parse(savedTextData);
        setTextData(parsedTextData);
        // Update items with the saved text data
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            text: parsedTextData[item.id] || '',
          }))
        );
      } catch (error) {
        console.error('Error parsing textData from localStorage:', error);
      }
    }
  }, [setTextData]);

  // Save textData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('textData', JSON.stringify(textData));
  }, [textData]);

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
          return { id: idStr, text: textData[idStr] || '' };
        }
      });

      return newItems;
    });
  }, [ids, textData]);

  // Handle text changes for items
  const handleTextChange = (itemId, newText) => {
    // Update local state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, text: newText } : item
      )
    );

    // Update global textData
    setTextData((prevTextData) => ({
      ...prevTextData,
      [itemId]: newText,
    }));
  };

  // Handle Drag and Drop, Saving, etc.
  // ... (Your existing drag and drop logic)

  return (
    <div className="storyboard-container">
      {items.map((item) => (
        <div key={item.id} className="storyboard-item">
          <textarea
            value={item.text}
            onChange={(e) => handleTextChange(item.id, e.target.value)}
            placeholder="Enter text..."
            className="storyboard-textarea"
          />
          {/* Include drag handles, buttons, etc., as needed */}
        </div>
      ))}
    </div>
  );
}
export default StoryBoard;
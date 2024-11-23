// BookContext.jsx

import React, { createContext, useState } from 'react';
import { TextProvider } from './TextContext'; // Ensure correct import
import TextContext from './TextContext'; // Ensure correct import

// Create the BookContext
const BookContext = createContext();

// Create the BookProvider component
export function BookProvider({ children }) {
  const [orderedIds, setOrderedIds] = useState([]); // State to store ordered IDs

  const value = {
    orderedIds,
    setOrderedIds,
  };

  return (
    <BookContext.Provider value={value}>
      <TextProvider>
        {children}
      </TextProvider>
    </BookContext.Provider>
  );
}

export default BookContext;
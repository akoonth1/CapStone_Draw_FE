// TextContext.jsx

import React, { createContext, useState } from 'react';

// Create the TextContext
const TextContext = createContext();

// Create the TextProvider component
export function TextProvider({ children }) {
  const [textData, setTextData] = useState([]); // State to store ID and text pairs

  const value = {
    textData,
    setTextData,
    // You can add more context values or functions here if needed
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
}

export default TextContext;
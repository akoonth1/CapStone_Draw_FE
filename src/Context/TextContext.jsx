// TextContext.jsx

// src/Context/TextContext.js

import React, { createContext, useState, useEffect } from 'react';

const TextContext = createContext();

export const TextProvider = ({ children }) => {
  const [textData, setTextData] = useState(() => {
    try {
      const savedTextData = localStorage.getItem('textData');
      return savedTextData ? JSON.parse(savedTextData) : {};
    } catch (error) {
      console.error('Error parsing textData from localStorage:', error);
      return {};
    }
  });

  // Save textData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('textData', JSON.stringify(textData));
    } catch (error) {
      console.error('Error saving textData to localStorage:', error);
    }
  }, [textData]);

  return (
    <TextContext.Provider value={{ textData, setTextData }}>
      {children}
    </TextContext.Provider>
  );
};

export default TextContext;
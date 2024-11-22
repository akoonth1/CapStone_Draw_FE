// import React, { createContext, useState } from 'react';



// export const BookContext = createContext();

// const BookProvider = (children) => {
//     const [pages, setPages] = useState([]);

//     return (
//         <BookContext.Provider value={{pages, setPages}}>
//             {children}
//         </BookContext.Provider>
//     );
// };
// export  default BookProvider;

// BookContext.jsx

import React, { createContext, useState } from 'react';

// Create the BookContext
const BookContext = createContext();

// Create the BookProvider component
export function BookProvider({ children }) {
  const [orderedIds, setOrderedIds] = useState([]); // State to store ordered IDs

  const value = {
    orderedIds,
    setOrderedIds,
    // You can add more context values or functions here if needed
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}

export default BookContext;
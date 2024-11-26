// BookConstructor.jsx

import { useState, useContext } from 'react';
import BookContext from '../Context/BookContext';
import TextContext from '../Context/TextContext';
import SearchPage from './SearchPage';
import { StoryBoard } from '../components/StoryBoard';
import  AuthContext  from '../Context/auth_context';

export default function BookConstructor() {
  const { orderedIds } = useContext(BookContext);
  const { textData } = useContext(TextContext); 
  const [title, setTitle] = useState('');
  const [PagesArray, setPagesArray] = useState([]);
  const {user, cookies} = useContext(AuthContext);
 
  if (user) {
    console.log('user:', user.user.id);
  }
 
  // Function to save the book by posting to the API
async function SaveBook(title, PagesArray, TextArray) {


  const requestData = {
    title,
    PagesArray,
    TextArray,
    // Conditionally add 'createdBy' if 'user' exists
    // Use spread syntax to conditionally add properties to the object
    ...(user ? { createdBy: user.user.id } : {}),
  };

  // Convert the object to a JSON string
  const requestbody = JSON.stringify(requestData);


console.log('requestbody:', requestbody);

  try {

 
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book`, 
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body:  requestbody
   
    });

    // console.log('title:', title),
    //   console.log('PagesArray:', PagesArray),
    //   console.log('TextArray:', TextArray),
    //   console.log('createdBy:', user.user.id);
    
    // Log the response for debugging
    console.log('Response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error saving book: ${response.status} - ${errorText}`);
      alert(`Error saving book: ${response.status} - ${errorText}`);  
      throw new Error(`Error saving book: ${response.status}`);
    }

    const data = await response.json();
    alert('Book has been saved successfully!');
    return data;
  } catch (error) {
    console.error('Failed to save book:', error);
    alert('Failed to save book:', error);
    throw error;
  }
}
  // Handler for the Save Book button
  const handleSave = async () => {
    console.log(textData);
    try {
      const data = await SaveBook(title, orderedIds, textData);
      console.log('Saved Book:', data);
      alert('Book has been saved successfully!');
      // Optionally, reset the title or provide user feedback here
      
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
    <div>
      <h1>Book Constructor</h1>
      <input
        type="text"
        placeholder="Enter Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleSave}>Save Book</button>
      <h2>Ordered Image IDs:</h2>
      <ul>
        {orderedIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
    <div>
    <SearchPage />
    {/* <StoryBoard props={PagesArray}/> */}
    </div>
    </>

  );
}// BookConstructor.jsx

// import React, { useContext, useState, useEffect } from 'react';
// import TextContext from '../components/TextContext';
// import BookContext from '../components/BookContext'; // Ensure correct import path
// import SearchPage from './SearchPage';
// import { StoryBoard } from '../components/StoryBoard';

// export default function BookConstructor() {
//   const { orderedIds } = useContext(BookContext);
//   const {  } = useContext(TextContext); // Destructure textData from TextContext
//   const [title, setTitle] = useState('');

//   // Function to save the book by posting to the API
//   async function SaveBook(title, PagesArray, textData) {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title,
//           PagesArray,
//           textData, // Include textData from TextContext
//         }),
//       });

//       // Log the response for debugging
//       console.log('Response:', response);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Error saving book: ${response.status} - ${errorText}`);
//         alert(`Error saving book: ${response.status} - ${errorText}`);
//         throw new Error(`Error saving book: ${response.status}`);
//       }

//       const data = await response.json();
//       alert('Book has been saved successfully!');
//       return data;
//     } catch (error) {
//       console.error('Failed to save book:', error);
//       alert(`Failed to save book: ${error.message}`);
//       throw error;
//     }
//   }

//   // Handler for the Save Book button
//   const handleSaveBook = () => {
//     if (!title.trim()) {
//       alert('Please enter a title for the book.');
//       return;
//     }

//     if (orderedIds.length === 0) {
//       alert('Please add at least one page to the book.');
//       return;
//     }

//     // Prepare PagesArray based on orderedIds and textData
//     const preparedPagesArray = orderedIds.map((id) => {
//       const page = textData.find((item) => item.id === id);
//       return {
//         id,
//         text: page ? page.text : '',
//       };
//     });

//     if (preparedPagesArray.length === 0) {
//       alert('No text data available to save.');
//       return;
//     }

//     console.log('Preparing to save book with the following data:', {
//       title,
//       PagesArray: preparedPagesArray,
//       textData,
//     });

//     // Call SaveBook with title, preparedPagesArray, and textData
//     SaveBook(title, preparedPagesArray, textData);
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Create a New Book</h2>
//       <div className="mb-3">
//         <label htmlFor="bookTitle" className="form-label">
//           Book Title
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           id="bookTitle"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Enter book title"
//         />
//       </div>

//       {/* StoryBoard Component to manage pages */}
//       <StoryBoard ids={orderedIds} />

//       <button className="btn btn-primary mt-3" onClick={handleSaveBook}>
//         Save Book
//       </button>

//       {/* Optionally include SearchPage or other components */}
//       <SearchPage />
//     </div>
//   );
// }
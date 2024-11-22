// BookConstructor.jsx

import { useState, useContext } from 'react';
import BookContext from '../components/BookContext';

export default function BookConstructor() {
  const { orderedIds } = useContext(BookContext);
  const [title, setTitle] = useState('');

  // Function to save the book by posting to the API
async function SaveBook(title, PagesArray) {
  try {
    const response = await fetch('http://localhost:3000/books/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        PagesArray,
      }),
    });

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
    try {
      const data = await SaveBook(title, orderedIds);
      console.log('Saved Book:', data);
      alert('Book has been saved successfully!');
      // Optionally, reset the title or provide user feedback here
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
}
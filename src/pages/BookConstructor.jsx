
import { useState, useContext } from 'react';
import BookContext from '../Context/BookContext';
import TextContext from '../Context/TextContext';
import SearchPage from './SearchPage';
import { StoryBoard } from '../components/BookDragNDrop/StoryBoard';
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
      {/* <h2>Ordered Image IDs:</h2>
      <ul>
        {orderedIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul> */}
    </div>
    <div>
    <SearchPage />
    {/* <StoryBoard props={PagesArray}/> */}
    </div>
    </>

  );
}
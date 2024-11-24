// BookGrid.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookGrid.css';

export default function BookGrid() {
    const [index, setIndex] = useState(0);
    const [covers, setCovers] = useState([]);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
      };
  
  useEffect(() => {
    // Fetch book titles from the API
    async function fetchCovers() {
      try {
        const response = await fetch('http://localhost:3000/books/booklistcovers');
        if (!response.ok) {
          throw new Error(`Error fetching book titles: ${response.status}`);
        }
        const data = await response.json();
        setCovers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCovers();

  }, []);

  useEffect(() => {
    async function fetchImages() {
      try {
        const imagePromises = covers.map(async (cover) => {
          try {
            const response = await fetch(`http://localhost:3000/api/blob/${cover.firstPageElement}`);
            if (!response.ok) {
              throw new Error(`Error fetching image for ID ${cover.firstPageElement}: ${response.status}`);
            }
            const blob = await response.blob();
            console.log(blob);
            const imageUrl = URL.createObjectURL(blob);
            return { imageUrl };
          } catch (error) {
            console.error(error);
            return null; // Return null if there was an error fetching this image
          }
        });
  
  
        const imagesData = await Promise.all(imagePromises);
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
  
    if (covers.length > 0) {
      fetchImages();
    }
  }, [covers]);


const goRead = () => {
    console.log('goRead');
    // navigate('/read');
    }



    const goDelete = async (coverID) => {
        console.log('goDelete', coverID);
        // Uncomment and ensure you have access to the navigate function if navigation is desired
        // navigate('/delete');
    
        try {
          const response = await fetch(`http://localhost:3000/books/booklist/${coverID}`, {
            method: 'DELETE',
          });
    
          if (!response.ok) {
            throw new Error(`Error deleting book: ${response.status}`);
          }
    
          alert('Book has been deleted successfully!');
          window.location.reload();
    
          // Refresh the list of book covers after deletion
          // Ensure fetchCovers is defined in the scope or adjust accordingly
         // If fetchCovers is defined outside, ensure it's accessible here
        } catch (error) {
          console.error('Failed to delete book:', error);
          alert(`Failed to delete book: ${error.message}`);
        }
      };
    
    //   const goEdit = async(BookID) => {
    //     const confirmed = window.confirm('Are you sure you want to edit this canvas?');
    //     if (!confirmed) return;
    //     console.log('goEdit', BookID);

    //     try {
    //         const response = await fetch(`http://localhost:3000/books/book/${BookID}`, {
    //           method: 'GET',
    //         });
    //         if (!response.ok) {
    //           throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const book = await response.json();
    //         console.log(book);
    //         console.log(book.PagesArray);
    //         console.log(book.TextArray);
    //         console.log(localStorage.getItem('columnsData'));
            
    //         // const savedColumns = localStorage.getItem('columnsData');
    //         // const savedTextData = localStorage.getItem('textData');
    //     }
    //     catch (error) {
    //       console.error('Error fetching book:', error);

    //   }
    // }

    const goEdit = async (BookID) => {
      const confirmed = window.confirm('Are you sure you want to edit this canvas?');
      if (!confirmed) return;
      console.log('goEdit', BookID);
  
      try {
        const response = await fetch(`http://localhost:3000/books/book/${BookID}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const book = await response.json();
        console.log('Fetched Book:', book);
        console.log('PagesArray:', book.PagesArray);
        console.log('TextArray:', book.TextArray);
  
        // Store PagesArray and TextArray in localStorage
        localStorage.setItem('columnsData', JSON.stringify(book.PagesArray));
        localStorage.setItem('textData', JSON.stringify(book.TextArray));
        console.log('PagesArray and TextArray have been stored in localStorage.');
  
        // Optionally, navigate to the editing page
        // navigate('/edit'); // Uncomment if you have a route for editing
  
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };
    
  return (
    <div className="grid-container">
    
      {images.map((imageSrc, index) => (
        <div key={index} className="grid-item">
      
          <img src={imageSrc.imageUrl} alt={`Cover ${index}`} />
          <button onSubmit={goRead}>Read</button>
          <button onClick={() => goDelete(covers[index]._id)}>Delete</button>
          <button onClick={() =>goEdit(covers[index]._id)}>Edit</button>
           
        </div>
      ))}
    </div>
  );
}
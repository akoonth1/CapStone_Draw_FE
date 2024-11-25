
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function PageEditGrid() {
  const { bookId } = useParams(); // Extract the id from the URL
  const [book, setBook] = useState(null);
  const [pagesArray, setPagesArray] = useState([]);
  const [text, setText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function fetchBook() {
    try {
      const response = await fetch(`http://localhost:3000/books/book/${bookId}`);
      if (!response.ok) {
        throw new Error(`Error fetching book: ${response.status}`);
      }
      const data = await response.json();
      setBook(data);
      setText(data.TextArray || {}); // Ensure TextArray exists
      console.log('Fetched Book Data:', data);
      console.log('Fetched PagesArray:', data.PagesArray);

      const pages = data.PagesArray || []; // Ensure PagesArray exists

      // Fetch images after setting the pages
      fetchImages(pages, data.TextArray || {});
    } catch (error) {
      console.error('Fetch Book Error:', error);
      alert(`Failed to fetch book: ${error.message}`);
    }
  }

  async function fetchImages(pages, textData) {
    try {
      const imagePromises = pages.map(async (page) => {
        console.log(page);
        try {
          const response = await fetch(`http://localhost:3000/api/blob/${page}`);
          if (!response.ok) {
            throw new Error(`Error fetching image for page ID ${page}: ${response.status}`);
          }
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          console.log(textData[0][page]);
          console.log('Image URL:', imageUrl);
          return { id: page, imageUrl, text: textData[0][page] || 'No content available.' };
        } catch (error) {
          console.error(`Error fetching image for page ID ${page}:`, error);
          return { id: page, imageUrl: null, text: textData[page] || 'No content available.' };
        }
      });


      const pagesWithImages = await Promise.all(imagePromises);
      setPagesArray(pagesWithImages); // Update pagesArray to include image URLs
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  function handleEditPage(pageId) {
    // Navigate to the page edit route, e.g., /books/:bookId/pages/:pageId/edit
    navigate(`/books/${bookId}/pages/${pageId}/edit`);
  }

  function handleAddPage() {
    // Navigate to a route for adding a new page, e.g., /books/:bookId}/pages/new
    navigate(`/books/${bookId}/pages/new`);
  }

  return (
    <>
      {!book ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>{book.title}</h2>
          <Button variant="primary" onClick={handleAddPage} className="mb-3">
            Add New Page
          </Button>
          {/* Render PagesArray */}
          {pagesArray.length > 0 ? (
            <div className="pages-array-container">
              {pagesArray.map((page, index) => (
                <Card key={index} className="mb-5"style={{ width: '30em' }}>
                  {page.imageUrl && (
                    <Card.Img variant="top" src={page.imageUrl} alt={`Page ${index + 1}`} />
                  )}
                  <Card.Body>
                    <Card.Title>Page {index + 1}</Card.Title>
                    {/* Replace the below with actual page content */}
                    <Card.Text>{page.text || 'No content available.'}</Card.Text>
                    <Button variant="secondary" onClick={() => handleEditPage(page.id)}>
                      Edit Page
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <p>No pages available.</p>
          )}
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function PageEditGrid() {
  const { bookId } = useParams(); // Extract the id from the URL
  const [book, setBook] = useState(null);
  const [pagesArray, setPagesArray] = useState([]);
  const [text, setText] = useState({});
const [editingPageId, setEditingPageId] = useState(null);
const [editFormData, setEditFormData] = useState({
  text: '',
});
const [textArray, setTextArray] = useState({});

const [isEditingTitle, setIsEditingTitle] = useState(false);
const [editTitle, setEditTitle] = useState(book ? book.title : '');


  const navigate = useNavigate();

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function fetchBook() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/${bookId}`);
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
          const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${page}`);
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



function handleEditText() {
    setIsEditing(true);
  }

function handleEditPage(page) {
  setEditingPageId(page.id);
  setEditFormData({
    title: `Page ${pagesArray.indexOf(page) + 1}`, // Assuming title is "Page X"
    text: page.text,
  });
}

// function handleSavePage(pageId) {
//   const updatedPages = pagesArray.map((page) =>
//     page.id === pageId ? { ...page, text: editFormData.text } : page
//   );
//   setPagesArray(updatedPages);
//   setEditingPageId(null);
//   console.log('Updated Pages:', updatedPages);
//   console.log('Saved Page:', editFormData);
//   console.log('Saved Page ID:', pageId);
//   console.log('Book ID:', bookId);
//   console.log('Text Data:', text);
// }

async function handleSavePage(pageId) {
  // Update pagesArray state
  const updatedPages = pagesArray.map((page) =>
    page.id === pageId ? { ...page, text: editFormData.text } : page
  );
  setPagesArray(updatedPages);

  // Update textArray state
  const updatedTextArray = updatedPages.reduce((acc, page) => {
    acc[page.id] = page.text;
    return acc;
  }, {});
  setTextArray(updatedTextArray);
  // Send a PUT request to update TextArray on the server
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/${bookId}/textarray`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TextArray: updatedTextArray }),
    });

    if (!response.ok) {
      throw new Error(`Error updating TextArray: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating TextArray:', error);
    alert(`Failed to update TextArray: ${error.message}`);
  }

  setEditingPageId(null);
}

function handleCancelEdit() {
  setEditingPageId(null);
}

function handleInputChange(event) {
  const { name, value } = event.target;
  setEditFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}


function handleEditTitle() {
  setIsEditingTitle(true);
  setEditTitle(book.title);
}


function handleCancelEditTitle() {
  setIsEditingTitle(false);
  setEditTitle(book.title);
}

function handleTitleChange(event) {
  setEditTitle(event.target.value);
}






async function handleDeletePage(pageId) {
  const updatedPages = pagesArray.filter((page) => page.id !== pageId);
  setPagesArray(updatedPages);

  const updatedTextArray = updatedPages.reduce((acc, page) => {
    acc[page.id] = page.text;
    return acc;
  }, {});
  setTextArray(updatedTextArray);

  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/booklist/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PagesArray: updatedPages.map((page) => page.id),
        TextArray: updatedTextArray,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating book data: ${response.status}`);
    }

    console.log('Page successfully deleted and book data updated.');
  } catch (error) {
    console.error('Error deleting page:', error);
    alert(`Failed to delete page: ${error.message}`);
  }
}



async function handleSaveTitle() {
  // Step 1: Update the book state locally
  setBook((prevBook) => ({
    ...prevBook,
    title: editTitle,
  }));
  setIsEditingTitle(false);

  // Step 2: Send a PUT request to update the title on the server
  try {
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/${bookId}/title`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editTitle }),
    });

    if (!response.ok) {
      throw new Error(`Error updating title: ${response.status}`);
    }

    console.log('Title successfully updated on the server.');
  } catch (error) {
    console.error('Error updating title:', error);
    alert(`Failed to update title: ${error.message}`);

    
    setBook((prevBook) => ({
      ...prevBook,
      title: book.title, // Revert to the original title
    }));
  }
}

return (
  <>
    {!book ? (
      <div>Loading...</div>
    ) : (
      <div>
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={handleTitleChange}
              className="form-control mb-2"
            />
            <Button variant="primary" onClick={handleSaveTitle}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancelEditTitle}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <h2>{book.title}</h2>
            <Button variant="secondary" onClick={handleEditTitle}>
              Edit Title
            </Button>
          </>
        )}
        {pagesArray.length > 0 ? (
          <div className="pages-array-container">
            {pagesArray.map((page, index) => (
              <Card key={index} className="mb-5" style={{ width: '18rem' }}>
                {page.imageUrl && (
                  <Card.Img variant="top" src={page.imageUrl} alt={`Page ${index + 1}`} />
                )}
                <Card.Body>
                  {editingPageId === page.id ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                      />
                      <textarea
                        name="text"
                        value={editFormData.text}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                      />
                      <Button variant="primary" onClick={() => handleSavePage(page.id)}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Card.Title>{`Page ${index + 1}`}</Card.Title>
                      <Card.Text>{page.text || 'No content available.'}</Card.Text>
                      <Button variant="secondary" onClick={() => handleEditPage(page)}>
                        Edit Text
                      </Button>
                      <Button
                          variant="danger"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          Delete Page
                        </Button>
                    </>
                  )}
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
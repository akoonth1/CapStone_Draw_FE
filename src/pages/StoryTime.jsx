import { useState, useEffect, useContext } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import BookContext from '../Context/BookContext';

// import ExampleCarouselImage from 'components/ExampleCarouselImage';
//https://react-bootstrap.netlify.app/docs/components/carousel/

function ControlledCarousel() {
  const [index, setIndex] = useState(0);
  const [drawings, setDrawings] = useState([]);
  const [images, setImages] = useState([]);
  const { orderedIds } = useContext(BookContext);
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [bookText, setBookText] = useState({});


//   console.log(orderedIds);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

//    // Fetch the list of drawing IDs
//    useEffect(() => {
//     async function fetchDrawingIDs() {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blobslist`);
//         if (!response.ok) {
//           throw new Error(`Error fetching drawing IDs: ${response.status}`);
//         }
//         const data = await response.json();
//         setDrawings(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchDrawingIDs();
//   }, []);
//   console.log(drawings);


  // Fetch Book titles for selector
  useEffect(() => {
    // Fetch book titles from the API
    async function fetchBookTitles() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/booklist`);
        if (!response.ok) {
          throw new Error(`Error fetching book titles: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBookTitles();

  }, []);

// Fetch Pages for selected book
useEffect(() => {
    async function fetchPages() {
        try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/booklist/${selectedBookId}`);
        if (!response.ok) {
            throw new Error(`Error fetching pages for book ID ${selectedBookId}: ${response.status}`);
        }
        const data = await response.json();
        setDrawings(data[0].PagesArray);
        console.log(data[0]);
        setBookText(data[0].TextArray);
        console.log(data[0].TextArray);
        } catch (error) {
        console.error(error);
        }
    }
    if (selectedBookId) {
        fetchPages();
    }
}, [selectedBookId]);


// const getTextById = (id) => {
//   console.log(bookText);
//   console.log(bookText[0][id]);
//   console.log(id);
//   const textObj = bookText.find((item) => item.id === id);
//   console.log(textObj);
//   return textObj ? textObj.text : console.log('No text available.');
// };
const getTextById = (id) => {
  if (bookText && bookText[0][id]) {
    return bookText[0][id];
  } else {
    console.log('No text available for ID:', id);
    return 'No text available.';
  }
};


  // Fetch images for each drawing ID

  useEffect(() => {
    async function fetchImages() {
      try {
        const imagePromises = drawings.map(async (id) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${id}`);
            if (!response.ok) {
              throw new Error(`Error fetching image for ID ${id}: ${response.status}`);
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return { id, imageUrl };
          } catch (error) {
            console.error(error);
            return null; // Return null if there was an error fetching this image
          }
        });

        const imagesData = await Promise.all(imagePromises);
        // Filter out any null entries (failed fetches)
        const successfullyFetchedImages = imagesData.filter((image) => image !== null);
        setImages(successfullyFetchedImages);
      } catch (error) {
        console.error(error);
      }
    }

    if (drawings.length > 0) {
      fetchImages();
    }
  }, [drawings]);

  
  const handleSelectBook = (event) => {
    setSelectedBookId(event.target.value);
    console.log(selectedBookId);
    console.log(drawings);
  };



return images.length > 0 ? (
    <>

    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map(({ id, imageUrl }) => (
        <Carousel.Item key={id}>
          <img
            className="d-block w-100"
            src={imageUrl}
            alt={`Drawing ${id}`}
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />
          <Carousel.Caption>
            {/* <h3>Drawing ID: {id}</h3> */}
            <h3>{getTextById(id)}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
    </>
  ) : (
    <>
    <div>
    <label>Select a Book: </label>
    <select value={selectedBookId} onChange={handleSelectBook}>
      <option value="" disabled>
        -- Choose a Book --
      </option>
      {books.map((book) => (
        <option key={book._id} value={book._id}>
          {book.title}
        </option>
      ))}
    </select>
  </div>
    <p>Loading images...</p>
    </>
  );
}
export default ControlledCarousel;
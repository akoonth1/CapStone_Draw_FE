import { useState, useEffect} from 'react';
import Carousel from 'react-bootstrap/Carousel';



function BookCoverCarousel() {
    const [index, setIndex] = useState(0);
    const [covers, setCovers] = useState([]);
    const [images, setImages] = useState([]);

  

  
    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };

    useEffect(() => {
      // Fetch book titles from the API
      async function fetchCovers() {
        try {
          const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/booklistcovers`);
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
   // Example output
   // [{"_id":"673f5929a5b708247327f137","title":"book2","firstPageElement":"673ebc4628e3c5f25a250e02"},{"_id":"673f6aeb8dee31ac1ecdb600","title":"book3","firstPageElement":"673ebc0d28e3c5f25a250dfc"},{"_id":"673f6baf827a8b4705c2d938","title":"book4","firstPageElement":"673ebc0d28e3c5f25a250dfc"},{"_id":"673f7f2d827a8b4705c2d9d9","title":"book5","firstPageElement":"673ebc0d28e3c5f25a250dfc"},{"_id":"673f8566827a8b4705c2da65","title":"book6","firstPageElement":"673ebc0d28e3c5f25a250dfc"},{"_id":"673f88101ea53fc69aba1b29","title":"book7","firstPageElement":"673ebc0d28e3c5f25a250dfc"}]

  // console.log(covers[1]);
  
    // Fetch images for each drawing ID
  
    useEffect(() => {
      async function fetchImages() {
        try {
          const imagePromises = covers.map(async (cover) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${cover.firstPageElement}`);
              if (!response.ok) {
                throw new Error(`Error fetching image for ID ${cover.firstPageElement}: ${response.status}`);
              }
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              return { id: cover._id, title: cover.title, imageUrl };
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
    
      if (covers.length > 0) {
        fetchImages();
      }
    }, [covers]);
    

  // console.log(images);
  
  return images.length > 0 ? (
      <>
  
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {images.map(({ id, imageUrl,title }) => (
          <Carousel.Item key={id} style={{borderRadius: '8px'}}>
            <img
              className="d-block w-100"
              src={imageUrl}
              alt={`Cover ${title}`}
              style={{ maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }}
            />
            <Carousel.Caption>
              <h3>{title}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      </>
    ) : (
      <>

      <p>Loading images...</p>
      </>
    );
  }
  export default BookCoverCarousel;
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../assets/1ex.png';
import img2 from '../assets/2ex.png';
import img3 from '../assets/3ex.png';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
//https://react-bootstrap.netlify.app/docs/components/carousel/

function ControlledCarousel() {
  const [index, setIndex] = useState(0);
  const [drawings, setDrawings] = useState([]);
  const [images, setImages] = useState([]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

   // Fetch the list of drawing IDs
   useEffect(() => {
    async function fetchDrawingIDs() {
      try {
        const response = await fetch('http://localhost:3000/api/blobslist');
        if (!response.ok) {
          throw new Error(`Error fetching drawing IDs: ${response.status}`);
        }
        const data = await response.json();
        setDrawings(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDrawingIDs();
  }, []);

  // Fetch images for each drawing ID
  useEffect(() => {
    async function fetchImages() {
      try {
        const imagePromises = drawings.map(async (id) => {
          const response = await fetch(`http://localhost:3000/api/blob/${id}`);
          if (!response.ok) {
            throw new Error(`Error fetching image for ID ${id}: ${response.status}`);
          }
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          return { id, imageUrl };
        });
        const imagesData = await Promise.all(imagePromises);
        setImages(imagesData);
      } catch (error) {
        console.error(error);
      }
    }
    if (drawings.length > 0) {
      fetchImages();
    }
  }, [drawings]);

//   return (
//     <Carousel activeIndex={index} onSelect={handleSelect}>
//       <Carousel.Item style={{ color: 'darkgray' }}>
//         <img src={img1} alt="First slide" />
//         <Carousel.Caption>
//           <h3>First slide label</h3>
//           <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <img src={img2} alt="Second slide" />
//         <Carousel.Caption style={{ color: 'darkgray' }}>
//           <h3>Second slide label</h3>
//           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <img src={img3} alt="Third slide" />
//         <Carousel.Caption style={{ color: 'darkgray' }}>
//           <h3>Third slide label</h3>
//           <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//     </Carousel>
//   );
// }
return images.length > 0 ? (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map(({ id, imageUrl }) => (
        <Carousel.Item key={id}>
          <img
            className="d-block w-100"
            src={imageUrl}
            alt={`Drawing ${id}`}
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
          <Carousel.Caption>
            <h3>Drawing ID: {id}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <p>Loading images...</p>
  );
}
export default ControlledCarousel;
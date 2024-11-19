import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../assets/1ex.png';
import img2 from '../assets/2ex.png';
import img3 from '../assets/3ex.png';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
//https://react-bootstrap.netlify.app/docs/components/carousel/

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item style={{ color: 'darkgray' }}>
        <img src={img1} alt="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={img2} alt="Second slide" />
        <Carousel.Caption style={{ color: 'darkgray' }}>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={img3} alt="Third slide" />
        <Carousel.Caption style={{ color: 'darkgray' }}>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
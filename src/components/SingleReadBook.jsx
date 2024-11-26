// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";



// export default function SingleReadBook() {


//     const { id } = useParams();
//     const [bookData, setBookData] = useState(null);
//     const [imageData, setImageData] = useState(null);
//     const [textData, setTextData] = useState(null);

// useEffect(() => {
//     async function fetchPages() {
//         try {
//         const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/booklist/${selectedBookId}`);
//         if (!response.ok) {
//             throw new Error(`Error fetching pages for book ID ${selectedBookId}: ${response.status}`);
//         }
//         const data = await response.json();
//         setDrawings(data[0].PagesArray);
//         console.log(data[0]);
//         setBookText(data[0].TextArray);
//         console.log(data[0].TextArray);
//         } catch (error) {
//         console.error(error);
//         }
//     }
//     if (selectedBookId) {
//         fetchPages();
//     }
// }, [selectedBookId]);


// // const getTextById = (id) => {
// //   console.log(bookText);
// //   console.log(bookText[0][id]);
// //   console.log(id);
// //   const textObj = bookText.find((item) => item.id === id);
// //   console.log(textObj);
// //   return textObj ? textObj.text : console.log('No text available.');
// // };
// const getTextById = (id) => {
//   if (bookText && bookText[0][id]) {
//     return bookText[0][id];
//   } else {
//     console.log('No text available for ID:', id);
//     return 'No text available.';
//   }
// };

    
//     useEffect(() => {
//         async function fetchImages() {
//           try {
//             const imagePromises = drawings.map(async (id) => {
//               try {
//                 const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blob/${id}`);
//                 if (!response.ok) {
//                   throw new Error(`Error fetching image for ID ${id}: ${response.status}`);
//                 }
//                 const blob = await response.blob();
//                 const imageUrl = URL.createObjectURL(blob);
//                 return { id, imageUrl };
//               } catch (error) {
//                 console.error(error);
//                 return null; // Return null if there was an error fetching this image
//               }
//             });
    
//             const imagesData = await Promise.all(imagePromises);
//             // Filter out any null entries (failed fetches)
//             const successfullyFetchedImages = imagesData.filter((image) => image !== null);
//             setImages(successfullyFetchedImages);
//           } catch (error) {
//             console.error(error);
//           }
//         }
    
//         if (drawings.length > 0) {
//           fetchImages();
//         }
//       }, [drawings]);
    

// return (
//     <div>
//         <h1>Single Read Book</h1>
//     </div>
// )   


// }
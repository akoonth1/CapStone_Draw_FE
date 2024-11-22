import { useState } from 'react';
import './App.css';
import TheCanvas from './pages/the_canvas';
import ToolBar_Draw from './components/ToolBar_Draw';
import { StoryBoard } from './components/StoryBoard';
import ControlledCarousel from './pages/StoryTime';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/navbar';
import SearchPage from './pages/SearchPage';
import FindDrawing from './components/SingleImageLoader';
import WrappedCanvas from './pages/WrappedCanvas';
import { useParams } from 'react-router-dom';
import { BookProvider } from './components/BookContext';
import BookConstructor from './pages/BookCOnstructor';
import LandingPage from './pages/LandingPage';


console.log(import.meta.env.VITE_SOME_KEY) 
function App() {
    const {id} = useParams();
  return (
    <>
        <Navbar />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<ControlledCarousel />} />
        <Route
          path="/draw/:id?"
          element={<WrappedCanvas />}
        />
        <Route path="/storyboard" element={<StoryBoard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/findDrawing" element={<FindDrawing />} />
        <Route path="/book" element={<BookConstructor />} />

      </Routes>

  </>
  );
}

export default App;
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
import { BookProvider } from './Context/BookContext';
import BookConstructor from './pages/BookConstructor';
import LandingPage from './pages/LandingPage';
import UserPage from './pages/UserPage';
import PageGrid from './pages/PageEditGrid';
import ProtectedRoutes from './Protected_Route/ProtectedRouter';


console.log(import.meta.env.VITE_SOME_KEY) 
function App() {
    const {id} = useParams();
    // localStorage.clear();
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

        <Route path="/pageEditor/:bookId" element={<PageGrid />} />

        <Route element={<ProtectedRoutes />}>
        <Route path="/book" element={<BookConstructor />} />
        <Route path="/user" element={<UserPage />} />
        </Route>

      </Routes>

  </>
  );
}

export default App;
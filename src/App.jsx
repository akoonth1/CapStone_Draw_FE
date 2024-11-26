import { useState, useContext, useEffect } from 'react';
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
import AuthContext from './Context/auth_context';


console.log(import.meta.env.VITE_SOME_KEY) 
function App() {
    const {id} = useParams();
    // localStorage.clear();

   

    
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
      const userId = user?.id || user?.user?.id || id;
  
      if (userId) {
        getUser(userId);
      } else {
        console.log('User is not logged in or user data is not available.');
      }
    }, []);
  
  
    async function getUser(id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/users/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',

          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('User data:', data);
        setUser(data);
        
      } catch (error) {
        console.error('Get User error:', error);
        alert(`Get User failed: ${error.message}`);
      }
    }
  


  return (
    <>
        <Navbar />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/:id?" element={<ControlledCarousel />} />
        <Route
          path="/draw/:id?"
          element={<WrappedCanvas />}
        />
        <Route path="/storyboard" element={<StoryBoard />} />
        {/* <Route path="/search" element={<SearchPage />} /> */}
        <Route path="/findDrawing" element={<FindDrawing />} />

        <Route path="/pageEditor/:bookId" element={<PageGrid />} />

        <Route element={<ProtectedRoutes />}>
        <Route path="/book" element={<BookConstructor />} />
        <Route path="/user/:id?" element={<UserPage />} />
        </Route>

      </Routes>

  </>
  );
}

export default App;
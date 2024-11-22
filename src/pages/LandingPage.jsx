import backgroundImage from '../assets/backgroundimage.jpg'
// LandingPage.jsx

import React, { useState } from 'react';
import './LandingPage.css'; // Import the CSS file
import BookCoverCarousel from '../components/BookCover';


export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign-Up

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="landing-page">
     
      <div
        className="header-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="overlay">
          <div className="form-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" required />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <span onClick={handleToggle}>
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </div>
          
        </div>
        <BookCoverCarousel />
      </div>

      {/* Optional: Additional content below the header */}
      <div className="content-section">
        <h1>Welcome to Story Book</h1>
        <h4>Come and find your your story</h4>
      </div>
    </div>
  );
}
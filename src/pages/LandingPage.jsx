import backgroundImage from '../assets/backgroundimage.jpg'
// LandingPage.jsx

import React, { useState, useContext } from 'react';
import './LandingPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; 
import BookCoverCarousel from '../components/BookCover';
import AuthContext from '../Context/auth_context';  
import BookContext from '../Context/BookContext';

export default function LandingPage() {

  const { signUp, login } = useContext(AuthContext); // Destructure signUp and login from AuthContext
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign-Up
  //const { signUp, login } = useAuth(); // Destructure signUp and login from useAuth()
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      // Sign-Up Logic
      const name = e.target.username.value.trim();
    const password = e.target.password.value;
      const email = e.target.email.value.trim();

      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      await signUp(name, password, email);

      // Optionally check if sign-up was successful before navigating
      // navigate('/draw');

    } else {
      // Login Logic
      const email = e.target.email.value.trim();
      const password = e.target.password.value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      await login({ email, password });

      // Optionally check if login was successful before navigating
      navigate('/draw');
    }

    // Reset form fields after submission
    e.target.reset();
  };



  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!isLogin) {
  //     const name = e.target.username.value;
  //     const email = e.target.email.value;
  //     const password = e.target.password.value; 
      // async function signUp() {
      //   try {
      //     const response = await fetch('http://localhost:3000/users/user', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ name, password, email }),
      //     });
      //     const data = await response.json();

      //     if (!response.ok) {
      //       throw new Error(data.message);
      //     }
      //     // console.log('Sign Up:', data);
      //     else{
      //       alert('Sign Up Successful');
      //       navigate('/draw');

      //     }

      //   } catch (error) {
      //     console.error('Failed to sign up:', error);
      //     alert('Failed to sign up:', error);
      //   }
      // }
    //   signUp();
    // }

    // Handle form submission logic here
  // };

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
          <BookCoverCarousel className='Reposition'/>
        </div>
    
      </div>

      {/* Optional: Additional content below the header */}
      <div className="content-section">
        <h1>Welcome to Story Book</h1>
        <h4>Come and find your your story</h4>
      </div>
    </div>
  );
}
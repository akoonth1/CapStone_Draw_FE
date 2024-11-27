


import backgroundImage from '../assets/backgroundimage.jpg'
import React, { useState, useContext } from 'react';
import './frontpage.css';
import { useNavigate } from 'react-router-dom'; 
import BookCoverCarousel from '../components/BookCover';
import AuthContext from '../Context/auth_context';  
import BookContext from '../Context/BookContext';

export default function LandingPage() {

  const { signUp, login, user, logout } = useContext(AuthContext); // Destructure signUp and login from AuthContext
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
      const password2 = e.target.password2.value;


      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      if (password !== password2) {
        alert('Passwords do not match.');
        return;
      }

      await signUp(name, password, email);

   
      navigate('/draw');

    } else {
      // Login Logic
      const email = e.target.email.value.trim();
      const password = e.target.password.value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      await login({ email, password });

      // if login was successful navigating
      // navigate('/draw');
      alert('Login successful');
    }

    // Reset form fields after submission
    e.target.reset();
  };

// // console.log('User:', user.user.id);
console.log(import.meta.env.VITE_BE_URL +'1'); 
//${import.meta.env.VITE_BE_URL}
//${import.meta.env.VITE_BE_URL}

console.log(user)

  return (
    <div className="landing-page">
     
      <div
        className="header-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="overlay">
        {!user ? (
          <>
        <div className="form-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Show Username field only for Sign Up */}
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

          
{!isLogin && (
  <>
    <label htmlFor="password2">Confirm Password</label>
    <input
      type="password"
      id="password2"
      name="password2"
      required
    />
  </>
)}


        </div>
        
        <button type="submit" className="submit-button">

          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : 'Have an account?'}{' '}
        <span
          onClick={handleToggle}
          style={{ cursor: 'pointer', color: 'blue' }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
    </div>
     </>
  ) : (
              <div>
              <div className="welcome-container">
                <h2>Welcome back{user.user.name}!</h2> 
                <button
                  onClick={() => navigate('/user')}
                  className="dashboard-button"
                >
                  Go to Dashboard
                </button>
           
                <button
                  onClick={() => logout()
                    
                  }
                  className="logout-button"
                  

                >
                  Logout
                </button>
              </div>
              <br></br>
              </div>
            )}


          <BookCoverCarousel className='Reposition'/>
        </div>
    
      </div>


      <div className="content-section">
        <h1>Welcome to Story Book</h1>
        <h4>Come and find your your story</h4>
      </div>
    </div>
  );
}
// import backgroundImage from '../assets/backgroundimage.jpg'

// import React, { useState, useContext, useEffect } from 'react';
// import './LandingPage.css'; // Import the CSS file
// import { useNavigate } from 'react-router-dom'; 
// import BookCoverCarousel from '../components/BookCover';
// import AuthContext from '../Context/auth_context';  
// import BookContext from '../Context/BookContext';


// export default function LandingPage() {
//   const { user, setUser } = useContext(AuthContext); // Access user state from context
//   const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
//   const [userData, setUserData] = useState({});
//   const navigate = useNavigate();

//   // Handle toggling between Login and Sign Up
//   const handleToggle = () => {
//     setIsLogin(!isLogin);
//   };

//   // Handle form submission for Login and Sign Up
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
    
//     // Extract form data
//     const data = {
//       email: formData.get('email'),
//       password: formData.get('password'),
//     };

//     // Include username for Sign Up
//     if (!isLogin) {
//       data.username = formData.get('username');
//     }

//     // Determine API endpoint based on form type
//     const endpoint = isLogin ? `${import.meta.env.VITE_BE_URL}/api/auth/user` : `${import.meta.env.VITE_BE_URL}/users/user`;
//     console.log(endpoint)

//     try {
//       console.log(endpoint)
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         // Handle HTTP errors
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Authentication failed');
//       }

//       const result = await response.json();
      
//       // Assuming the API returns user data upon successful authentication
//       setUser(result.user); // Update user state in context

//       // Redirect to Dashboard or desired page
//       navigate('/user');
//     } catch (error) {
//       console.error('Authentication Error:', error);
//       alert(`Authentication Error: ${error.message}`);
//     }
//   };


//   async function getUser(id) {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BE_URL}/users/user/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Include authentication headers if necessary
//           // 'Authorization': `Bearer ${yourAuthToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setUserData(data);
//     } catch (error) {
//       console.error('Get User error:', error);
//       alert(`Get User failed: ${error.message}`);
//     }
//   }

// useEffect(() => {
// if (user) {
//     getUser(user.user.id);
//     console.log('User:', user.user.id);
//     console.log('User:', user.user.name);
//     console.log(userData.name)
//   }

// }, [user]);

// // console.log('User:', user.user.id);
// console.log(import.meta.env.VITE_BE_URL +'1'); 

// // `${import.meta.env.VITE_BE_URL}

//   return (
//     <div className="landing-page">
//       <div
//         className="header-section"
//         style={{ backgroundImage: `url(${backgroundImage})` }} // Ensure backgroundImage is defined
//       >
//         <div className="overlay">
//           <div className="form-container">
//             {/* Conditional Rendering Based on User Authentication */}
//             {!user ? (
//               <>
//                 <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
//                 <form onSubmit={handleSubmit}>
//                   {/* Show Username field only for Sign Up */}
//                   {!isLogin && (
//                     <div className="form-group">
//                       <label htmlFor="username">Username</label>
//                       <input type="text" id="username" name="username" required />
//                     </div>
//                   )}
//                   <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input type="email" id="email" name="email" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                       type="password"
//                       id="password"
//                       name="password"
//                       required
//                     />
//                   </div>
//                   <button type="submit" className="submit-button">
//                     {isLogin ? 'Login' : 'Sign Up'}
//                   </button>
//                 </form>
//                 <p className="toggle-text">
//                   {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//                   <span
//                     onClick={handleToggle}
//                     style={{ cursor: 'pointer', color: 'blue' }}
//                   >
//                     {isLogin ? 'Sign Up' : 'Login'}
//                   </span>
//                 </p>
//               </>
//             ) : (
//               <div className="welcome-container">
//                 <h2>Welcome, {userData.name}!</h2> {/* Adjust based on your user data structure */}
//                 <button
//                   onClick={() => navigate('/user')}
//                   className="dashboard-button"
//                 >
//                   Go to Dashboard
//                 </button>
           
//                 <button
//                   onClick={() => setUser(null)}
//                   className="logout-button"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import backgroundImage from '../assets/backgroundimage.jpg'
// LandingPage.jsx

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

      // Optionally check if sign-up was successful before navigating
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
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
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

      {/* Optional: Additional content below the header */}
      <div className="content-section">
        <h1>Welcome to Story Book</h1>
        <h4>Come and find your your story</h4>
      </div>
    </div>
  );
}
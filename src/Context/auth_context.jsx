
import React, { createContext, useState, useEffect,  useMemo } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useCookies } from 'react-cookie';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around parts of the app that need authentication
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // Load user from cookie when AuthProvider mounts
  useEffect(() => {
    if (cookies.token) {
      try {
        const decodedUser = jwtDecode(cookies.token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token:', error);
        removeCookie('token', { path: '/' });
      }
    }
  }, [cookies.token, removeCookie]);

  // **Add the signUp function here**
  const signUp = async (name, password, email) => {
    try {
      console.log(name, email, password);
      console.log(JSON.stringify({ name, password, email }));
      console.log(JSON.stringify({ name,  email, password }));
      const response = await fetch('http://localhost:3000/users/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password, email }),
      });
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign Up failed');
      }

      // Optionally, automatically log the user in after sign-up
      // Set the token in cookies
      setCookie('token', data.token, { path: '/' });

      // Decode the JWT to get user information and set it in state
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);
    } catch (error) {
      console.error('Sign Up error:', error);
      alert(`Sign Up failed: ${error.message}`);
    }
  };

  // Existing login function
  const login = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set the token in cookies
      setCookie('token', data.token, { path: '/' });

      // Decode the JWT to get user information and set it in state
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);
      console.log(decodedUser);
      console.log(user)
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    removeCookie('token', { path: '/' });
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
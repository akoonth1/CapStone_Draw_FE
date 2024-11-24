import {useContext}from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';



import AuthContext from '../Context/auth_context'; // Adjust the import path as needed


export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/landing');
  }
    return (
  
        <nav>
          <ul>
            <li><Link to="/landing">Landing Page</Link></li>
            <li><Link to="/">Story Time</Link></li>
            <li><Link to="/draw">Draw</Link></li>
            {/* <li><Link to="/storyboard">Storyboard</Link></li> */}
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/findDrawing">Find Drawing</Link></li>              
            <li><Link to="/book">Book</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>

          </ul>
        </nav>
    );
    }
    
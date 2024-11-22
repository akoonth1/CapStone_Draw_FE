import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';



export default function Navbar() {
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
          </ul>
        </nav>
    );
    }
    
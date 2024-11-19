import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';



export default function Navbar() {
    return (
  
        <nav>
          <ul>
            <li><Link to="/">Home (Carousel)</Link></li>
            <li><Link to="/draw">Draw</Link></li>
            <li><Link to="/storyboard">Storyboard</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </nav>
    );
    }
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BrowserRouter as Router } from 'react-router-dom';
import { BookProvider } from './components/BookContext';


createRoot(document.getElementById('root')).render(
 
  <StrictMode>
    <Router>
      <BookProvider>
        <App />
      </BookProvider>
    </Router>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BrowserRouter as Router } from 'react-router-dom';
import { BookProvider } from './Context/BookContext.jsx';
// import { TextProvider } from './components/TextContext';


createRoot(document.getElementById('root')).render(
 
  <StrictMode>
    <Router>
      <BookProvider>
        {/* <TextProvider> */}
        <App />
        {/* </TextProvider> */}
      </BookProvider>
    </Router>
  </StrictMode>,
)

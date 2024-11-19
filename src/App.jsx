import { useState } from 'react';
import './App.css';
import TheCanvas from './pages/the_canvas';
import ToolBar_Draw from './components/ToolBar_Draw';
import { StoryBoard } from './components/StoryBoard';
import ControlledCarousel from './pages/StoryTime';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/navbar';
import SearchPage from './pages/SearchPage';
function App() {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);

  return (
    <>
        <Navbar />
      <Routes>
        <Route path="/" element={<ControlledCarousel />} />
        <Route
          path="/draw"
          element={
            <div className="AppUI">
              <ToolBar_Draw
                onColorChange={setBrushColor}
                onSizeChange={setBrushSize}
                onOpacityChange={setBrushOpacity}
              />
              <TheCanvas
                height={800}
                width={1080}
                resolution={brushSize}
                brushColor={brushColor}
                brushOpacity={brushOpacity}
              />
            </div>
          }
        />
        <Route path="/storyboard" element={<StoryBoard />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
  </>
  );
}

export default App;
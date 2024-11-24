import React, { useState } from 'react';
import './ToolBar.css';

export default function ToolBar_Draw({ onColorChange, onSizeChange, onOpacityChange, onToolChange }) {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [selectedTool, setSelectedTool] = useState('brush'); // 'brush' or 'eraser'

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
    onColorChange(event.target.value);
  };
  const colors = ['red', 'yellow', 'green', 'blue', 'purple', 'white'];

  const handleSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setBrushSize(size);
    onSizeChange(size);
  };

  const handleOpacityChange = (event) => {
    const opacity = parseFloat(event.target.value);
    setBrushOpacity(opacity);
    onOpacityChange(opacity);
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    onToolChange(tool);
  };



  return (
    <div className="toolbar">
      <h4>ToolBar_Draw</h4>
      <label>Brush Size</label>
      <input
        type="range"
        min="1"
        max="100"
        value={brushSize}
        onChange={handleSizeChange}
      />
      <label>Brush Color</label>
      <input
        type="color"
        value={brushColor}
        onChange={handleColorChange}
      />
       {/* <div className="color-options">
        {colors.map((color) => (
          <div
            key={color}
            className={`circle ${brushColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color, cursor: 'pointer' }}
            onClick={handleColorChange}
          ></div>
        ))}
      </div> */}

    
      {/* Color Selection Circles */}
      <div className="color-options">
        {colors.map((color) => (
          <div
            key={color}
            className={`circle ${brushColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setBrushColor(color)} // Updated onClick handler
            role="button"
            aria-label={`Select ${color} color`}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setBrushColor(color);
              }
            }}
          ></div>
        ))}
      </div>


      <label>Brush Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={brushOpacity}
        onChange={handleOpacityChange}
      />

      <div className="tool-options">
        <button
          className={`tool-button ${selectedTool === 'brush' ? 'active' : ''}`}
          onClick={() => handleToolChange('brush')}
          aria-label="Select Brush Tool"
        >
          🖌️ Brush
        </button>
        <button
          className={`tool-button ${selectedTool === 'eraser' ? 'active' : ''}`}
          onClick={() => handleToolChange('eraser')}
          aria-label="Select Eraser Tool"
        >
          🩹 Eraser
        </button>

        {/* <button
          className={`tool-button ${selectedTool === 'eyedropper' ? 'active' : ''}`}
          onClick={() => handleToolChange('eyedropper')}
          aria-label="Select Eyedropper Tool"
        >
          🔍 Eyedropper
        </button> */}


      </div>


    </div>
  );
}
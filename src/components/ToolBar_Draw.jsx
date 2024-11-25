import React, { useState, useEffect } from 'react';
import './ToolBar.css';
import {ntc} from "color-namer"

export default function ToolBar_Draw({ onColorChange, onSizeChange, onOpacityChange, onToolChange }) {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [selectedTool, setSelectedTool] = useState('brush'); // 'brush' or 'eraser'
  const [colors, setColors] = useState([]);

  const selectedColor = brushColor;

  const handleColorChange = (event) => {
    setBrushColor(event.target.value);
    onColorChange(event.target.value);
  };
  
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
  useEffect(() => {
    // Initialize the color palette
    GetColorPalette();
  }, []);



  const handleColorSelection = (color) => {
    onColorChange(color); // Notify parent of color change
  };


async function GetColorPalette() {
  try {
    const response = await fetch('http://localhost:3000/color/color', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Raw data:', data);

    // Extract the result array
    const rgbArray = data.result;
 // Convert RGB arrays to HEX color strings
const colorHexStrings = rgbArray.map((rgb) => {
  const [r, g, b] = rgb;
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
});

console.log('Color HEX Strings:', colorHexStrings);

// Update the state with the HEX color strings
setColors(colorHexStrings);


  } catch (error) {
    console.error('Get Color Palette error:', error);
    alert(`Get Color Palette failed: ${error.message}`);
  }
}


// const colornames = Palette.map((color) => color.name);



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
      <div className="color-palette">
        {colors.map((color, index) => (
          <button
            key={index}
            style={{
              backgroundColor: color,
              border:
                color === selectedColor ? '2px solid #000' : '1px solid #ccc',
            }}
            onClick={() => handleColorSelection(color)}
            className="color-button"
          />
        ))}
      </div>
    </div>
  );
}
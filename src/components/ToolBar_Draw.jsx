import React, { useState } from 'react';
import './ToolBar.css';

export default function ToolBar_Draw({ onColorChange, onSizeChange, onOpacityChange }) {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);

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
      <label>Brush Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={brushOpacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
}
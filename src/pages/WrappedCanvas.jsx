
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TheCanvas from './the_canvas';
import ToolBar_Draw from '../components/ToolBar_Draw';
import './WrappedCanvas.css';

export default function WrappedCanvas() {
  const { id } = useParams(); // Extract the id from the URL
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [selectedTool, setSelectedTool] = useState('brush'); 

  useEffect(() => {
    if (id) {
      // Optionally, you can load additional data based on the id
      // For example, fetch brush settings from the server
      // Or ensure the canvas loads the correct image from localStorage
    }
  }, [id]);

  return (
    <>
    <div className='Wrapper'>
      <ToolBar_Draw
        onColorChange={setBrushColor}
        onSizeChange={setBrushSize}
        onOpacityChange={setBrushOpacity}
        onToolChange={setSelectedTool}
      />
      <TheCanvas
        id={id}
        height={800}
        width={1080}
        resolution={brushSize}
        brushColor={brushColor}
        brushOpacity={brushOpacity}
        tool={selectedTool}
      />
      </div>
    </>
  );
}
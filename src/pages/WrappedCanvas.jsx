
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TheCanvas from './the_canvas';
import ToolBar_Draw from '../components/Tool_bar/ToolBar_Draw';
import './WrappedCanvas.css';

export default function WrappedCanvas() {
  const { id } = useParams(); // Extract the id from the URL
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [selectedTool, setSelectedTool] = useState('brush'); 

  useEffect(() => {//What was I trying to do here?
    if (id) {
    
      // console.log('Canvas ID:', id);
    }
  }, [id]);


  const handleColorChange = (color) => {
    setBrushColor(color);
  };

  

  return (
    <>
    <div className='Wrapper'>
      <ToolBar_Draw
        onColorChange={handleColorChange}
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
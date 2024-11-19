import { useState } from 'react'
import './App.css'
import TheCanvas from './pages/the_canvas'
import ToolBar_Draw from './components/ToolBar_Draw'
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { StoryBoard } from './components/StoryBoard'
import { DndContext, closestCenter, useDroppable, DragOverlay, closestCorners, rectIntersection } from '@dnd-kit/core';


function App() {
    const [brushColor, setBrushColor] = useState('#000000')
    const [brushSize, setBrushSize] = useState(10)
    const [brushOpacity, setBrushOpacity] = useState(1);


    return (
        <>
            <div className='AppUI'>

                <ToolBar_Draw onColorChange={setBrushColor} onSizeChange={setBrushSize} onOpacityChange={setBrushOpacity} />
                <TheCanvas 
                height={800} 
                width={1080} 
                resolution={brushSize} 
                brushColor={brushColor}  
                brushOpacity={brushOpacity}
                />
                <StoryBoard />

            </div>
        </>
    )
}

export default App
import React, { useState } from 'react'
import "./ToolBar.css"

export default function ToolBar_Draw({ onColorChange }) {
    const [brushColor, setBrushColor] = useState('#000000')

    const handleColorChange = (event) => {
        setBrushColor(event.target.value)
        onColorChange(event.target.value)
    }

    return (
        <div className="toolbar">
            <h1>ToolBar_Draw</h1>
            <label>Brush Size</label>
            <input type="range" min="1" max="100" defaultValue="50"></input>
            <label>Brush Color</label>
            <input type="color" value={brushColor} onChange={handleColorChange}></input>
            <label>Brush Opacity</label>
            <input type="range" min="0" max="1" step="0.1" defaultValue="1"></input>
        </div>
    )
}
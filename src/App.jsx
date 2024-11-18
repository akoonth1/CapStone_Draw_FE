import { useState } from 'react'
import './App.css'
import TheCanvas from './pages/the_canvas'
import ToolBar_Draw from './components/ToolBar_Draw'

function App() {
    const [brushColor, setBrushColor] = useState('#000000')

    return (
        <>
            <div>
                <ToolBar_Draw onColorChange={setBrushColor} />
                <TheCanvas height={500} width={800} resolution={5} brushColor={brushColor} />
            </div>
        </>
    )
}

export default App
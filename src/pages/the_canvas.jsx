
import React, { useEffect, useRef } from 'react'
import './canvas.css'

function hexToRgba(hex, opacity) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r},${g},${b},${opacity})`;
  }
export default function TheCanvas({ width, height, resolution, brushColor, brushOpacity }) {
    const canvasRef = useRef(null)
    const isDrawing = useRef(false)
    const animationFrameId = useRef(null)
    const lastX = useRef(0);
    const lastY = useRef(0);


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        // Initialize the canvas
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)}, [width, height])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')


        const draw = (x, y) => {
            console.log(brushOpacity)
            const rgbaColor = hexToRgba(brushColor, brushOpacity);
            console.log(rgbaColor)
            context.strokeStyle = rgbaColor;
            const col = Math.floor(x / resolution) * resolution
            const row = Math.floor(y / resolution) * resolution
            // context.fillStyle = brushColor
            // context.fillRect(col, row, resolution, resolution)
            context.lineWidth =  resolution;
            context.strokeStyle = brushColor;
            context.lineCap = 'round';
            
      context.beginPath();
      context.moveTo(lastX.current, lastY.current);
      context.lineTo(x, y);
      context.stroke();

      lastX.current = x;
      lastY.current = y;
        }

        const handleMouseDown = (event) => {
            isDrawing.current = true
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            lastX.current = x;
            lastY.current = y;
            draw(x, y)
        }

        const handleMouseMove = (event) => {
            if (!isDrawing.current) return;
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
            animationFrameId.current = requestAnimationFrame(() => draw(x, y))
        }

        const handleMouseUp = () => {
            isDrawing.current = false
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
        }

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)
        canvas.addEventListener('mouseleave', handleMouseUp)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)
            canvas.removeEventListener('mouseleave', handleMouseUp)
        }
    }, [brushColor, resolution])
const handleSave = () => {
  const canvas = canvasRef.current;
  canvas.toBlob((blob) => {
    // Create a link and trigger a download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'canvas.png';
    link.click();
    console.log(blob)
  }, 'image/png');

};

    return (
        <div className="tocanvas">
            <canvas ref={canvasRef} width={width} height={height} />
            <button onClick={handleSave}>Save Canvas</button>
        </div>
    )
}
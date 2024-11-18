// import React, { useEffect, useRef } from 'react'

// function make2DArray(rows, cols) {
//     let arr = new Array(rows)
//     for (let i = 0; i < rows; i++) {
//         arr[i] = new Array(cols)
//         for (let j = 0; j < cols; j++) {
//             arr[i][j] = 0 // Initialize with 0
//         }
//     }
//     return arr
// }

// export default function TheCanvas({ width, height, resolution, brushColor }) {
//     const canvasRef = useRef(null)
//     const gridRef = useRef(null)
//     const isDrawing = useRef(false)

//     useEffect(() => {
//         const canvas = canvasRef.current
//         const context = canvas.getContext('2d')
//         const rows = Math.floor(height / resolution)
//         const cols = Math.floor(width / resolution)
//         const grid = make2DArray(rows, cols)
//         gridRef.current = grid

//         // Set canvas background to red
//         context.fillStyle = 'white'
//         context.fillRect(0, 0, canvas.width, canvas.height)

//         // Draw grid
//         context.strokeStyle = 'lightgray'
//         context.beginPath()
//         for (let x = 0; x <= canvas.width; x += resolution) {
//             context.moveTo(x, 0)
//             context.lineTo(x, canvas.height)
//         }
//         for (let y = 0; y <= canvas.height; y += resolution) {
//             context.moveTo(0, y)
//             context.lineTo(canvas.width, y)
//         }
//         context.stroke()
//     }, [width, height, resolution])

//     useEffect(() => {
//         const canvas = canvasRef.current
//         const context = canvas.getContext('2d')

//         const handleMouseDown = (event) => {
//             isDrawing.current = true
//             draw(event)
//         }

//         const handleMouseMove = (event) => {
//             if (isDrawing.current) {
//                 draw(event)
//             }
//         }

//         const handleMouseUp = () => {
//             isDrawing.current = false
//         }

//         const handleMouseLeave = () => {
//             isDrawing.current = false
//         }

//         const draw = (event) => {
//             const rect = canvas.getBoundingClientRect()
//             const x = event.clientX - rect.left
//             const y = event.clientY - rect.top
//             const col = Math.floor(x / resolution)
//             const row = Math.floor(y / resolution)
//             if (gridRef.current[row] && gridRef.current[row][col] === 0) {
//                 gridRef.current[row][col] = 1
//                 context.fillStyle = brushColor
//                 context.fillRect(col * resolution, row * resolution, resolution, resolution)
//             }
//         }

//         canvas.addEventListener('mousedown', handleMouseDown)
//         canvas.addEventListener('mousemove', handleMouseMove)
//         canvas.addEventListener('mouseup', handleMouseUp)
//         canvas.addEventListener('mouseleave', handleMouseLeave)

//         return () => {
//             canvas.removeEventListener('mousedown', handleMouseDown)
//             canvas.removeEventListener('mousemove', handleMouseMove)
//             canvas.removeEventListener('mouseup', handleMouseUp)
//             canvas.removeEventListener('mouseleave', handleMouseLeave)
//         }
//     }, [brushColor, resolution])

//     return (
//         <div>
//             <h1>The Canvas</h1>
//             <canvas ref={canvasRef} width={`${width}px`} height={`${height}px`} />
//         </div>
//     )
// }

import React, { useEffect, useRef } from 'react'

export default function TheCanvas({ width, height, resolution, brushColor }) {
    const canvasRef = useRef(null)
    const isDrawing = useRef(false)
    const animationFrameId = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        // Initialize the canvas
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)
    }, [width, height])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const draw = (x, y) => {
            const col = Math.floor(x / resolution) * resolution
            const row = Math.floor(y / resolution) * resolution
            context.fillStyle = brushColor
            context.fillRect(col, row, resolution, resolution)
        }

        const handleMouseDown = (event) => {
            isDrawing.current = true
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            draw(x, y)
        }

        const handleMouseMove = (event) => {
            if (!isDrawing.current) return
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

    return (
        <div>
            <canvas ref={canvasRef} width={width} height={height} />

        </div>
    )
}
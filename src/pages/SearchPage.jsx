import React from 'react'
import DisplayDrawing from '../components/BookDragNDrop/DisplayDrawing'
import FullList from '../components/FullList'
import BookDrager from '../components/BookDragNDrop/BookDrager'
import BookGrid from '../components/BookList/BookGrid'

export default function SearchPage() {
    const displayDrawingContainerStyle = {
        display: 'flex',
        justifyContent: 'space-around', 
        alignItems: 'center',    
        width: '100%',            
        maxWidth: '1200px',       
        marginTop: '20px',       
    };

    return (
        <div className='the_search_page'>
            {/* <h1>Search Page</h1> */}
            {/* <FullList /> */}
            <div style={displayDrawingContainerStyle}>
                <DisplayDrawing />
                {/* <BookDrager initialColumns={initialColumnsData} /> */}
            </div>
            {/* <BookGrid /> */}
        </div>
    );
}

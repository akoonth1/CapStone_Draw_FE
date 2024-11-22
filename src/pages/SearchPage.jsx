import React from 'react'
import DisplayDrawing from '../components/DisplayDrawing'
import FullList from '../components/FullList'
import BookDrager from '../components/BookDrager'
export default function SearchPage() {
    return (
        <div>
            <h1>Search Page</h1>
            {/* <FullList /> */}
            <DisplayDrawing />
            <BookDrager />
        </div>
    )
}
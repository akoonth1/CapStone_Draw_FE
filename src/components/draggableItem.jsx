import {useDraggable} from '@dnd-kit/core' 
import { motion } from 'framer-motion';


export default function DraggableItem({id, children}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useDraggable({
        id
    })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}
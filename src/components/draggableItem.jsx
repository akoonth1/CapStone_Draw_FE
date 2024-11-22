import {useDraggable} from '@dnd-kit/core' // Import useDraggable
import {CSS} from '@dnd-kit/utilities' // Import CSS      



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
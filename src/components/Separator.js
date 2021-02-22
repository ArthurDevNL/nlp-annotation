import React, {useEffect, useState} from 'react';

export default function Separator(props) {
    
    const [mouseDown, setMouseDown] = useState(false);

    function handleMouseMove(e) {
        // console.log('move', e);
        e.stopPropagation();
        if (mouseDown) {
            // console.log('and mouse down');
            props.setTreeHeight(e.clientY);
        }
    }

    useEffect(() => {
        // console.log(`mouseDown: ${mouseDown}`);
    })
    return (
        <div className="separator">
            <div className="separator__add" onClick={props.handleAdd}></div>
            <div className="separator__drag" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)} onMouseMove={handleMouseMove}></div>
        </div>
    );
}
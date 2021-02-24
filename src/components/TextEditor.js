import React, {useState} from "react";
export default function TextEditor(props) {
    const [id, setId] = useState('no1118')
    const [sentId, setSentId] = useState('n01118003')

    function handleTextChange(e) {
        console.log(e.target.value);
        props.onSentenceChange(e.target.value);
    }

    return(
        <div className="text-editor">
            <div className="separator">
                <div className="separator__add"></div>
                <div className="separator__drag"></div>
            </div>
            <div className="text-editor__body">
                <ul type="none">
                    <li className="text-editor__row"># newdoc id = {id}</li>
                    <li className="text-editor__row"># sent_id = {sentId}</li>
                    <li className="text-editor__row">
                        # text = <input className="text-editor__text-input" value={props.text} onChange={handleTextChange}></input>
                    </li>
                </ul>
            </div>
        </div>
    )
}
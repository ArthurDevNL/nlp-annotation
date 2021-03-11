export default function PlainTextEditor(props) {
    return (
        <div className="text-editor">
            <div className="separator">
                <div className="separator__add" onClick={props.addToken}></div>
                <div className="separator__drag"></div>
            </div>
            <textarea 
                onChange={props.onTextChanged}
                className="text-editor__textarea"
                value={props.text}></textarea>
        </div>
    );
}
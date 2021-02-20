export default function separator(props) {
    return (
        <div className="separator">
            <div className="separator__add" onClick={props.handleAdd}></div>
            <div className="separator__drag"></div>
        </div>
    );
}
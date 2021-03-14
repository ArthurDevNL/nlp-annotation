export default function PlainTextEditor(props) {

    function insertTab(e)
    {		
        var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
        var o = e.target;
        if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey)
        {
            var oS = o.scrollTop;
            if (o.setSelectionRange)
            {
                var sS = o.selectionStart;	
                var sE = o.selectionEnd;
                o.value = o.value.substring(0, sS) + "\t" + o.value.substr(sE);
                o.setSelectionRange(sS + 1, sS + 1);
                o.focus();
            }
            else if (o.createTextRange)
            {
                document.selection.createRange().text = "\t";
                e.returnValue = false;
            }
            o.scrollTop = oS;
            if (e.preventDefault)
            {
                e.preventDefault();
            }
            return false;
        }
        return true;
    }

    return (
        <div className="text-editor">
            <div className="separator">
                <div className="separator__add" onClick={props.addToken}></div>
                <div className="separator__drag"></div>
            </div>
            <textarea 
                onChange={props.onTextChanged}
                onKeyDown={insertTab}
                className="text-editor__textarea"
                value={props.text}></textarea>
        </div>
    );
}
import React, {useEffect, useState} from "react";
export default function TextEditor(props) {
    const [id, setId] = useState('no1118')
    const [sentId, setSentId] = useState('n01118003')

    function handleTextChange(e) {
        props.onSentenceChange(e.target.value);
    }

    useEffect(() => {
        console.log('updating id and/or sentId', id, sentId);
    }, [id, sentId])

    return(
        <div className="text-editor">
            <div className="separator">
                <div className="separator__add" onClick={props.addWord}></div>
                <div className="separator__drag"></div>
            </div>
            <div className="text-editor__body">
                <ul type="none">
                    <li className="text-editor__row">
                        newdoc id = <input className="text-editor__text-input" value={id} onChange={e => setId(e.target.value)}></input>
                    </li>
                    <li className="text-editor__row">
                        sent_id = <input className="text-editor__text-input" value={sentId} onChange={e => setSentId(e.target.value)}></input>
                    </li>
                    <li className="text-editor__row">
                        text = <input className="text-editor__text-input" value={props.text} onChange={handleTextChange}></input>
                    </li>
                </ul>
                <ol>
                    {props.words.map((connllu, index) => {
                        const { form, lemma, upos, xpos, feats, head, deprel, deps, misc} = connllu;
                        function write(field) {
                            return field ? field : '_';
                        }
                        return (<li key={index}>{form}	{lemma}	{write(upos)}	{write(xpos)}	{write(feats)}	{write(head)}	{write(deprel)}	{write(deps)}	{write(misc)}</li>);
                    })}
                </ol>
            </div>
        </div>
    )
}
import React from "react";

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.state = {
            id: 'no1118',
            sent_id: 'n01118003'
        }
    }

    handleTextChange(e) {
        console.log(e.target.value);
        this.props.onSentenceChange(e.target.value);
    }

    render() {
        return(
            <div className="text-editor">
                <div className="text-editor__body">
                    <ul type="none">
                        <li className="text-editor__row"># newdoc id = no1118</li>
                        <li className="text-editor__row"># sent_id = n01118003</li>
                        <li className="text-editor__row">
                            # text = <input className="text-editor__text-input" value={this.props.text} onChange={this.handleTextChange}></input>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
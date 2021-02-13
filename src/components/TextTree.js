import React from 'react';

class TextTree extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const label = this.props.selectedToken && this.props.selectedToken.label ? this.props.selectedToken.label : 'None';
        return(
            <div>
                Text Tree, selectedToken: {label}
            </div>
        )
    }
}

export default TextTree
import React from 'react';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectToken = this.selectToken.bind(this);
    }

    selectToken(e, token) {
        this.props.onTokenSelect(token);
    }

    render() {
        const tokenList = this.props.tokens.map(token => {
            return(
                <button className="token" key={token.id} onClick={e => this.selectToken(e, token)}>{token.label}</button>
            );
        });
        return (
            <div className="nav">
                {tokenList}
            </div>
        );
    }
}

export default NavigationBar;
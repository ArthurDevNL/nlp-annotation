import React from 'react';
import NavigationBar from './components/NavigationBar';
import TextTree from './components/TextTree';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleTokenSelect = this.handleTokenSelect.bind(this);
        this.state = {
            tokens: [
                {
                    label: 'ROOT',
                    id: '1'
                },
                {
                    label: 'SUBJECT',
                    id: '2'
                },
                {
                    label: 'DOBJ',
                    id: '3'
                },
            ],
            singleToken: ['1'], // which token don't need to pair with other // id
            selectedToken: null,
        }
    }

    componentDidMount() {
        this.setState({
            selectedToken: this.state.tokens[0]
        });
    }

    handleTokenSelect(token) {
        console.log('selected token', token);
        this.setState(
            { selectedToken: token}
        )
    }

    render() {
        const tokens = this.state.tokens;
        return (
            <div className="App">
                <NavigationBar 
                    tokens={tokens} 
                    selectedToken={this.state.selectedToken}
                    onTokenSelect={this.handleTokenSelect}
                />
    
                <TextTree 
                    selectedToken={this.state.selectedToken} 
                    // sentence="something about it make me wonder ."
                    sentence="Drop the mic ." 
                    singleToken={this.state.singleToken}
                />
    
                <div id="text-editor" className="text-editor">
                    Text Editor
                </div>
            </div>
        );
    }
}

export default App;

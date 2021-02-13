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
            selectedToken: null,
        }
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
                    onTokenSelect={this.handleTokenSelect} 
                />
    
                <TextTree selectedToken={this.state.selectedToken} />
    
                <div id="text-editor" className="text-editor">
                    Text Editor
                </div>
            </div>
        );
    }
}

export default App;

import React from 'react';
import NavigationBar from './components/NavigationBar';
import TextTree from './components/TextTree';
import TextEditor from './components/TextEditor';
import Separator from './components/Separator';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleTokenSelect = this.handleTokenSelect.bind(this);
        this.handleSentenceChange = this.handleSentenceChange.bind(this);
        this.onAddWord = this.onAddWord.bind(this);
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
            sentence: 'Drop the mic .'
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

    handleSentenceChange(_sentence) {
        this.setState({
            sentence: _sentence
        });
    }

    onAddWord() {
        console.log('add word');
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
                    sentence={this.state.sentence} 
                    singleToken={this.state.singleToken}
                />

                <Separator handleAdd={this.onAddWord}></Separator>

                <TextEditor text={this.state.sentence} onSentenceChange={this.handleSentenceChange}></TextEditor>
            </div>
        );
    }
}

export default App;

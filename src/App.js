import React from 'react';
import NavigationBar from './components/NavigationBar';
import TextTree from './components/TextTree';
import TextEditor from './components/TextEditor';
import SplitPane from 'react-split-pane';
import './css/split-pane.css'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleTokenSelect = this.handleTokenSelect.bind(this);
        this.handleSentenceChange = this.handleSentenceChange.bind(this);
        this.addWord = this.addWord.bind(this);
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
            sentence: 'Drop the mic .',
            words: [],
            treeHeight: window.innerHeight/1.6
        }
    }

    componentDidMount() {
        this.setState({
            selectedToken: this.state.tokens[0]
        });
        
        // console.log(this.state.sentence);
        this.setState({
            words: this.state.sentence.split(' '),
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
            sentence: _sentence,
            words: _sentence.split(' ')
        });
    }

    addWord(e, word) {
        this.setState(prevState => {
            let words = [...prevState.words];
            words.push(word);
            return {
                sentence: prevState.words.join(' '),
                words
            };
        })
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
                <SplitPane split="horizontal" defaultSize={this.state.treeHeight}>
                    <TextTree 
                        selectedToken={this.state.selectedToken} 
                        sentence={this.state.sentence}
                        words={this.state.words}
                        singleToken={this.state.singleToken}
                        height={this.state.treeHeight}
                        className="split-pane--top"
                    />
                    <TextEditor 
                        text={this.state.sentence} 
                        words={this.state.words}
                        onSentenceChange={this.handleSentenceChange} 
                        addWord={this.addWord}
                        className="split-pane--bottom">    
                    </TextEditor>
                </SplitPane>
            </div>
        );
    }
}

export default App;

import React from 'react';
import NavigationBar from './components/NavigationBar';
import TextTree from './components/TextTree';
import TextEditor from './components/TextEditor';
import SplitPane from 'react-split-pane';
import './css/split-pane.css'
import ConnllU from './components/ConnllU.ts';

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
        this.setWords(this.state.sentence);
    }

    setWords(sentence) {
        let words = sentence.trim().split(' ');
        words = words.map((word, index) => {
            return new ConnllU({id: index + 1, form: word});
        });
        this.setState({
            sentence,
            words
        });
    }

    handleTokenSelect(token) {
        console.log('selected token', token);
        this.setState(
            { selectedToken: token}
        )
    }

    handleSentenceChange(_sentence) {
        this.setWords(_sentence);
    }

    addWord(e, word) {
        word = word ? word : 'new';
        this.setState(prevState => {
            let words = [...prevState.words];
            words.push(new ConnllU({id: words.length, form: word}));
            const wordsText = words.map(word => word.form);
            return {
                sentence: wordsText.join(' '),
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

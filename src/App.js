import React from 'react';
import NavigationBar from './components/NavigationBar';
import TextTree from './components/TextTree';
import TextEditor from './components/TextEditor';
import SplitPane from 'react-split-pane';
import './css/split-pane.css'
import ConnllU from './components/ConnllU.ts';
import PlainTextEditor from './components/PlainTextEditor';

const color = {
    white: '#efefef',
    black: '#343434',
    grey: '#D2D2D2',
    red: '#c45d5c',
    green: '#00b050',
    blue: '#1d4c8c',
}

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
                    color: color.black, // default grey: #D2D2D2
                    fontColor: color.white, // default black: #343434
                    id: '1'
                },
                {
                    label: 'SUBJECT',
                    color: color.red,
                    fontColor: color.white,
                    id: '2'
                },
                {
                    label: 'DOBJ',
                    color: color.green,
                    fontColor: color.white,
                    id: '3'
                },
            ],
            singleToken: ['1'], // which token don't need to pair with other // id
            selectedToken: null,
            sentence: 'Drop the mic .',
            words: [],
            treeHeight: window.innerHeight/1.6,
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
                    <PlainTextEditor
                        sentence={this.state.sentence}
                        addWord={this.addWord}>
                    </PlainTextEditor>
                    {/*
                    <TextEditor 
                        text={this.state.sentence} 
                        words={this.state.words}
                        onSentenceChange={this.handleSentenceChange} 
                        addWord={this.addWord}
                        className="split-pane--bottom">    
                    </TextEditor>
                    */}
                </SplitPane>
            </div>
        );
    }
}

export default App;

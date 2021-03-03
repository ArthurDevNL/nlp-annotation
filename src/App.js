import React from 'react';
import NavigationBar from './components/NavigationBar';
import TreeEditor from './components/TreeEditor';
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
        this.handleRelationSelect = this.handleRelationSelect.bind(this);
        this.handleSentenceChange = this.handleSentenceChange.bind(this);
        this.addToken = this.addToken.bind(this);
        this.onResize = this.onResize.bind(this);
        this.state = {
            relations: [
                {
                    label: 'ROOT',
                    color: color.black, // default grey: #D2D2D2
                    fontColor: color.white, // default black: #343434
                    id: 0 // same with array index
                },
                {
                    label: 'SUBJECT',
                    color: color.red,
                    fontColor: color.white,
                    id: 1
                },
                {
                    label: 'DOBJ',
                    color: color.green,
                    fontColor: color.white,
                    id: 2
                },
            ],
            singleRelation: [0], // which token don't need to pair with other // id
            selectedRelation: null,
            sentence: 'Drop the mic . test test test',
            tokens: [],
            treeHeight: window.innerHeight/1.6,
        }
    }

    componentDidMount() {
        this.setState({
            selectedRelation: this.state.relations[0]
        });
        this.setTokens(this.state.sentence);
    }

    setTokens(sentence) {
        let tokens = sentence.trim().split(' ');
        tokens = tokens.map((word, index) => {
            return new ConnllU({id: index, form: word});
        });
        this.setState({
            sentence,
            tokens: tokens
        });
    }

    handleRelationSelect(relation) {
        this.setState({ selectedRelation: relation}
        )
    }

    handleSentenceChange(_sentence) {
        this.setTokens(_sentence);
    }

    onResize(size) {
        this.setState({treeHeight : size});
    }

    addToken(e, word) {
        word = word ? word : 'new';
        this.setState(prevState => {
            let tokens = [...prevState.tokens];
            tokens.push(new ConnllU({id: tokens.length, form: word}));
            const wordsText = tokens.map(token => token.form);
            return {
                sentence: wordsText.join(' '),
                tokens: tokens
            };
        })
    }

    render() {
        const relations = this.state.relations;
        return (
            <div className="App">
                <NavigationBar 
                    relations={relations} 
                    selectedRelation={this.state.selectedRelation}
                    onRelationSelect={this.handleRelationSelect}
                />
                <SplitPane split="horizontal" 
                    defaultSize={this.state.treeHeight}
                    onChange={(size) => this.onResize(size)}>
                    <TreeEditor
                        selectedRelation={this.state.selectedRelation} 
                        sentence={this.state.sentence}
                        tokens={this.state.tokens}
                        arcs={this.state.arcs}
                        singleRelation={this.state.singleRelation}
                        relations={this.state.relations}
                        height={this.state.treeHeight}
                        className="split-pane--top"
                    />
                    <PlainTextEditor
                        sentence={this.state.sentence}
                        addToken={this.addToken}>
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

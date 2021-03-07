import React from 'react';
import NavigationBar from './components/NavigationBar';
import TreeEditor from './components/TreeEditor';
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
    orange: '#e28743'
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleRelationSelect = this.handleRelationSelect.bind(this);
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
                    label: 'NSUBJ',
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
                {
                    label: 'PUNCT',
                    color: color.blue,
                    fontColor: color.white,
                    id: 3
                },
                {
                    label: 'DET',
                    color: color.orange,
                    fontColor: color.white,
                    id: 4
                },
            ],
            singleRelation: [0], // which token don't need to pair with other // id
            selectedRelation: null,
            tokens: [],
            treeHeight: window.innerHeight/1.6,
        }
    }

    componentDidMount() {
        this.setState({
            selectedRelation: this.state.relations[0]
        });
        this.setTokens();
    }

    setTokens() {
        this.setState({
            tokens: {
                1: new ConnllU({id: 1, form: "Drop", head: 0, deprel: "root" }),
                2: new ConnllU({id: 2, form: "the", head: 3, deprel: "det" }),
                3: new ConnllU({id: 3, form: "mic", head: 1, deprel: "dobj" }),
                4: new ConnllU({id: 4, form: ".", head: 1, deprel: "punct" })
            }
        });
    }

    handleRelationSelect(relation) {
        this.setState({ selectedRelation: relation})
    }

    onResize(size) {
        this.setState({treeHeight : size});
    }

    addToken(e, word) {
        // word = word ? word : 'new';
        // this.setState(prevState => {
        //     let tokens = [...prevState.tokens];
        //     tokens.push(new ConnllU({id: tokens.length, form: word}));
        //     const wordsText = tokens.map(token => token.form);
        //     return {
        //         sentence: wordsText.join(' '),
        //         tokens: tokens
        //     };
        // })
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
                </SplitPane>
            </div>
        );
    }
}

export default App;

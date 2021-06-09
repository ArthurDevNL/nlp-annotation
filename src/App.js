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
        this.onTokensUpdated = this.onTokensUpdated.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.state = {
            relations: [
                {
                    label: 'ROOT',
                    color: color.black, // default grey: #D2D2D2
                    fontColor: color.white, // default black: #343434
                    id: 0 // same with array index
                },
                {
                    label: 'RELATION',
                    color: color.red,
                    fontColor: color.white,
                    id: 1
                },
            ],
            colors: [
                {
                    label: 'ROOT',
                    color: color.black, // default grey: #D2D2D2
                    fontColor: color.white, // default black: #343434
                    id: 0 // same with array index
                },
                {
                    label: 'DOBJ',
                    color: color.green,
                    fontColor: color.white,
                    id: 2
                },
                {
                    label: 'IOBJ',
                    color: color.green,
                    fontColor: color.white,
                    id: 3
                },
                {
                    label: 'CSUBJ',
                    color: color.green,
                    fontColor: color.white,
                    id: 4
                },
                {
                    label: 'CCOMP',
                    color: color.green,
                    fontColor: color.white,
                    id: 5
                },
                {
                    label: 'XCOMP',
                    color: color.green,
                    fontColor: color.white,
                    id: 6
                },
                {
                    label: 'AUX',
                    color: color.green,
                    fontColor: color.white,
                    id: 7
                },
                {
                    label: 'ADVCL',
                    color: color.green,
                    fontColor: color.white,
                    id: 8
                },
                {
                    label: 'ADVMOD',
                    color: color.green,
                    fontColor: color.white,
                    id: 9
                },
                {
                    label: 'COP',
                    color: color.green,
                    fontColor: color.white,
                    id: 10
                },
                {
                    label: 'MARK',
                    color: color.green,
                    fontColor: color.white,
                    id: 11
                },
                {
                    label: 'NMOD',
                    color: color.green,
                    fontColor: color.white,
                    id: 12
                },
                {
                    label: 'APPOS',
                    color: color.green,
                    fontColor: color.white,
                    id: 13
                },
                {
                    label: 'NUMMOD',
                    color: color.green,
                    fontColor: color.white,
                    id: 14
                },
                {
                    label: 'ACL',
                    color: color.green,
                    fontColor: color.white,
                    id: 15
                },
                {
                    label: 'AMOD',
                    color: color.green,
                    fontColor: color.white,
                    id: 16
                },
                {
                    label: 'DET',
                    color: color.green,
                    fontColor: color.white,
                    id: 17
                },
                {
                    label: 'CASE',
                    color: color.green,
                    fontColor: color.white,
                    id: 18
                },
                {
                    label: 'CC',
                    color: color.green,
                    fontColor: color.white,
                    id: 19
                },
                {
                    label: 'CONJ',
                    color: color.green,
                    fontColor: color.white,
                    id: 20
                },
                {
                    label: 'PUNCT',
                    color: color.blue,
                    fontColor: color.white,
                    id: 21
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

    onTokensUpdated(tokens) {
        this.setState({
            tokens: tokens,
            text: this.tokensToText(tokens)
        });
    }

    tokensToText(tokens) {
        var text = "";
        Object.keys(tokens).forEach(tid => {
            var t = tokens[tid];
            text += t.toString() + "\n";
        });
        return text;
    }

    parseText(text) {
        var lines = text.split('\n');
        var tokens = {};
        lines.forEach((l, i) => {
            var hasError = false;
            var comps = l.split('\t');
            if (comps.length !== 10) {
                hasError = true;
                // console.log("Error on line ", i);
                // TODO: display error
            }
            var id = parseInt(comps[0]);
            if (tokens[id] !== undefined) {
                hasError = true;
                // console.log("Duplicate token for id ", id);
                // TODO: display error
            }

            if (hasError == false) {
                tokens[id] = new ConnllU({
                    id: id,
                    form: this.parseField(comps[1]),
                    lemma: this.parseField(comps[2]),
                    upos: this.parseField(comps[3]),
                    xpos: this.parseField(comps[4]),
                    feats: this.parseField(comps[5]),
                    head: parseInt(this.parseField(comps[6])),
                    deprel: this.parseField(comps[7]),
                    deps: this.parseField(comps[8]),
                    misc: this.parseField(comps[9]),
                });
            }
        });
        return tokens;
    }

    parseField(f) {
        if (f === "_") {
            return undefined;
        }
        return f;
    }

    setTokens() {
        var startTokens = {
            1: new ConnllU({id: 1, form: "The", lemma: "the", upos: "DET", xpos: "DT", head: 5, deprel: "det" }),
            2: new ConnllU({id: 2, form: "quick", lemma: "quick", upos: "ADJ", xpos: "JJ", feats: "Degree=pos", head: 5, deprel: "amod" }),
            3: new ConnllU({id: 3, form: "brown", lemma: "brown", upos: "ADJ", xpos: "JJ", feats: "Degree=pos", head: 5, deprel: "amod" }),
            4: new ConnllU({id: 4, form: "fox", lemma: "fox", upos: "NOUN", xpos: "NN", feats: "Number=sing", head: 5, deprel: "compound" }),
            5: new ConnllU({id: 5, form: "jumps", lemma: "jump", upos: "NOUN", xpos: "NNS", feats: "Number=plur", head: 0, deprel: "root" }),
            6: new ConnllU({id: 6, form: "over", lemma: "over", upos: "ADP", xpos: "IN", head: 5, deprel: "prep" }),
            7: new ConnllU({id: 7, form: "the", lemma: "the", upos: "DET", xpos: "DT", head: 9, deprel: "det" }),
            8: new ConnllU({id: 8, form: "lazy", lemma: "lazy", upos: "ADJ", xpos: "JJ", feats: "Degree=pos", head: 9, deprel: "amod" }),
            9: new ConnllU({id: 9, form: "dog", lemma: "dog", upos: "NOUN", xpos: "NN", feats: "Number=sing", head: 6, deprel: "pobj", misc: "SpaceAfter=No" }),
            10: new ConnllU({id: 10, form: ".", lemma: ".", upos: "PUNCT", xpos: ".", feats: "PunctType=peri", head: 5, deprel: "punct", misc: "SpaceAfter=No" })
        };
        this.setState({
            tokens: startTokens,
            text: this.tokensToText(startTokens)
        });
    }

    onTextChanged(event) {
        this.setState({
            text: event.target.value,
            tokens: this.parseText(event.target.value)
        });
    }

    handleRelationSelect(relation) {
        this.setState({ selectedRelation: relation})
    }

    onResize(size) {
        this.setState({treeHeight : size});
    }

    addToken(e, word) {
        var tokens = this.state.tokens;
        var maxId = Math.max.apply(Math, Object.keys(tokens).map(tid => parseInt(tid)));
        var newId = maxId + 1;
        tokens[newId] = new ConnllU({ id: maxId + 1, form: "new"});
        this.setState({
            tokens: tokens,
            text: this.tokensToText(tokens)
        });
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
                        colors={this.state.colors}
                        height={this.state.treeHeight}
                        onTokensUpdated={this.onTokensUpdated}
                        className="split-pane--top"
                    />
                    <PlainTextEditor
                        text={this.state.text}
                        onTextChanged={this.onTextChanged}
                        addToken={this.addToken}>
                    </PlainTextEditor>
                </SplitPane>
            </div>
        );
    }
}

export default App;

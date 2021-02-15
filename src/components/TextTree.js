import React from "react";
import Konva from "konva";
import { Stage, Layer, Group, Rect, Text, Circle, Line } from "react-konva";

class TextTree extends React.Component {
    constructor(props) {
        super(props);
        this.wordClick = this.wordClick.bind(this);
        this.myRef = React.createRef();
        console.log(this.myRef);

        this.state = {
            sentence: "Drop the mic .",
            // words: ["Drop", "the", "mic", "."],
            selected: [],
            hoveredToken: null,
        };
    }

    get words() {
        return this.state.sentence.split(' ');
    }

    wordClick(e, index) {
        // toggling
        if (this.state.selected.includes(index)) {
            const _index = this.state.selected.indexOf(index);
            if (_index > -1) {
                let words = [...this.state.selected];
                words.splice(_index, 1);
                this.setState({ selected: words });
            }
            return;
        }

        // set selected word
        if (!this.state.selected[0] || this.state.selected.length >= 2) {
            this.setState({
                selected: [index]
            })
        } else {
            this.setState({
                selected: [this.state.selected[0], index]
            })
            // proceed connect the line
        }
    }

    onMouseOver(e, index) {
        this.setState({
            hoveredToken: index,
        })
    }
    onMouseLeave() {
        this.setState({
            hoveredToken: null
        })
    }

    isHovered(index) {
        return index === this.state.hoveredToken;
    }

    render() {
        const label =
            this.props.selectedToken && this.props.selectedToken.label
                ? this.props.selectedToken.label
                : "None";
        return (
            <Stage width={window.innerWidth} height={window.innerHeight/2} >
                <Layer 
                    ref={this.myRef}
                    name="text-tree-canvas" 
                    align="center">
                    {this.words.map((word, index) => {
                        index += 1;
                        return (
                            <Group 
                                onClick={(e) => this.wordClick(e, index)}
                                draggable={true}
                                align="center"
                                
                                key={'group-' + index}>
                                <Rect
                                    key={'rect-' + index}
                                    x={index * 80}
                                    y={100} 
                                    width={word.length * 17}
                                    height={48}
                                    stroke={this.isHovered(index) || this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    strokeWidth={2}
                                    cornerRadius={10}
                                    onMouseOver={e => this.onMouseOver(e, index)}
                                    onMouseLeave={e => this.onMouseLeave(e, index)}
                                    fill={this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    align="center"
                                />
                                <Text 
                                    key={'text-' + index}
                                    x={index * 80}
                                    y={100} 
                                    height={48}
                                    verticalAlign="middle"
                                    text={word} 
                                    key={index} 
                                    fill="#343434"
                                    fontVariant="bold"
                                    padding={10}

                                    align="center"
                                    fontSize={18} />
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
        );
    }
}

export default TextTree;

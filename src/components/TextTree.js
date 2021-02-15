import React from "react";
import Konva from "konva";
import { Stage, Layer, Group, Rect, Text, Circle, Line } from "react-konva";

class TextTree extends React.Component {
    constructor(props) {
        super(props);
        this.wordClick = this.wordClick.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

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
            // update text editor -- event
            // reset selected
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

    componentDidUpdate() {
        // console.log('this.layerRef', this.layerRef);
        // console.log('this.groupRef', this.groupRef);

        // change the color of selected to white
        if (this.layerRef.current) {
            this.layerRef.current.children.forEach((group, index) => {
                if (this.state.selected.includes(index + 1)) {
                    group.children[1].fill("#ffffff");
                } else {
                    group.children[1].fill("#343434");
                }
            })
        }
    }

    render() {
        const label =
            this.props.selectedToken && this.props.selectedToken.label
                ? this.props.selectedToken.label
                : "None";
        let totalTreeLength = 0;
        totalTreeLength += window.innerWidth / 8;
        return (
            <Stage width={window.innerWidth} height={window.innerHeight/2} >
                <Layer 
                    ref={this.layerRef}
                    name="text-tree-canvas" 
                    align="center">
                    {this.words.map((word, index) => {
                        index += 1;
                        const rectLength = word.length === 1 ? word.length * 22 : word.length * 16.18;
                        const gutter = 20;
                        
                        const xPosition = totalTreeLength + gutter;
                        const yPosition = 100;
                        totalTreeLength += rectLength + gutter;

                        return (
                            <Group 
                                ref={this.groupRef}
                                onClick={(e) => this.wordClick(e, index)}
                                draggable={true}
                                align="center"
                                onMouseOver={e => this.onMouseOver(e, index)}
                                onMouseLeave={e => this.onMouseLeave(e, index)}
                                key={'group-' + index}>
                                <Rect
                                    key={'rect-' + index}
                                    x={xPosition}
                                    y={yPosition} 
                                    width={rectLength}
                                    height={48}
                                    stroke={this.isHovered(index) || this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    strokeWidth={2}
                                    cornerRadius={10}
                                    
                                    fill={this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    align="center"
                                />
                                <Text 
                                    key={'text-' + index}
                                    x={xPosition}
                                    y={yPosition}
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

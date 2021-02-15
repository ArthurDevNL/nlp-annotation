import React from "react";
import Konva from "konva";
import { Stage, Layer, Group, Rect, Text, Circle, Line, Arrow } from "react-konva";

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
            console.log('index from', this.state.selected[0]);
            console.log('index to', this.state.selected[1])
            const from = this.layerRef.current.children[this.state.selected[0] - 1];
            const to = this.layerRef.current.children[this.state.selected[1]- 1];

            this.createArc(from, to, {label: 'Root'});
            this.setState({
                selected: []
            });
        }
    }

    /**
     * Create arrow
     * @param {Group} from 
     * @param {Group} to
     * @param {Object} token // need its label only
     */
    createArc(from, to, token) {
        console.log('createArc', from.children[2]);
        let originalPoints = [...from.children[2].attrs.points];
        console.log('to.x()', to.children[2].attrs.x);
        originalPoints[4] = to.children[2].attrs.x;
        originalPoints[6] = to.children[2].attrs.x;
        // from.children[2].points(originalPoints);

        from.children[2].attrs.points[4] = to.children[2].attrs.x;
        from.children[2].attrs.points[6] = to.children[2].attrs.x;
        
        console.log(originalPoints);
        from.children[2].opacity(1);
        this.layerRef.current.batchDraw();
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
                    group.children[2].fill("#ffffff");
                } else {
                    group.children[2].fill("#343434");
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
                        const rectHeight = 48;
                        const gutter = 20;
                        
                        const xPosition = totalTreeLength + gutter;
                        const yPosition = 100;
                        totalTreeLength += rectLength + gutter;

                        return (
                            <Group 
                                ref={this.groupRef}
                                onClick={(e) => this.wordClick(e, index)}
                                draggable={false}
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
                                <Arrow
                                    x={xPosition}
                                    y={yPosition}
                                    points={[
                                        rectLength/2, rectHeight/(rectHeight * -1 / 2),
                                        rectLength/2, -50, 
                                        rectLength*1.5, -50, 
                                        rectLength*1.5, rectHeight/(rectHeight * -1 / 2)
                                    ]}
                                    tension={0.08}
                                    opacity="0"
                                    stroke="blue"/>
                                
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
        );
    }
}

export default TextTree;

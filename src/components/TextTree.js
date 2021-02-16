import React from "react";
import Konva from "konva";
import { Stage, Layer, Group, Rect, Text, Label, Arrow, Tag } from "react-konva";

class TextTree extends React.Component {
    constructor(props) {
        super(props);
        this.wordClick = this.wordClick.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

        this.state = {
            // sentence: "Drop the mic .",
            // words: ["Drop", "the", "mic", "."],
            selected: [],
            hoveredToken: null,
            arcs: [],
            config: {
                y: 200,
                arcHeight: -50,
            }
        };
    }

    get words() {
        return this.props.sentence.split(' ');
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
            const indexFrom = this.state.selected[0] - 1;
            const indexTo = this.state.selected[1] - 1;
            const from = this.layerRef.current.children[indexFrom];
            const to = this.layerRef.current.children[indexTo];

            console.log('from', from, 'x:', from.x(), 'y:', from.y(), 'width: ', from.children[0].width());
            console.log('to', to, 'x:', to.x(), 'y:', to.y(), 'width: ', to.children[0].width());

            // this.createArc(from, to, {label: 'Root'});
            this.setState(prevState => ({
                arcs: [...prevState.arcs, {
                    label: this.props.selectedToken.label,
                    from: {
                        x: from.x(),
                        width: from.children[0].width(),
                        xPoint: from.x() + (from.children[0].width() / 2)
                    },
                    to: {
                        x: to.x(),
                        width: to.children[0].width(),
                        xPoint: to.x() + (to.children[0].width() / 2)
                    }
                }],
                selected: []
            }));
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
                    group.children[1].fill("#ffffff");
                } else {
                    group.children[1].fill("#343434");
                }
            })
        }
    }

    render() {
        let totalTreeLength = 0;
        totalTreeLength += window.innerWidth / 8;
        return (
            <Stage width={window.innerWidth} height={window.innerHeight/1.5} >
                
                {/* Token Layer */}
                <Layer 
                    ref={this.layerRef}
                    name="word-layer" 
                    align="center">
                    {this.words.map((word, index) => {
                        index += 1;
                        const rectLength = word.length === 1 
                            ? word.length * 22 
                            : word.length >= 4 
                                ? word.length >= 8 
                                    ? word.length * 12.5// 15.18;
                                    : word.length * 15
                                : word.length * 20;

                        const rectHeight = 48;
                        const gutter = 20;
                        
                        const xPosition = totalTreeLength + gutter;
                        const yPosition = this.state.config.y;
                        totalTreeLength += rectLength + gutter;

                        return (
                            <Group 
                                ref={this.groupRef}
                                key={`word-${word}-${index}`}
                                name={word}
                                x={xPosition}
                                y={yPosition}
                                onClick={(e) => this.wordClick(e, index)}
                                draggable={false}
                                align="center"
                                onMouseOver={e => this.onMouseOver(e, index)}
                                onMouseLeave={e => this.onMouseLeave(e, index)}
                                key={'group-' + index}>
                                <Rect
                                    width={rectLength}
                                    height={rectHeight}
                                    stroke={this.isHovered(index) || this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    strokeWidth={2}
                                    cornerRadius={10}
                                    fill={this.state.selected.includes(index) ? '#c25e5e' : '#D2D2D2'}
                                    align="center" />
                                <Text 
                                    height={rectHeight}
                                    verticalAlign="middle"
                                    text={word} 
                                    fill="#343434"
                                    fontVariant="bold"
                                    padding={10}

                                    align="center"
                                    fontSize={18} />
                            </Group>
                        );
                    })}
                </Layer>


                {/* Arc Layer */}
                <Layer 
                    name="arc-layer" 
                    align="center">
                    {this.state.arcs.map((arc, index) => {
                        const yPosition = this.state.config.y;
                        const arcHeight = this.state.config.arcHeight + index * -15;
                        
                        const {xPoint: fromPoint} = arc.from;
                        const {xPoint: toPoint} = arc.to;
                        
                        const labelPosition = (toPoint - fromPoint);
                        // console.log('labelPosition', labelPosition)

                        return (
                            <Group
                                key={`arc-${arc.label}-${index}`}
                                x={0}
                                y={yPosition}>
                                <Arrow
                                    points={[
                                        fromPoint, 0,
                                        fromPoint, arcHeight, 
                                        toPoint, arcHeight, 
                                        toPoint, 0
                                    ]}
                                    tension={0.09}
                                    stroke="#D2D2D2" />
                                <Label
                                    x={labelPosition}
                                    y={arcHeight - 8}
                                    opacity={1}>
                                    <Tag 
                                        fill="#D2D2D2" 
                                        cornerRadius={5}/>
                                    <Text
                                        
                                        verticalAlign="middle"
                                        padding={2}    
                                        fontSize={10}
                                        fontStyle="bold"
                                        text={`${arc.label}`}/>
                                </Label>
                            </Group>
                        )})}
                </Layer>
            </Stage>
        );
    }
}

export default TextTree;

import React from "react";
import { Stage, Layer, Group, Rect, Text, Label, Arrow, Tag } from "react-konva";
import Placer from "./Placer";

class TextTree extends React.Component {
    constructor(props) {
        super(props);
        this.wordClick = this.wordClick.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

        this.state = {
            selected: [],
            hoveredToken: null,
            arcs: [],
            config: {
                y: 200,
                arcHeight: -50,
                arcHeightIncrement: -20,
            },
            pointCounter: {},
            placers: []
        };
    }

    get isSingleToken() {
        return this.props.singleToken.includes(this.props.selectedToken.id);
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

        this.createArc(index);
    }

    createArc(index) {
        // update pointCounter
        this.setState(prevState => {
            let pointCounter = Object.assign({}, prevState.pointCounter);
            pointCounter[index] = pointCounter[index] + 1 || 1;
            return { pointCounter };
        });

        // set selected word
        if (!this.state.selected[0] || this.state.selected.length >= 2) {
            this.setState({
                selected: [index]
            });

            // for single token (ROOT)
            if (this.isSingleToken) {
                this.setWord(0, 0);
            }
        } else {
            this.setState({
                selected: [this.state.selected[0], index]
            })
            this.setWord(0, 1);
        }
    }

    setWord(_indexFrom, _indexTo) {
        // proceed connect the line
        // update text editor -- event
        // reset selected
        const arcId = this.state.selected.join('');
        const indexFrom = this.state.selected[_indexFrom] - 1;
        const indexTo = this.state.selected[_indexTo] - 1;
        const from = this.layerRef.current.children[indexFrom];
        const to = this.layerRef.current.children[indexTo];
        const fromName = from.attrs.name;
        const toName = to.attrs.name;
        const isSingle = _indexFrom === _indexTo ? true : false
        const token = this.props.selectedToken.label;

        // console.log('from', from, 'x:', from.x(), 'y:', from.y(), 'width: ', from.children[0].width());
        // console.log('to', to, 'x:', to.x(), 'y:', to.y(), 'width: ', to.children[0].width());

        const width = from.children[0].width();
        const count = this.state.pointCounter[indexFrom] ? this.state.pointCounter[indexFrom] + 2 : 1;
        const fromPosition = from.x() + (width - (width /count) / 2);
        // const fromPosition = from.x() + (from.children[0].width() / 2);
        // console.log(width, count, fromPosition);

        this.state.placers[fromName].add({
            arcId,
            from: from.x(),
            to: to.x(),
            width: from.children[0].width(),
            distance: 0
        });

        if (!isSingle) {
           this.state.placers[toName].add({
                arcId,
                from: to.x(),
                to: from.x(),
                width: to.children[0].width(),
                distance: 0
           });
        }
            // console.log('get placement node: ', fromName, arcId, this.state.placers[fromName].placement(arcId));
            // console.log('get placement node: ', toName, arcId, this.state.placers[toName].placement(arcId));
        
        this.setState(prevState => {
            let arcs = [...prevState.arcs];
            
            // add new arc
            arcs.push({
                arcId,
                label: token,
                single: isSingle,
                heightPlacement: this.state.placers[fromName].getHeightPlacement(arcId),
                from: {
                    name: fromName,
                    xPoint: this.state.placers[fromName].getPlacement(arcId)
                },
                to: {
                    name: toName,
                    xPoint: this.state.placers[toName].getPlacement(arcId)
                }
            });
            arcs = arcs.map((arc, index) => {
                arc.from.xPoint = this.state.placers[arc.from.name].getPlacement(arc.arcId);
                arc.to.xPoint = this.state.placers[arc.to.name] ? this.state.placers[arc.to.name].getPlacement(arc.arcId) : 0;
                arc.heightPlacement = index;
                return arc;
            });
            return { 
                arcs,
                selected: []
            };
        });
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

    componentDidMount() {
        // setup Placers
        let arrObj = {}
        for (let word of this.words) {
            arrObj[word] = new Placer({name: word})
        }
        this.setState({
            placers: arrObj
        });
    }

    componentDidUpdate() {
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

        // update placer
        this.words.forEach(word => {
            if (!this.state.placers[word]) {
                this.setState(prevState => {
                    prevState.placers[word] = new Placer({name: word});
                    return { prevState };
                });
            }
            
        });
    }

    render() {
        let totalTreeLength = 0;
        totalTreeLength += window.innerWidth / 8;
        return (
            <Stage 
                width={window.innerWidth} 
                height={window.innerHeight/1.5} 
                draggable={true}>
                
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
                                onMouseLeave={e => this.onMouseLeave(e, index)}>
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
                        const arcHeight = this.state.config.arcHeight + arc.heightPlacement * this.state.config.arcHeightIncrement;
                        
                        const {xPoint: fromPoint} = arc.from;
                        const {xPoint: toPoint} = arc.to;

                        const labelPosition = (fromPoint + toPoint + (arc.label.length * -7.5)) / 2

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

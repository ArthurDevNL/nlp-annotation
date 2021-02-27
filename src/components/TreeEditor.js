import React from "react";
import { Stage, Layer, Group, Text, Label, Arrow, Tag } from "react-konva";
import Placer from "./Placer";

class TreeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.wordClick = this.wordClick.bind(this);
        this.createArc = this.createArc.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

        this.state = {
            selected: [],
            hoveredToken: null,
            hoveredArc: null,
            arcs: [],
            config: {
                y: 200,
                arcHeight: -50,
                arcHeightIncrement: -20,
                arcTension: 0,
            },
            placers: {}
        };
    }
    
    get isSingleToken() {
        return this.props.singleToken.includes(this.props.selectedToken.id);
    }

    get arcsWithOutgoing() {
        return this.state.arcs.filter(arc => {
            return arc.arcId.length > 1 ? arc.arcId[0] : false;
        }).map(arc => arc.arcId[0]);
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

        this.addSelected(index);
    }

    addSelected(index) {
        // set selected word
        if (!this.state.selected[0] || this.state.selected.length >= 2) {
            this.setState({
                selected: [index]
            });
            
            const { selected } = this.state;
            const selectedId = selected.join('');
            // for single token (ROOT)
            if (this.isSingleToken) {
                // check to have only 1 outgoing
                if (this.state.arcs.filter(arc => arc.arcId.length === 1) > -1 && !this.arcsWithOutgoing.includes(selectedId)) {
                    const indexFrom = this.state.selected[0] - 1;
                    const tokenId = this.props.selectedToken.id;
                    this.createArc(indexFrom, indexFrom, tokenId);
                } else {
                    this.setState({ selected: [] });
                }
            }
        } else {
            this.setState({
                selected: [this.state.selected[0], index]
            });
            
            const { selected } = this.state;
            const selectedId = selected.join('');
            // check to have only 1 outgoing`
            if (!this.arcsWithOutgoing.includes(selectedId[0])) {
                const indexFrom = this.state.selected[0] - 1;
                const indexTo = this.state.selected[1] - 1;
                const tokenId = this.props.selectedToken.id;
                this.createArc(indexFrom, indexTo, tokenId);
            } else {
                this.setState({ selected: [] });
            }
        }
    }

    createArc(indexFrom, indexTo, tokenId) {
        // console.log('createArc', indexFrom, indexTo, tokenId);
        // proceed connect the line
        // update text editor -- event
        // reset selected
        const arcId = this.state.selected.join('');
        const from = this.layerRef.current.children[indexFrom];
        const to = this.layerRef.current.children[indexTo];
        const fromName = from.attrs.name;
        const toName = to.attrs.name;
        const isSingle = indexFrom === indexTo ? true : false
        

        // console.log('from', from, 'x:', from.x(), 'y:', from.y(), 'width: ', from.children[0].width());
        // console.log('to', to, 'x:', to.x(), 'y:', to.y(), 'width: ', to.children[0].width());

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
                label: this.props.tokens[tokenId].label,
                single: isSingle,
                color: this.props.tokens[tokenId].color,
                fontColor: this.props.tokens[tokenId].fontColor,
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

    removeArc(index) {
        this.setState(prevState => {
            const newArcs = [...prevState.arcs];
            newArcs.splice(index, 1);
            return { arcs: newArcs };
        });
    }

    isHovered(index) {
        return index === this.state.hoveredToken;
    }

    componentDidMount() {
        let intervalId = setInterval(() => {
            // setup Placers
            if (this.props.words.length) {
                let arrObj = {}
                for (let word of this.props.words) {
                    arrObj[word.form] = new Placer({name: word.form})
                }
                this.setState({
                    placers: arrObj
                });    
                // console.log('setup placer', arrObj);
                clearInterval(intervalId);
            }
        }, 150);
    }

    componentDidUpdate(prevProps) {
        // re-create Placers
        if (this.props.words !== prevProps.words) { 
            let arrObj = {}
            for (let word of this.props.words) {
                arrObj[word.form] = new Placer({name: word.form});
            }
            // update
            this.props.words.forEach(word => {
                if (!this.state.placers[word.form]) {
                    this.setState(prevState => {
                        Object.keys(arrObj).forEach(_word => {
                            arrObj[_word] = prevState.placers[_word];
                        });
                        arrObj[word.form] = new Placer({name: word.form});
                        return { 
                            placers: arrObj,
                            // for now remove all arcs
                            // TODO: only remove arcs that word are removed
                            arcs: []
                        };
                    });
                }
            });
        }

        // change the color of selected to white
        if (this.layerRef.current) {
            this.layerRef.current.children.forEach((group, index) => {
                if (this.state.selected.includes(index + 1)) {
                    group.children[0].children[1].fill("#ffffff");
                } else {
                    group.children[0].children[1].fill("#343434");
                }
            })
        }
        
    }

    render() {
        let totalTreeLength = 0;
        totalTreeLength += window.innerWidth / 8;
        return (
            <Stage 
                width={window.innerWidth} 
                height={this.props.height} 
                draggable={true}>
                
                {/* Token Layer */}
                <Layer 
                    ref={this.layerRef}
                    name="word-layer" 
                    align="center">
                    {this.props.words.map((connllu, index) => {
                        const {form: word} = connllu;
                        index += 1;
                        let rectLength = 0;
                        if (word) {
                            rectLength = word.length === 1
                                ? word.length * 22 
                                : word.length >= 4 
                                    ? word.length >= 8 
                                        ? word.length * 12.5// 15.18;
                                        : word.length * 15
                                    : word.length * 20;
                        }
                        const rectHeight = 48;
                        const gutter = 15;
                        
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
                                onMouseOver={() => this.setState({ hoveredToken: index })}
                                onMouseLeave={() => this.setState({ hoveredToken: null })}>
                                <Label>
                                    <Tag
                                        width={rectLength}
                                        height={rectHeight}
                                        stroke={this.isHovered(index) || this.state.selected.includes(index) ? this.props.selectedToken.color : '#D2D2D2'}
                                        strokeWidth={2}
                                        cornerRadius={10}
                                        fill={this.state.selected.includes(index) ? this.props.selectedToken.color : '#D2D2D2'}
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
                                </Label>
                            </Group>
                        );
                    })}
                </Layer>


                {/* Arc Layer */}
                <Layer 
                    name="arc-layer" 
                    align="center">
                    {this.state.arcs.map((arc, index) => {
                        const {y, arcHeight, arcHeightIncrement, arcTension} = this.state.config;
                        const {color, fontColor, label} = arc;

                        const yPosition = y;
                        const arcHeightTotal = arcHeight + arc.heightPlacement * arcHeightIncrement;
                        
                        const {xPoint: fromPoint} = arc.from;
                        const {xPoint: toPoint} = arc.to;

                        const labelPosition = (fromPoint + toPoint + (arc.label.length * -7.5)) / 2

                        return (
                            <Group
                                key={`arc-${arc.label}-${index}`}
                                x={arcTension}
                                y={yPosition}>
                                <Arrow
                                    points={[
                                        fromPoint, 0,
                                        fromPoint, arcHeightTotal, 
                                        toPoint, arcHeightTotal, 
                                        toPoint, 0
                                    ]}
                                    fill={color}
                                    tension={0}
                                    stroke={color} />
                                <Label
                                    x={labelPosition}
                                    y={arcHeightTotal - 8}
                                    onClick={() => this.removeArc(index)}
                                    onMouseOver={() => this.setState({ hoveredArc: index })}
                                    onMouseLeave={() => this.setState({ hoveredArc: null })}
                                    opacity={1}>
                                    <Tag 
                                        fill={color} 
                                        cornerRadius={5}/>
                                    <Text
                                        verticalAlign="middle"
                                        fill={fontColor}
                                        padding={2}    
                                        fontSize={10}
                                        fontStyle="bold"
                                        text={`${label}`}/>
                                </Label>
                                {/* "x" icon */}
                                <Label
                                    x={labelPosition + (label.length * 6.8)}
                                    y={arcHeightTotal - 20}
                                    opacity={index === this.state.hoveredArc ? 1 : 0}>
                                    <Tag 
                                        fill={color} 
                                        cornerRadius={5}/>
                                    <Text
                                        verticalAlign="middle"
                                        fill={fontColor}
                                        padding={2}    
                                        fontSize={10}
                                        fontStyle="bold"
                                        text={`x`}/>
                                </Label>
                            </Group>
                        )})}
                </Layer>
            </Stage>
        );
    }
}

export default TreeEditor;

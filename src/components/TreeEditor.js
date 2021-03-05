import React from "react";
import { Stage, Layer, Group, Text, Label, Arrow, Tag } from "react-konva";
import Placer from "./Placer";

class TreeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.tokenClick = this.tokenClick.bind(this);
        this.createArc = this.createArc.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

        this.state = {
            selectedTokens: [],
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
    
    get isSingleRelation() {
        return this.props.singleRelation.includes(this.props.selectedRelation.id);
    }

    get arcsWithOutgoing() {
        return this.state.arcs.filter(arc => {
            return arc.arcId.length > 1 ? arc.arcId[0] : false;
        }).map(arc => arc.arcId[0]);
    }

    tokenClick(e, tokenId) {
        // toggling
        if (this.state.selectedTokens.includes(tokenId)) {
            const _index = this.state.selectedTokens.indexOf(tokenId);
            if (_index > -1) {
                let tokens = [...this.state.selectedTokens];
                tokens.splice(_index, 1);
                this.setState({ selectedTokens: tokens });
            }
            return;
        }

        this.addSelected(tokenId);
    }

    addSelected(tokenId) {
        // set selected word
        if (this.state.selectedTokens.length == 0 || this.state.selectedTokens.length >= 2) {
            this.setState({
                selectedTokens: [tokenId]
            });
            
            const { selectedTokens: selected } = this.state;
            const selectedId = selected.join('');

            // for single token (ROOT)
            if (this.isSingleRelation) {
                // check to have only 1 outgoing
                if (this.state.arcs.filter(arc => arc.arcId.length === 1) > -1) {
                    const indexFrom = this.state.selectedTokens[0];
                    const relationId = this.props.selectedRelation.id;
                    this.createArc(indexFrom, indexFrom, relationId);
                } else {
                    this.setState({ selectedTokens: [] });
                }
            }
        } else {
            this.setState({
                selectedTokens: [this.state.selectedTokens[0], tokenId]
            });
            const { selectedTokens: selected } = this.state;
            const selectedId = selected.join('');

            // check to have only 1 outgoing`
            if (!this.arcsWithOutgoing.includes(selectedId[0])) {
                const idFrom = this.state.selectedTokens[0];
                const idTo = this.state.selectedTokens[1];
                const relationId = this.props.selectedRelation.id;
                this.createArc(idFrom, idTo, relationId);
            } else {
                this.setState({ selectedTokens: [] });
            }
        }
    }

    createArc(idFrom, idTo, relationId) {
        // proceed connect the line
        // update text editor -- event
        // reset selected
        const arcId = this.state.selectedTokens.join('');
        const fromGroup = this.layerRef.current.children[idFrom];
        const toGroup = this.layerRef.current.children[idTo];
        const fromId = fromGroup.attrs.id;
        const toId = toGroup.attrs.id;
        const isSingle = idFrom === idTo ? true : false

        this.state.placers[fromId].add({
            arcId,
            from: fromGroup.x(),
            to: toGroup.x(),
            width: fromGroup.children[0].width(),
            distance: 0
        });

        if (!isSingle) {
           this.state.placers[toId].add({
                arcId,
                from: toGroup.x(),
                to: fromGroup.x(),
                width: toGroup.children[0].width(),
                distance: 0
           });
        }
        
        this.setState(prevState => {
            let arcs = [...prevState.arcs];

            // add new arc
            arcs.push({
                arcId,
                label: this.props.relations[relationId].label,
                single: isSingle,
                color: this.props.relations[relationId].color,
                fontColor: this.props.relations[relationId].fontColor,
                heightPlacement: this.state.placers[fromId].getHeightPlacement(arcId),
                from: {
                    id: fromId,
                    xPoint: this.state.placers[fromId].getPlacement(arcId)
                },
                to: {
                    id: toId,
                    xPoint: this.state.placers[toId].getPlacement(arcId)
                }
            });
            arcs = arcs.map((arc, index) => {
                arc.from.xPoint = this.state.placers[arc.from.id].getPlacement(arc.arcId);
                arc.to.xPoint = this.state.placers[arc.to.id] ? this.state.placers[arc.to.id].getPlacement(arc.arcId) : 0;
                arc.heightPlacement = index;
                return arc;
            });
            return { 
                arcs,
                selectedTokens: []
            };
        });
    }

    removeArc(id) {
        this.setState(prevState => {
            const newArcs = [...prevState.arcs];
            newArcs.splice(id, 1);
            return { arcs: newArcs };
        });
    }

    isHovered(id) {
        return id === this.state.hoveredToken;
    }

    componentDidMount() {
        let intervalId = setInterval(() => {
            // setup Placers
            if (this.props.tokens.length) {
                let arrObj = {}
                for (let token of this.props.tokens) {
                    arrObj[token.id] = new Placer({id: token.id})
                }
                this.setState({
                    placers: arrObj
                });    
                clearInterval(intervalId);
            }
        }, 150);
    }

    componentDidUpdate(prevProps) {
        // re-create Placers
        if (this.props.tokens !== prevProps.tokens) { 
            let arrObj = {}
            for (let token of this.props.tokens) {
                arrObj[token.id] = new Placer({id: token.id});
            }
            this.setState({ placers: arrObj }, () => {
                // update
                this.props.tokens.forEach(token => {
                    if (token.head != null) {
                        console.log(this.props.relations.map(r => r.label.toLowerCase()), token.deprel.toLowerCase());
                        let relations = this.props.relations.filter(r => r.label.toLowerCase() === token.deprel.toLowerCase())
                        console.log(token);
                        if (relations.length == 1) {
                            console.log("created arc");
                            let relationId = relations[0];
                            this.createArc(token.id, token.head, relationId);
                        }
                    }
                });
                this.setState({ selectedTokens: [] });
            });
        }

        // change the color of selected to white
        if (this.layerRef.current) {
            this.layerRef.current.children.forEach((group, id) => {
                if (this.state.selectedTokens.includes(id)) {
                    group.children[0].children[1].fill("#ffffff");
                } else {
                    group.children[0].children[1].fill("#343434");
                }
            })
        }   
    }

    render() {
        let totalTreeLength = 0;
        totalTreeLength += Math.round(window.innerWidth / 8);
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
                    {this.props.tokens.map((token, index) => {
                        const {form: form} = token;
                        let rectLength = 20;
                        var ctx = this.layerRef?.current?.canvas?.context;
                        if (form && ctx) {
                            rectLength = Math.round(ctx.measureText(form).width) * 2;
                        }
                        const rectHeight = 48;
                        const gutter = 30;

                        const xPosition = totalTreeLength;
                        const yPosition = this.state.config.y;
                        totalTreeLength += rectLength + gutter;

                        return (
                            <Group 
                                ref={this.groupRef}
                                key={`word-${form}-${token.id}`}
                                name={form}
                                id={token.id}
                                x={xPosition}
                                y={yPosition}
                                onClick={(e) => this.tokenClick(e, token.id)}
                                draggable={false}
                                align="center"
                                onMouseOver={() => this.setState({ hoveredToken: token.id })}
                                onMouseLeave={() => this.setState({ hoveredToken: null })}>
                                <Label>
                                    <Tag
                                        width={rectLength}
                                        height={rectHeight}
                                        stroke={this.isHovered(token.id) || this.state.selectedTokens.includes(token.id) ? this.props.selectedRelation.color : '#D2D2D2'}
                                        strokeWidth={2}
                                        cornerRadius={10}
                                        fill={this.state.selectedTokens.includes(token.id) ? this.props.selectedRelation.color : '#D2D2D2'}
                                        align="center" />
                                    <Text 
                                        height={rectHeight}
                                        verticalAlign="middle"
                                        text={form} 
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
                                {/* <Label
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
                                </Label> */}
                            </Group>
                        )})}
                </Layer>
            </Stage>
        );
    }
}

export default TreeEditor;

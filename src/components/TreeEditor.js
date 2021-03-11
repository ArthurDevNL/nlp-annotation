import React from "react";
import { Stage, Layer, Group, Text, Label, Arrow, Tag } from "react-konva";

class TreeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.tokenClick = this.tokenClick.bind(this)
        this.removeArc = this.removeArc.bind(this);
        
        // word group reference
        this.groupRef = React.createRef();
        this.layerRef = React.createRef();

        this.state = {
            selectedToken: undefined,
            hoveredToken: null,
            hoveredArc: null,
            config: {
                y: 200,
                arcHeight: -50,
                arcHeightIncrement: -20,
                arcTension: 0,
            }
        };
    }
    
    get isSingleRelation() {
        return this.props.singleRelation.includes(this.props.selectedRelation.id);
    }

    tokenClick(e, tokenId) {
        // set selected word
        if (this.isSingleRelation || this.state.selectedToken !== undefined) {
            const idFrom = this.isSingleRelation ? tokenId : this.state.selectedToken;
            const idTo = this.isSingleRelation ? 0 : tokenId;
            const relation = this.props.selectedRelation;
            
            let tokens = this.props.tokens;
            let fromToken = tokens[idFrom];
            fromToken.head = idTo;
            fromToken.deprel = relation.label;
            tokens[idFrom] = fromToken;

            this.setState({
                selectedToken: undefined,
                tokens: tokens
            });
        } else {
            this.setState({
                selectedToken: tokenId
            });
        }
    }

    removeArc(id) {
        var tokens = this.props.tokens;
        var t = tokens[id];
        t.head = undefined;
        t.deprel = undefined;
        tokens[id] = t;
        this.setState({tokens: tokens});
    }

    isHovered(id) {
        return id === this.state.hoveredToken;
    }

    componentDidMount() {
       // Probably nothing to do here anymore 
    }

    componentDidUpdate(prevProps) {
        // change the color of selected to white
        if (this.layerRef.current) {
            this.layerRef.current.children.forEach((group, id) => {
                if (this.state.selectedToken === id) {
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

        const arcIncrement = -20;
        var arcHeight = -50;
        let tokenArcs = {};
        Object.keys(this.props.tokens).forEach((tid) => {
            let t = this.props.tokens[tid];
            if (tokenArcs[tid] === undefined) {
                tokenArcs[tid] = [];
            }
            if (tokenArcs[t.head] === undefined) {
                tokenArcs[t.head] = [];
            }
            if (t.head !== undefined) {
                tokenArcs[t.head].push(tid);
                tokenArcs[tid].push(tid);
            }
        });

        const gutter = 35;
        let tokenPositions = {};
        Object.keys(this.props.tokens).forEach((tid) => {
            var token = this.props.tokens[tid];
            var ctx = this.layerRef?.current?.canvas?.context;
            let rectLength = 20;
            if (token.form && ctx) {
                ctx.font = "18px Arial";
                rectLength = Math.round(ctx.measureText(token.form).width) + 5;
            }

            tokenPositions[token.id] = {
                x: totalTreeLength,
                y: this.state.config.y,
                width: rectLength,
                height: 48
            }

            totalTreeLength += rectLength + gutter;
        });

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
                    {Object.keys(this.props.tokens).map((tid) => {
                        var token = this.props.tokens[tid];
                        const {x: x, y: y, width: width, height: height} = tokenPositions[token.id];
                        return (
                            <Group 
                                ref={this.groupRef}
                                key={`word-${token.form}-${token.id}`}
                                name={token.form}
                                id={token.id}
                                x={x}
                                y={y}
                                onClick={(e) => this.tokenClick(e, token.id)}
                                draggable={false}
                                align="center"
                                onMouseOver={() => this.setState({ hoveredToken: token.id })}
                                onMouseLeave={() => this.setState({ hoveredToken: null })}>
                                <Label>
                                    <Tag
                                        width={width}
                                        height={height}
                                        stroke={this.isHovered(token.id) || this.state.selectedToken === token.id ? this.props.selectedRelation.color : '#D2D2D2'}
                                        strokeWidth={2}
                                        cornerRadius={10}
                                        fill={this.state.selectedToken === token.id ? this.props.selectedRelation.color : '#D2D2D2'}
                                        align="center" />
                                    <Text 
                                        height={height}
                                        verticalAlign="middle"
                                        text={token.form} 
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
                    {Object.keys(this.props.tokens).map((tid) => {
                        const token = this.props.tokens[tid];
                        if (token.head === undefined) {
                            return null;
                        }
                        
                        const arcHeightTotal = arcHeight;
                        arcHeight += arcIncrement;
                        
                        var fromToken = tokenPositions[tid];
                        
                        var numRelations = tokenArcs[tid].length;
                        var fromIndex = tokenArcs[tid].indexOf(String(tid))+1;
                        var fromPoint = fromToken.x + (fromToken.width / numRelations) * fromIndex;

                        var toPoint = fromPoint;
                        if (token.head !== undefined && this.props.tokens[token.head] !== undefined) {
                            var toToken = tokenPositions[token.head];
                            var numRelations = tokenArcs[token.head].length;
                            var toIndex = tokenArcs[token.head].indexOf(String(token.id))+1;
                            toPoint = toToken.x + (toToken.width / numRelations) * (toIndex);
                        }

                        var relation = this.props.relations.filter((r) => r.label.toLowerCase() === token.deprel.toLowerCase())[0];
                        const labelPosition = (fromPoint + toPoint + (relation.label.length * -7.5)) / 2

                        var color = relation.color;
                        var fontColor = relation.fontColor;
                        return (
                            <Group
                                key={`arc-${tid}-${token.head}`}
                                x={0}
                                y={200}>
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
                                    onClick={() => this.removeArc(tid)}
                                    onMouseOver={() => this.setState({ hoveredArc: tid})}
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
                                        text={`${relation.label}`}/>
                                </Label>
                            </Group>
                        )})}
                    </Layer>
            </Stage>
        );
    }
}

export default TreeEditor;

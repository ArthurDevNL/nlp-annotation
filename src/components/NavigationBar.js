import React from 'react';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectRelation = this.selectRelation.bind(this);
    }

    selectRelation(e, token) {
        this.props.onRelationSelect(token);
    }

    render() {
        const relationsList = this.props.relations.map(relation => {
            return(
                <button className={"token" + (this.props.selectedRelation && this.props.selectedRelation.id === relation.id ? ' active' : '')} key={relation.id} onClick={e => this.selectRelation(e, relation)}>{relation.label}</button>
            );
        });
        return (
            <div className="nav">
                {relationsList}
            </div>
        );
    }
}

export default NavigationBar;
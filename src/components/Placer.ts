import React from 'react';

interface Point {
    arcId: string;
    from: number;
    to: number;
    width: number;
    distance: number;
    placement: number;
}

/**
 * Placer
 * determine place group of points in some width
 */
export default class Placer extends React.Component {

    list: Array<Point> = [];
    listObj: any = {};
    width: number = 0;
    name: string = '';

    constructor(props: any) {
        super(props);
        this.name = props.name;
    }

    add(point: Point) {
        point.distance = point.to - point.from;
        this.list.push(point);
        console.log(this.name, ': add', this.list);
        this.generateArcs();
    }

    generateArcs() {
        this.list = this.list.sort((a, b) => {
            return a.distance - b.distance
        }).map((point, index) => {
            point.placement = index;
            this.listObj[point.arcId] = point;
            return point;
        });
        console.log('generateArcs', this.listObj);
    }

    placement(arcId: number) {
        return this.listObj[arcId];
    }

}

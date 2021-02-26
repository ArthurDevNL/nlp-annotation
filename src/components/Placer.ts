interface Point {
    arcId: string;
    from: number;
    to: number;
    width: number;
    distance: number;
    placementOrder: number;
    placement: number; // coordinate
}

/**
 * Placer
 * determine place group of points in some width
 */
export default class Placer extends Object {

    list: Array<Point> = [];
    listObj: any = {};
    width: number = 0;
    name: string = '';

    constructor(props: any) {
        super(props);
        this.name = props.name;
    }

    add(point: Point) {
        this.width = point.width;
        point.distance = point.to - point.from;
        this.list.push(point);
        this.generateArcs();
        // console.log(this.name, ': add', this.list);
    }

    generateArcs() {
        this.list = this.list.sort((a, b) => {
            return b.distance - a.distance
        }).map((point, index) => {
            point.placementOrder = index;
            this.listObj[point.arcId] = point;
            return point;
        });
        // console.log('generateArcs', this.listObj);
    }

    getPlacement(arcId: number) {
        const order = this.listObj[arcId].placementOrder + 1;
        const startCoord = this.listObj[arcId].from;
        // console.log('at', this.width, this.countPoint, at);
        return startCoord + (((this.width/this.countPoint) * order)/2);
    }

    get countPoint() {
        return this.list.length;
    }

    getHeightPlacement(arcId: number) {
        return (this.countPoint - this.listObj[arcId].placementOrder) - 1;
    }

}

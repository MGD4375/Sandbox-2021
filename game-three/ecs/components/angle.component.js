import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Angle extends Component {
    static create(value) { return { value: value } }
    static WHOLE = 6.28318
    static HALF = 3.14159
    static QUARTER = 1.5708

    static EAST = 0
    static SOUTH_EAST = 0.7853
    static SOUTH = 1.5707
    static SOUTH_WEST = 2.3561
    static WEST = 3.141
    static NORTH_WEST = 3.9269
    static NORTH = 4.7123
    static NORTH_EAST = 5.4977

    add(value) { return (value + this.value) % (2 * Math.PI) }
}
Angle.schema = {
    //  Radians
    value: { type: Types.Number, default: 0 },
}
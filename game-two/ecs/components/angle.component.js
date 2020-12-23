import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Angle extends Component {
    static create(value) { return { value: value % 360 } }
    static HALF = 3.14159
    static QUARTER = 1.5708

    add(value) { return (value + this.value) % (2 * Math.PI) }
}
Angle.schema = {
    //  Radians
    value: { type: Types.Number, default: 0 },
}
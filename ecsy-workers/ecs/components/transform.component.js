import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Transform extends Component {
    static create(x, y) { return { x, y } }
}
Transform.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 }
}
import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Sprite extends Component {
    static create(file, name, scale) { return { file, name, scale } }
}
Sprite.schema = {
    file: { type: Types.String },
    name: { type: Types.String },
    scale: { type: Types.Number, default: 1 }
}
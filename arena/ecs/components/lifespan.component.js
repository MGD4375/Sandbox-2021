import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";
export default class LifeSpan extends Component {
    static create(max) { return { max } }
}

LifeSpan.schema = {
    current: { type: Types.Number, default: 0 },
    max: { type: Types.Number }
}
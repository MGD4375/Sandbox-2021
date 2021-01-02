import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Age extends Component {
    static create(value, max) { return { value, max } }
}
Age.schema = {
    value: { type: Types.Number, default: 0 },
    max: { type: Types.Number, default: 3000 }
}
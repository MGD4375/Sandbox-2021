import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";
export default class Health extends Component {
    static create(value, max) { return { value, max } }
}

Health.schema = {
    value: { type: Types.Number },
    max: { type: Types.Number },
}
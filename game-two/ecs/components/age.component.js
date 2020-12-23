import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Age extends Component {
    static create(value) { return { value } }
}
Age.schema = {
    value: { type: Types.Number, default: 0 }
}
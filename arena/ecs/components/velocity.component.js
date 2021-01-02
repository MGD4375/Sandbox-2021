import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Velocity extends Component {
    static create(value) { return { value } }

}
Velocity.schema = {
    value: { type: Types.Number, default: 0 }
}
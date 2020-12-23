import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Cargo extends Component {
    static create(value) { return { value } }


}
Cargo.schema = {
    value: { type: Types.Number, default: null }
}
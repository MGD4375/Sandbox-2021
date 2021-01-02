import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Energy extends Component {
    static create(value) { return { value } }


}
Energy.schema = {
    value: { type: Types.Number, default: 0 }
}
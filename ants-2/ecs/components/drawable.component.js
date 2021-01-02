import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Drawable extends Component {
    static create(radius) { return { radius } }
}
Drawable.schema = {
    radius: { type: Types.String }
}
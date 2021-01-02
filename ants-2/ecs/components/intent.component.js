import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

const SATURATION = 50;
const LIGHT = 50;

export default class Intent extends Component {
    static create(value) { return { value } }
    static EXPLORE = 'explore'
    static RETURN = 'return'
    static SETTLE = 'settle'
    static GOTO = 'go-to'
    static PATROL = 'patrol'
}



Intent.schema = {
    value: { type: Types.String, default: null }
}
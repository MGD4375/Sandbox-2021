import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class GlobalCooldown extends Component {
}
GlobalCooldown.schema = {
    lastEvent: { type: Types.Number, default: 0 },
    value: { type: Types.Number, default: 20 },
}
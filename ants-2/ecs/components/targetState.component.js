import { SystemStateComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";


export default class TargetState extends SystemStateComponent {
    static create(ref) { return { ref } }
}

TargetState.schema = {
    ref: { type: Types.Ref, default: null },
}
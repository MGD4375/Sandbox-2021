import { SystemStateComponent, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class ParentState extends SystemStateComponent {
    static create(ref) { return { ref } }
}

ParentState.schema = {
    ref: { type: Types.Ref }
}   
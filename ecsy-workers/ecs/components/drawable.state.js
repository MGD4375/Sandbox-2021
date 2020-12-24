import { Component, SystemStateComponent, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class DrawableState extends SystemStateComponent {
    static create(ref) { return { ref } }
}

DrawableState.schema = {
    ref: { type: Types.Ref }
}
import { SystemStateComponent, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export class Collisions extends TagComponent { }
export class CollisionsState extends SystemStateComponent { }
CollisionsState.schema = {
    value: { type: Types.Array, default: [] }
}
import { Component, SystemStateComponent, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export class Sense extends Component {
    static create(range) { return { range } }
}
Sense.schema = {
    range: { type: Types.Number, default: 120 }
}

export class SenseColliderState extends SystemStateComponent {
    static create(ref) { return { ref } }
    static collides(a, b) {
        const ab = a.getBounds()
        const bb = b.getBounds()
        return (ab.x + ab.width > bb.x &&
            ab.x < bb.x + bb.width &&
            ab.y + 1 + ab.height > bb.y &&
            ab.y + 1 < bb.y + bb.height)
    }

    collides(otherSprite) {
        return SenseColliderState.collides(this.ref, otherSprite)
    }
}
SenseColliderState.schema = {
    ref: { type: Types.Ref }
}

export class SensedState extends SystemStateComponent { }
SensedState.schema = {
    value: { type: Types.Array, default: [] }
}
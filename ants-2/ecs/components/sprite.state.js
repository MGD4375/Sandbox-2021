import { SystemStateComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class SpriteState extends SystemStateComponent {
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
        return SpriteState.collides(this.ref, otherSprite)
    }
}

SpriteState.schema = {
    ref: { type: Types.Ref }
}
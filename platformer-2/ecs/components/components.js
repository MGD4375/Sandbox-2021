import {
    Component,
    SystemStateComponent,
    TagComponent,
    Types
} from "../../node_modules/ecsy/build/ecsy.module.js";

export class ColliderState extends SystemStateComponent {
    static create(ref) {
        return {
            ref
        }
    }

    static collides(a, b) {
        const ab = a.getBounds()
        const bb = b.getBounds()
        return (ab.x + ab.width > bb.x &&
            ab.x < bb.x + bb.width &&
            ab.y + 1 + ab.height > bb.y &&
            ab.y + 1 < bb.y + bb.height)
    }

    collides(otherSprite) {
        return ColliderState.collides(this.ref, otherSprite)
    }
}
ColliderState.schema = {
    ref: {
        type: Types.Ref
    }
}

export class AIComponent extends TagComponent {}
export class MovementSpeed extends Component {
    static create(value) {
        return {
            value
        }
    }
}

MovementSpeed.schema = {
    value: {
        type: Types.Number,
        default: 1
    }
}

export class Facing extends Component {
    static create(value) {
        return {
            value
        }
    }
    static LEFT = 'left'
    static RIGHT = 'right'
}

Facing.schema = {
    value: {
        type: Types.String,
        default: Facing.RIGHT
    }
}

export class Parent extends Component {
    static create(ref) {
        return {
            ref
        }
    }
}

Parent.schema = {
    ref: {
        type: Types.Ref
    }
}

export class Age extends Component {
    static create(current, max) {
        return {
            current,
            max
        }
    }
}

Age.schema = {
    current: {
        type: Types.Number
    },
    max: {
        type: Types.Number
    }
}

export class Attack extends Component {
    static create(damage) {
        return {
            damage
        }
    }
}

Attack.schema = {
    damage: {
        type: Types.Number
    }
}

export class Health extends Component {
    static create(current, max) {
        return {
            current,
            max
        }
    }
}

Health.schema = {
    current: {
        type: Types.Number
    },
    max: {
        type: Types.Number
    }
}

export class Enemy extends TagComponent {

}
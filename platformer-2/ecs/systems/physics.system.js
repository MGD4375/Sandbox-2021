import {
    Component,
    System,
    Types
} from "../../node_modules/ecsy/build/ecsy.module.js"
import Quadtree from "../../quadtree.js"
import {
    ColliderState
} from "../components/components.js"
import resolveElastic from "./displacement.physics.js"

export class PhysicsBody extends Component {

    static create(x, y, width, height) {
        return {
            x,
            y,
            height,
            width
        }
    }

    getMidX() {
        return (this.width / 2) + this.x;
    }

    getMidY() {
        return (this.height / 2) + this.y;
    }
    getTop() {
        return this.y;
    }
    getLeft() {
        return this.x;
    }
    getRight() {
        return this.x + this.width;
    }
    getBottom() {
        return this.y + this.height;
    }
}
PhysicsBody.schema = {
    x: {
        type: Types.Number
    },
    y: {
        type: Types.Number
    },
    height: {
        type: Types.Number
    },
    width: {
        type: Types.Number
    },
    xAcceleration: {
        type: Types.Number,
        default: 0
    },
    yAcceleration: {
        type: Types.Number,
        default: 0
    },
    xVelocity: {
        type: Types.Number,
        default: 0
    },
    yVelocity: {
        type: Types.Number,
        default: 0
    },
    static: {
        type: Types.Boolean,
        default: false
    },
    restitution: {
        type: Types.Number,
        default: 0
    },
    collisions: {
        type: Types.Array,
        default: []
    }


}

export class PhysicsSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

        //  TODO: This should come from world, but it doesn't work for some reason
        const width = 480 * 10, //  This should actually not be based on world, but be based on the size of the tilemap.
            height = 270 * 10 //  Same as above

        this.quadTree = new Quadtree({
            x: 0,
            y: 0,
            width: width,
            height: height
        })

    }

    execute() {

        //  Re-index objects in space
        this.quadTree.clear()

        const map = this.queries.subjects.results.map(it => {
            const body = it.getMutableComponent(PhysicsBody)
            body.entity = it
            body.halfHeight = body.height / 2
            body.halfWidth = body.width / 2
            return body
        })



        map.forEach(aBody => {

            //  Gravity
            if (!aBody.static) {
                aBody.yAcceleration += .7
            }

            //  Positional Logic
            //  NEXT STEPS: What's a good terminal velocity?
            //  NEXT STEPS: Should terminal velocity be set on a per item basis?
            aBody.xVelocity = (aBody.xVelocity + aBody.xAcceleration).clamp(-5, 5)
            aBody.yVelocity = (aBody.yVelocity + aBody.yAcceleration).clamp(-13, 13)
            aBody.x += aBody.xVelocity
            aBody.y += aBody.yVelocity
        })

        map.forEach(it => {
            this.quadTree.insert(it);
        })

        //  Collision Detection
        //  We use a combination of the pixi sprites collider we set up, and quadtrees. It is almost certainly 
        map.forEach(aBody => {
            if (aBody.static) return
            aBody.collisions = this.quadTree
                .retrieve(aBody)
                .filter(bBody => {
                    if (aBody === bBody) return false
                    if (collides(aBody, bBody)) return true
                })
                .map(bBody => {
                    return {
                        //  TODO: Remove duplicated collision check
                        axis: collides(aBody, bBody),
                        body: bBody
                    }
                })
        })

        //  Collision Resolution
        map.forEach(aBody => {
            aBody.collisions.forEach(collision => {
                resolveElastic(aBody, collision.body)
            })
        })

    }
}
PhysicsSystem.queries = {
    subjects: {
        components: [PhysicsBody, ColliderState]
    }
}

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

function collides(aBody, bBody) {

    // Store the collider and collidee edges
    const l1 = aBody.getLeft();
    const t1 = aBody.getTop();
    const r1 = aBody.getRight();
    const b1 = aBody.getBottom();

    const l2 = bBody.getLeft();
    const t2 = bBody.getTop();
    const r2 = bBody.getRight();
    const b2 = bBody.getBottom();

    // If the any of the edges are beyond any of the
    // others, then we know that the box cannot be
    // colliding

    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }


    /// This is inefficient because it's repeated from displacement.physics.js
    // Find the mid points of the bBody and aBody
    var aMidX = aBody.getMidX();
    var aMidY = aBody.getMidY();
    var bMidX = bBody.getMidX();
    var bMidY = bBody.getMidY();

    // To find the side of entry calculate based on
    // the normalized sides

    //  N.B The original code here didn't make much sense to me.
    //  In order to normalize a value we divide it by it's magnitude, for example a length of 5, normalized to 1 would be 5/5.
    var dx = (bMidX - aMidX) / ((aBody.halfWidth + bBody.halfWidth) / 2);
    var dy = (bMidY - aMidY) / ((aBody.halfHeight + bBody.halfHeight) / 2);

    // Calculate the absolute change in x and y
    var absDX = Math.abs(dx);
    var absDY = Math.abs(dy);

    if (absDX > absDY) {
        if (dx < 0) return 'left'
        else return 'right'
    } else {
        if (dy < 0) return 'top'
        else return 'bottom'
    }
};
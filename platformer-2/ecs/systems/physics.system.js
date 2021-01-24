import {
    Component,
    System,
    Types
} from "../../node_modules/ecsy/build/ecsy.module.js"
import Quadtree from "../../quadtree.js"
import {
    ColliderState
} from "../components/components.js"

const STICKY_THRESHOLD = 0.004

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
    // Getters for the top, left, right, and bottom
    // of the rectangle
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


}

export class PhysicsSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

        //  TODO: This should come from world, but it doesn't work for some reason
        const width = 480 * 3,
            height = 270 * 3

        this.quadTree = new Quadtree({
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

        map.forEach(it => {
            this.quadTree.insert(it);
        })

        map.forEach(aBody => {

            if (!aBody.static) {
                //  Gravity
                aBody.yAcceleration = (aBody.yAcceleration + 1)
            }

            //  Positional Logic
            //  NEXT STEPS: What's a good terminal velocity?
            //  NEXT STEPS: Should terminal velocity be set on a per item basis?
            aBody.xVelocity = (aBody.xVelocity + aBody.xAcceleration).clamp(-5, 5)
            aBody.yVelocity = (aBody.yVelocity + aBody.yAcceleration).clamp(-10, 10)
            aBody.x += aBody.xVelocity
            aBody.y += aBody.yVelocity

            //  Collision Detection
            //  We use a combination of the pixi sprites collider we set up, and quadtrees. It is almost certainly 
            aBody.collisions = this.quadTree
                .retrieve(aBody)
                .filter(bBody => {
                    if (aBody === bBody) return false
                    if (collides(aBody, bBody)) return true
                })



        })

        //  Collision Resolution
        map.forEach(aIndexedEntity => {
            if (aIndexedEntity.static) return
            aIndexedEntity.collisions.forEach(bIndexedEntity => {
                resolveElastic(aIndexedEntity, bIndexedEntity)
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

function collides(collider, collidee) {

    // Store the collider and collidee edges
    var l1 = collider.getLeft();
    var t1 = collider.getTop();
    var r1 = collider.getRight();
    var b1 = collider.getBottom();

    var l2 = collidee.getLeft();
    var t2 = collidee.getTop();
    var r2 = collidee.getRight();
    var b2 = collidee.getBottom();

    // If the any of the edges are beyond any of the
    // others, then we know that the box cannot be
    // colliding
    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }

    // If the algorithm made it here, it had to collide
    return true;
};

function resolveElastic(aBody, bBody) {
    // Find the mid points of the entity and player
    var pMidX = aBody.getMidX();
    var pMidY = aBody.getMidY();
    var aMidX = bBody.getMidX();
    var aMidY = bBody.getMidY();

    // To find the side of entry calculate based on
    // the normalized sides
    var dx = (aMidX - pMidX) / bBody.halfWidth;
    var dy = (aMidY - pMidY) / bBody.halfHeight;

    // Calculate the absolute change in x and y
    var absDX = Math.abs(dx);
    var absDY = Math.abs(dy);

    // If the distance between the normalized x and y
    // position is less than a small threshold (.1 in this case)
    // then this object is approaching from a corner
    if (Math.abs(absDX - absDY) < .1) {

        // If the player is approaching from positive X
        if (dx < 0) {

            // Set the player x to the right side
            aBody.x = bBody.getRight();

            // If the player is approaching from negative X
        } else {

            // Set the player x to the left side
            aBody.x = bBody.getLeft() - aBody.width;
        }

        // If the player is approaching from positive Y
        if (dy < 0) {

            // Set the player y to the bottom
            aBody.y = bBody.getBottom();

            // If the player is approaching from negative Y
        } else {

            // Set the player y to the top
            aBody.y = bBody.getTop() - aBody.height;
        }

        // Randomly select a x/y direction to reflect velocity on
        if (Math.random() < .5) {

            // Reflect the velocity at a reduced rate
            aBody.xVelocity = -aBody.xVelocity * bBody.restitution;
            aBody.yVelocity /= 1.2


            // If the object's velocity is nearing 0, set it to 0
            // STICKY_THRESHOLD is set to .0004
            if (Math.abs(aBody.xVelocity) < STICKY_THRESHOLD) {
                aBody.xVelocity = 0;
            }
        } else {

            aBody.yVelocity = -aBody.yVelocity * bBody.restitution;
            aBody.yAcceleration /= 1.2

            if (Math.abs(aBody.yVelocity) < STICKY_THRESHOLD) {
                aBody.yVelocity = 0;

            }
        }

        // If the object is approaching from the sides
    } else if (absDX > absDY) {

        // If the player is approaching from positive X
        if (dx < 0) {
            aBody.x = bBody.getRight();

        } else {
            // If the player is approaching from negative X
            aBody.x = bBody.getLeft() - aBody.width;
        }

        // Velocity component
        aBody.xVelocity = -aBody.xVelocity * bBody.restitution;
        aBody.yVelocity /= 1.2


        if (Math.abs(aBody.xVelocity) < STICKY_THRESHOLD) {
            aBody.xVelocity = 0;

        }

        // If this collision is coming from the top or bottom more
    } else {

        // If the player is approaching from positive Y
        if (dy < 0) {
            aBody.y = bBody.getBottom();

        } else {
            // If the player is approaching from negative Y
            aBody.y = bBody.getTop() - aBody.height;
        }

        // Velocity component
        aBody.yVelocity = -aBody.yVelocity * bBody.restitution;
        aBody.xVelocity /= 1.2   //  This is supposed to be friction, not sure if it's a good execution though

        if (Math.abs(aBody.yVelocity) < STICKY_THRESHOLD) {
            aBody.yVelocity = 0;

        }
    }
};
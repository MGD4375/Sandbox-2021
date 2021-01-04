import { Component, Not, System, SystemStateComponent, Types, World } from "../../node_modules/ecsy/build/ecsy.module.js"
import { Collider, Transform } from "./render.system.js"

export class PhysicsBody extends Component {
    static create(isStatic) { return { isStatic } }
}
PhysicsBody.schema = {
    isStatic: { type: Types.Boolean }
}


export class PhysicsState extends SystemStateComponent {
    static create(ref) { return { ref } }
}
PhysicsState.schema = {
    ref: { type: Types.Ref }
}

export class PlatformerPhysicsSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.physics = Physics()

        var gravity = Physics.behavior('constant-acceleration', {
            acc: { x: 0, y: 0.001 } // this is the default
        });
        this.physics.add(gravity);

        this.physics.add(Physics.behavior('body-impulse-response'));
        this.physics.add(Physics.behavior('body-collision-detection'));
        this.physics.add(Physics.behavior('sweep-prune'));

    }

    execute(delta, time) {
        this.physics.step(time)

        this.queries.create.results.forEach(entity => {
            const transform = entity.getComponent(Transform)
            const collider = entity.getComponent(Collider)
            const physicsBody = entity.getComponent(PhysicsBody)

            const box = Physics.body('rectangle', {
                x: transform.x,
                y: transform.y,
                vx: 0,
                width: collider.width,
                height: collider.height,
                treatment: physicsBody.isStatic ? 'static' : 'dynamic',
                restitution: 1,
            })

            this.physics.add(box)

            entity.addComponent(PhysicsState, PhysicsState.create(box))

        })


        this.queries.update.results.forEach(entity => {
            const collider = entity.getComponent(Collider)
            const physicsState = entity.getComponent(PhysicsState).ref
            const transform = entity.getMutableComponent(Transform)

            transform.x = physicsState.state.pos.x
            transform.y = physicsState.state.pos.y


        })


        this.queries.delete.results.forEach(entity => {
            const physicsState = entity.getComponent(PhysicsState).ref
            // this.physics.destroyBody(physicsState);
            entity.removeComponent(PhysicsState)

        })





    }
}

PlatformerPhysicsSystem.queries = {
    create: { components: [PhysicsBody, Not(PhysicsState), Transform, Collider] },
    update: { components: [PhysicsBody, PhysicsState, Transform, Collider] },
    delete: { components: [Not(PhysicsBody), PhysicsState] },
}

function transformToPlanck(x, y) {
    //change Y origin point and direction
    y = (y - 1024) * -1;
    //convert pixels to meters (64px = 0.1m)
    y *= 0.0015625;
    x *= 0.0015625;
    returnPLANK.Vec2(x, y);
}
function planckToPixi(v) {
    //convert pixels to meters (64px = 0.1m)
    var retY = v.y * 640;
    var retX = v.x * 640;
    //change Y origin point and direction
    retY = (retY * -1) + 1024;
    return { x: retX, y: retY };
}
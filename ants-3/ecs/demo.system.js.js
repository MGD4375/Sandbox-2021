import {
    BodyState,
    PhysicsBody
} from "../engine/physics.system.js";
import {
    Render
} from "../engine/renderer.system.js";
import {
    Component,
    System,
    TagComponent,
    Types
} from "../node_modules/ecsy/build/ecsy.module.js";

export class Ant extends TagComponent {}
export class Pheramone extends TagComponent {}
export class Age extends Component {}
Age.schema = {
    value: {
        type: Types.Number,
        default: 0
    }
}

export default class DemoSystem extends System {
    constructor(world, attrs) {
        super(world, attrs);
        this.world = world
        this.count = 0

    }
    execute() {
        this.count++
        if (this.count < (800)) {
            this.world.createEntity()
                .addComponent(Ant)
                .addComponent(Age)
                .addComponent(Render)
                .addComponent(
                    PhysicsBody,
                    PhysicsBody.create({
                        shape: PhysicsBody.SHAPES.BOX,
                        type: PhysicsBody.TYPES.DYNAMIC,
                        height: 6,
                        width: 10,
                        x: 400,
                        y: 300,
                        angle: Math.random() * 360
                    })
                )
        }

        this.queries.agers.results.forEach(entity => {
            const age = entity.getMutableComponent(Age);
            age.value++
        })


        this.queries.pheramones.results.forEach(entity => {
            const age = entity.getComponent(Age);
            if (age.value > 720) {
                entity.remove()
            }

        })

        this.queries.subjects.results.forEach(entity => {
            const bodyState = entity.getComponent(BodyState);
            const age = entity.getComponent(Age);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            bodySpec.angle += (-1 + (Math.random() * 2)) * 0.5
            bodySpec.velocity = 1


            //  The problem with pheramones is there's many times more of them than ants. So the performance takes a massive dip.
            // if (age.value % 120 === 0) {
            //     const pheramoneE = this.world.createEntity()
            //         .addComponent(Pheramone)
            //         .addComponent(Age)
            //     pheramoneE.addComponent(
            //         PhysicsBody,
            //         PhysicsBody.create({
            //             shape: PhysicsBody.SHAPES.BOX,
            //             type: PhysicsBody.TYPES.STATIC,
            //             height: 48,
            //             width: 48,
            //             x: bodySpec.x,
            //             y: bodySpec.y,
            //             collisionGroup: -1 * pheramoneE.id
            //         })
            //     )
            // }
        })
    }
}

DemoSystem.queries = {
    subjects: {
        components: [Ant, Age, BodyState],
    },
    agers: {
        components: [Age]
    },
    pheramones: {
        components: [Pheramone, Age]
    }
}
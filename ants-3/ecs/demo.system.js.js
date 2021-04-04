import {
    BodyState,
    PhysicsBody
} from "../engine/physics.system.js";
import {
    System,
    TagComponent
} from "../node_modules/ecsy/build/ecsy.module.js";

export class Ant extends TagComponent {}

export default class DemoSystem extends System {
    constructor(world, attrs) {
        super(world, attrs);
        this.world = world

        for (var i = 0; i < 300; i++) {
            this.world.createEntity()
                .addComponent(Ant)
                .addComponent(
                    PhysicsBody,
                    PhysicsBody.create({
                        shape: PhysicsBody.SHAPES.BOX,
                        type: PhysicsBody.TYPES.DYNAMIC,
                        height: 6,
                        width: 10,
                        x: 400,
                        y: 300,
                        angularVelocity: 1
                    })
                )
        }

    }
    execute() {



        this.queries.subjects.results.forEach(entity => {
            const bodyState = entity.getComponent(BodyState);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            bodySpec.angle += (-1 + (Math.random() * 2)) * 0.5
            bodySpec.velocity += 1

        })
    }
}

DemoSystem.queries = {
    subjects: {
        components: [Ant, BodyState]
    }
}
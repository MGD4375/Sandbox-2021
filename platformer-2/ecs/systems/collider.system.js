import {
    Not,
    System
} from "../../node_modules/ecsy/build/ecsy.module.js"
import {
    ColliderState
} from "../components/components.js"
import {
    PhysicsBody
} from "./physics.system.js"

export class ColliderSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

    }

    execute() {
        const world = this.world
        this.queries.creates.results.forEach(entity => {
            const body = entity.getComponent(PhysicsBody)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF00);
            graphics.alpha = 0.4
            graphics.drawRect(
                0 - (.5 * body.width),
                0 - (.5 * body.height),
                body.width,
                body.height
            );

            graphics.beginFill(0x000000);
            graphics.drawRect(
                0,
                0,
                3,
                3
            );

            graphics.x = body.x
            graphics.y = body.y

            world.pixi.stage.addChild(graphics)

            entity.addComponent(ColliderState, ColliderState.create(graphics))

        })

        this.queries.deletes.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            world.pixi.stage.removeChild(colliderState.ref)
            entity.removeComponent(ColliderState)


        });

        this.queries.updates.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            const body = entity.getComponent(PhysicsBody)

            colliderState.ref.x = body.x + (body.width / 2)
            colliderState.ref.y = body.y + (body.height / 2)
        });
    }
}
ColliderSystem.queries = {
    creates: {
        components: [PhysicsBody, Not(ColliderState)]
    },
    updates: {
        components: [PhysicsBody, ColliderState]
    },
    deletes: {
        components: [Not(PhysicsBody), ColliderState]
    }
}
import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import { Collider, ColliderState } from "../components/collider.component.js";
import pixiApp from "../singletons/pixi.js";

export default class DebugSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)


    }

    execute() {
        this.queries.creates.results.forEach((entity) => {
            const collider = entity.getComponent(Collider)
            const transform = entity.getComponent(Transform)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF00);
            graphics.alpha = 0.4
            graphics.drawRect(
                0 - (.5 * collider.width),
                0 - (.5 * collider.height),
                collider.width,
                collider.height
            );

            graphics.name = entity.id + '-hitbox'
            graphics.x = transform.x
            graphics.y = transform.y

            pixiApp.stage.addChild(graphics)
            entity.addComponent(ColliderState, ColliderState.create(graphics))

        });

        this.queries.deletes.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            pixiApp.stage.removeChild(colliderState.ref)
            entity.removeComponent(Collider)


        });

        this.queries.updates.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            const transform = entity.getComponent(Transform)

            colliderState.ref.x = transform.x
            colliderState.ref.y = transform.y
        });
    }

}

DebugSystem.queries = {
    creates: { components: [Collider, Not(ColliderState), Transform] },
    deletes: { components: [Not(Collider), ColliderState] },
    updates: { components: [Collider, ColliderState, Transform] }
};
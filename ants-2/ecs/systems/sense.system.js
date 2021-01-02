import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import pixiApp from "../singletons/pixi.js";
import { Sense, SenseColliderState } from "../components/sense.component.js";

export default class SenseSystem extends System {
    execute() {
        this.queries.creates.results.forEach((entity) => {
            const sense = entity.getComponent(Sense)
            const transform = entity.getComponent(Transform)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF00);
            graphics.alpha = 0
            graphics.drawRect(
                0 - (.5 * sense.range),
                0 - (.5 * sense.range),
                sense.range,
                sense.range
            );

            graphics.beginFill(0x000000);
            graphics.drawRect(
                0,
                0,
                3,
                3
            );

            graphics.name = entity.id + '-sense'
            graphics.x = transform.x
            graphics.y = transform.y

            pixiApp.stage.addChild(graphics)
            entity.addComponent(SenseColliderState, SenseColliderState.create(graphics))

        });

        this.queries.deletes.results.forEach((entity) => {
            const colliderState = entity.getComponent(SenseColliderState)
            pixiApp.stage.removeChild(colliderState.ref)
            entity.removeComponent(SenseColliderState)


        });

        this.queries.updates.results.forEach((entity) => {
            const colliderState = entity.getComponent(SenseColliderState)
            const transform = entity.getComponent(Transform)

            colliderState.ref.x = transform.x
            colliderState.ref.y = transform.y
        });
    }

}

SenseSystem.queries = {
    creates: { components: [Sense, Not(SenseColliderState), Transform] },
    deletes: { components: [Not(Sense), SenseColliderState] },
    updates: { components: [Sense, SenseColliderState, Transform] }
};
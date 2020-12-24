import { Not, System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Drawable from "../components/drawable.component.js";
import DrawableState from "../components/drawable.state.js";
import Transform from "../components/transform.component.js";
import pixiApp from "../singletons/pixi.js";

export default class DrawableSystem extends System {

    execute() {

        this.queries.creates.results.forEach(entity => {
            const transform = entity.getComponent(Transform)
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF);
            graphics.drawCircle(
                0 - (0.5 * 3),
                0 - (0.5 * 3),
                3);
            graphics.name = entity.id
            graphics.position.x = transform.x
            graphics.position.y = transform.y
            pixiApp.stage.addChild(graphics)
            entity.addComponent(DrawableState, DrawableState.create(graphics));

        })

        this.queries.updates.results.forEach(entity => {
            const transform = entity.getComponent(Transform)
            const drawableState = entity.getComponent(DrawableState)
            drawableState.ref.position.x = transform.x
            drawableState.ref.position.y = transform.y

        })

        this.queries.deletes.results.forEach(entity => {
            entity.removeComponent(DrawableState)

        })

    }
}

DrawableSystem.queries = {
    creates: { components: [Drawable, Not(DrawableState), Transform] },
    updates: { components: [Drawable, DrawableState, Transform] },
    deletes: { components: [Not(Drawable), DrawableState, Transform] },
};
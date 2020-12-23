import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import SpriteState from "../components/sprite.state.js";
import pixiApp from "../singletons/pixi.js";
import Colour from "../components/colour.component.js";
import Drawable from "../components/drawable.component.js";

export default class DrawableSystem extends System {
    execute() {
        this.queries.creates.results.forEach(entity => {
            var colour = entity.getComponent(Colour)
            var transform = entity.getComponent(Transform)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF);
            graphics.lineStyle(2, 0x000000);
            graphics.drawCircle(
                0 - (0.5 * 3),
                0 - (0.5 * 3),
                3);
            graphics.name = entity.id
            graphics.description = 'drawable'
            graphics.position.x = transform.x
            graphics.position.y = transform.y
            graphics.tint = colour.toHex()


            pixiApp.stage.addChild(graphics)
            entity.addComponent(SpriteState, SpriteState.create(graphics));
        });

        this.queries.updates.results.forEach(entity => {
            var transform = entity.getComponent(Transform)
            var spriteState = entity.getMutableComponent(SpriteState)

            spriteState.ref.position.x = transform.x
            spriteState.ref.position.y = transform.y



        });
    }

}

DrawableSystem.queries = {
    creates: { components: [Drawable, Not(SpriteState), Transform, Colour] },
    updates: { components: [Drawable, SpriteState, Transform, Colour] }
};
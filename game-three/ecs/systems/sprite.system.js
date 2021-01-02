import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import Sprite from "../components/sprite.component.js";
import SpriteState from "../components/sprite.state.js";
import pixiApp from "../singletons/pixi.js";
import Colour from "../components/colour.component.js";
import Angle from "../components/angle.component.js";
import Velocity from "../components/velocity.component.js";
import Drawable from "../components/drawable.component.js";

export default class SpriteSystem extends System {
    execute() {
        this.queries.creates.results.forEach(entity => {
            var colour = entity.getComponent(Colour)
            var transform = entity.getComponent(Transform)
            var spriteInfo = entity.getComponent(Sprite)
            let sheet = PIXI.Loader.shared.resources[spriteInfo.file];
            var sprite = new PIXI.AnimatedSprite(sheet.spritesheet.animations[spriteInfo.name]);
            sprite.name = entity.id
            sprite.description = spriteInfo.name
            sprite.height = (sprite.height / 10) * spriteInfo.scale
            sprite.width = (sprite.width / 10) * spriteInfo.scale
            sprite.animationSpeed = 5
            sprite.position.x = transform.x
            sprite.position.y = transform.y
            sprite.tint = colour.toHex()
            sprite.play();
            pixiApp.stage.addChild(sprite)
            entity.addComponent(SpriteState, SpriteState.create(sprite));
        });

        this.queries.deletes.results.forEach(entity => {
            var spriteState = entity.getComponent(SpriteState)
            pixiApp.stage.removeChild(spriteState.ref)
            entity.removeComponent(SpriteState);
        });

        this.queries.updates.results.forEach(entity => {
            var velocity = entity.getComponent(Velocity)
            var angle = entity.getComponent(Angle)
            var transform = entity.getComponent(Transform)
            var spriteState = entity.getMutableComponent(SpriteState)

            spriteState.ref.rotation = angle.value + Angle.QUARTER // Rotate 90d
            spriteState.ref.position.x = transform.x
            spriteState.ref.position.y = transform.y

            if (velocity.value === 0 && spriteState.ref.playing) {
                spriteState.ref.stop()
            } else if (velocity.value !== 0 && !spriteState.ref.playing) {
                spriteState.ref.play()
            }

        });
    }

}

SpriteSystem.queries = {
    creates: { components: [Sprite, Not(SpriteState), Transform, Colour, Angle, Velocity] },
    deletes: { components: [Not(Sprite), Not(Drawable), SpriteState] },   //  Change
    updates: { components: [Sprite, SpriteState, Transform, Colour, Angle, Velocity] }
};
import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import pixiApp from "../singletons/pixi.js";
import Player from "../components/player.component.js";
import Health from "../components/health.component.js";
import { UI } from "../components/camera.component.js";
import { SpriteState } from "../components/sprite.component.js";
import CONFIG from "../../app.config.js";

export default class UiSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.healthBar = null

    }

    execute() {
        this.queries.createUi.results.forEach((entity) => {
            let container = new PIXI.Container();
            container.width = CONFIG.WIDTH
            container.height = CONFIG.HEIGHT
            container.pivot.x = CONFIG.WIDTH * 0.5;
            container.pivot.y = CONFIG.HEIGHT * 0.5;
            entity.addComponent(SpriteState, SpriteState.create(container))
            pixiApp.stage.addChild(container)
        })

        this.queries.deleteUi.results.forEach((entity) => {
            entity.RemoveComponent(SpriteState)
            pixiApp.stage.removeChild(container)
        })

        this.queries.updateUi.results.forEach((entity) => {
            const player = this.queries.players.results[0]
            if (!player) { return }
            const container = entity.getComponent(SpriteState).ref
            container.removeChild(this.healthBar)

            const health = player.getComponent(Health)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0x000000);
            graphics.drawRect(
                0,
                0,
                health.max + 12,
                30
            );

            graphics.beginFill(0xFF0000);
            graphics.drawRect(
                6,
                6,
                health.value,
                18
            );

            graphics.x = 30
            graphics.y = 30

            container.addChild(graphics)
            this.healthBar = graphics

        });
    }
}

UiSystem.queries = {
    createUi: { components: [UI, Not(SpriteState)] },
    updateUi: { components: [UI, SpriteState] },
    deleteUi: { components: [Not(UI), SpriteState] },
    players: { components: [Player, Health] },
};
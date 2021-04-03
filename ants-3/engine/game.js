import {
    World
} from "../node_modules/ecsy/build/ecsy.module.js";
import {
    PhysicsBody
} from "./physics.system.js";

export default class Game extends World {
    constructor() {
        super()
        const game = this;
        game.pixi = new PIXI.Application();

        document.body.appendChild(game.pixi.view);
        game.pixi.renderer.backgroundColor = 0x7F7F7F;




        game.pixi.ticker.add(delta => {
            game.execute(delta)
        })

    }
}
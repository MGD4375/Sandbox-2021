import {
    World
} from "../node_modules/ecsy/build/ecsy.module.js";

export default class Game extends World {
    constructor(width, height) {
        super()
        const game = this;
        game.pixi = new PIXI.Application({
            width: width, // default: 800
            height: height, // default: 600
            resolution: 1 // default: 1
        });


        this.width = width
        this.height = height

        document.body.appendChild(game.pixi.view);
        game.pixi.renderer.backgroundColor = 0x7F7F7F;

        game.pixi.ticker.add(delta => {
            game.execute(delta)
        })

    }
}
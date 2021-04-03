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


            for (var i = 0; i < 1; i++) {
                const entity = game.createEntity()
                    .addComponent(
                        PhysicsBody,
                        PhysicsBody.create({
                            shape: PhysicsBody.SHAPES.BOX,
                            type: PhysicsBody.TYPES.STATIC,
                            height: (30 + (Math.random() * 60)) / 5,
                            width: (30 + (Math.random() * 60)) / 5,
                            x: 100 + (Math.random() * 600),
                            y: 100 + (Math.random() * 400),
                        })
                    )
            }

        })

    }
}
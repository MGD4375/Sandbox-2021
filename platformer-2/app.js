import {
    InputState,
    KeyboardState
} from "./ecs/systems/keyboard.system.js";
import {
    PhysicsBody
} from "./ecs/systems/physics.system.js";
import Platformer from "./game.js";


!async function () {
    const game = await Platformer.create()

    game.createEntity()
        .addComponent(InputState)
        .addComponent(KeyboardState)
        .addComponent(PhysicsBody, PhysicsBody.create(30, 30, 60, 90))


    const staticBody = PhysicsBody.create(0, 600, game.width, 60)
    staticBody.static = true
    game.createEntity()
        .addComponent(PhysicsBody, staticBody)


    game.pixi.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta) {
        game.execute(delta);
    }
}();
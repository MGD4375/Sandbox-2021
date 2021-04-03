import DemoSystem, {
    Ant
} from "./ecs/demo.system.js.js";
import Game from "./engine/game.js";
import {
    PhysicsBody,
    BodyState,
    PhysicsSystem,
} from "./engine/physics.system.js";
import {
    BoxSpriteState,
    RenderSystem
} from "./engine/renderer.system.js";

const game = new Game()
    .registerComponent(PhysicsBody)
    .registerComponent(BodyState)
    .registerComponent(BoxSpriteState)
    .registerComponent(Ant)
    .registerSystem(PhysicsSystem)
    .registerSystem(RenderSystem)
    .registerSystem(DemoSystem)



const entity = game.createEntity()
    .addComponent(Ant)
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.DYNAMIC,
            height: 10,
            width: 6,
            x: 400,
            y: 300,
            angularVelocity: 1
        })
    )
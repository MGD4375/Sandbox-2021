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


// for (var i = 0; i < 60; i++) {
//     const entity = game.createEntity()
//         .addComponent(
//             PhysicsBody,
//             PhysicsBody.create({
//                 shape: PhysicsBody.SHAPES.BOX,
//                 type: PhysicsBody.TYPES.STATIC,
//                 height: (30 + (Math.random() * 60)),
//                 width: (30 + (Math.random() * 60)),
//                 x: 100 + (Math.random() * 600),
//                 y: 100 + (Math.random() * 400),
//             })
//         )
// }


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
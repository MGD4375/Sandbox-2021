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

const width = 1440,
    height = 900;

const game = new Game(width, height)
    .registerComponent(PhysicsBody)
    .registerComponent(BodyState)
    .registerComponent(BoxSpriteState)
    .registerComponent(Ant)
    .registerSystem(PhysicsSystem)
    .registerSystem(RenderSystem)
    .registerSystem(DemoSystem)



//  Top
const thickness = 50
game.createEntity()
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.STATIC,
            height: thickness,
            width: width,
            x: width / 2,
            y: thickness / 2,
        })
    )
//  Right
game.createEntity()
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.STATIC,
            height: height,
            width: thickness,
            x: width - thickness / 2,
            y: height / 2,
        })
    )
//  Bottom
game.createEntity()
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.STATIC,
            height: thickness,
            width: width,
            x: width / 2,
            y: height - (thickness / 2),
        })
    )
//  Left
game.createEntity()
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.STATIC,
            height: height,
            width: thickness,
            x: thickness / 2,
            y: height / 2,
        })
    )
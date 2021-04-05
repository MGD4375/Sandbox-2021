import DemoSystem, {
    Age,
    Ant,
    HomePheramone,
    Hive,
    Food,
    CarryingFood,
    FoodPheramone
} from "./ecs/demo.system.js.js";
import Game from "./engine/game.js";
import {
    PhysicsBody,
    BodyState,
    PhysicsSystem,
    SensorBody,
    SensorState,
} from "./engine/physics.system.js";
import {
    BoxSpriteState,
    Render,
    RenderSystem
} from "./engine/renderer.system.js";

const width = 1440,
    height = 900;

const game = new Game(width, height)
    .registerComponent(PhysicsBody)
    .registerComponent(SensorBody)
    .registerComponent(SensorState)
    .registerComponent(BodyState)
    .registerComponent(BoxSpriteState)
    .registerComponent(CarryingFood)
    .registerComponent(FoodPheramone)
    .registerComponent(HomePheramone)
    .registerComponent(Food)
    .registerComponent(Render)
    .registerComponent(Age)
    .registerComponent(Hive)
    .registerComponent(Ant)
    .registerSystem(PhysicsSystem)
    .registerSystem(RenderSystem)
    .registerSystem(DemoSystem)



//  Top
const thickness = 2
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


for (var i = 0; i < 120; i++) {
    game.createEntity()
        .addComponent(Food)
        .addComponent(Render)
        .addComponent(
            PhysicsBody,
            PhysicsBody.create({
                shape: PhysicsBody.SHAPES.BOX,
                type: PhysicsBody.TYPES.STATIC,
                height: 12,
                width: 12,
                x: 1300 + (Math.random() * 100),
                y: 800 + (Math.random() * 100),
                velocity: 0,
                angle: Math.random() * 260

            })
        )
}

for (var i = 0; i < 120; i++) {
    game.createEntity()
        .addComponent(Food)
        .addComponent(Render)
        .addComponent(
            PhysicsBody,
            PhysicsBody.create({
                shape: PhysicsBody.SHAPES.BOX,
                type: PhysicsBody.TYPES.STATIC,
                height: 12,
                width: 12,
                x: 200 + (Math.random() * 100),
                y: 400 + (Math.random() * 100),
                velocity: 0,
                angle: Math.random() * 260

            })
        )
}

game.createEntity()
    .addComponent(Render)
    .addComponent(Hive)
    .addComponent(
        PhysicsBody,
        PhysicsBody.create({
            shape: PhysicsBody.SHAPES.BOX,
            type: PhysicsBody.TYPES.STATIC,
            height: 60,
            width: 60,
            x: 400,
            y: 300,
            velocity: 0
        })
    )
import Pixi from "./ecs/components/pixi.component.js";
import { Collider, ColliderState, RenderSystem, Transform } from "./ecs/systems/render.system.js";
import { PhysicsBody, PhysicsState, PlatformerPhysicsSystem as PhysicsSystem } from "./ecs/systems/physics.system.js";
import { World } from "./node_modules/ecsy/build/ecsy.module.js";

const world = new World().registerComponent(Pixi)
const pixi = world.createEntity().addComponent(Pixi, Pixi.create(480 * 3, 270 * 3))
world.pixiApp = pixi.getComponent(Pixi).ref
world.pixiApp.ticker.add(delta => gameLoop(delta))

world
  .registerComponent(Collider)
  .registerComponent(ColliderState)
  .registerComponent(PhysicsState)
  .registerComponent(PhysicsBody)
  .registerComponent(Transform)
  .registerSystem(PhysicsSystem)
  .registerSystem(RenderSystem)


for (let i = 0; i < 1; i++) {
  world.createEntity()
    .addComponent(PhysicsBody, PhysicsBody.create(true))
    .addComponent(Transform, Transform.create(750, 800))
    .addComponent(Collider, Collider.create(1500, 40))
}




var i = 0
function gameLoop(delta) {
  i++
  if (i % 10 === 0) {
    world.createEntity()
      .addComponent(PhysicsBody, PhysicsBody.create(false))
      .addComponent(Transform, Transform.create(Math.random() * 1400, 50))
      .addComponent(Collider, Collider.create(40, 40))
  }

  world.execute(delta)
}